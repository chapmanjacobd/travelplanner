DROP TABLE IF EXISTS cities_new;

CREATE TABLE IF NOT EXISTS cities_new (
  k text NOT NULL,
  i text NULL,
	l bool NULL,
	n text NULL,
	s text NULL,
	population int4 NULL,
	creative text NULL,
	nl_n text NULL,
	nl_s text NULL,
	nl_c text NULL,
	u text NULL,
	c text NULL,
	r text NULL,
	hcid text NULL,
	hc int4 NULL,
	rent_low numeric(8,4) NULL,
  rent_avg numeric(8,4) NULL,
	rent_high numeric(8,4) NULL,
  food_low numeric(8,4) NULL,
	food_avg numeric(8,4) NULL,
	food_high numeric(8,4) NULL,
	transport_bus numeric(8,4) NULL,
	transport_train numeric(8,4) NULL,
	transport_avg numeric(8,4) NULL,
	transport_taxi numeric(8,4) NULL,
	transport_rentalcar numeric(8,4) NULL,
	transport_buycar numeric(8,4) NULL,
  -- phonedata_permb numeric(20,19) NULL,
	x int4 NULL,
  area float4 null,
  placetype text null,
  density integer null,
  wof_id integer null,
	latitude float4 NULL,
	longitude float4 NULL,
  geog geography(Point, 4326) NULL,
  date_modified date DEFAULT now(),
	-- CONSTRAINT cities_newi_key UNIQUE (i),
	CONSTRAINT cities_newk_key PRIMARY KEY (k)
);

--select * from pg_stat_activities;

DROP TRIGGER IF EXISTS tr_citiesn_inserted ON cities_new;
CREATE TRIGGER tr_citiesn_inserted
  BEFORE INSERT ON cities_new
  FOR EACH ROW
  EXECUTE PROCEDURE fn_cities_geo_update_event();

 --  UPDATE trigger
DROP TRIGGER IF EXISTS tr_cities_geo_updated ON cities_new;
CREATE TRIGGER tr_citiesn_geo_updated
  BEFORE UPDATE OF 
  latitude,
  longitude
  ON cities_new
  FOR EACH ROW
  EXECUTE PROCEDURE fn_cities_geo_update_event();

--get cities from osmnames
-- insert
--   into
--     cities_new ( n,
--     nl_n,
--     latitude,
--     longitude ) select
--       name as n,
--       alternative_names as nl_n,
--       lat::real,
--       lon::real
--     from
--       osmnames
--     where
--       type != 'island'
--       and type != 'state'
--       and type != 'county'
--       and type != 'continent'
--       and type != 'sea'
--       and class != 'natural'
--       and class != 'landuse'
--       and place_rank != 4
--       and importance > 0.3
--       and osm_type != 'way'
--       and alternative_names != '' --this will remove 151,000
--       and not lower("name") like any ('{% district,% ward,% county,% province,% zone,% reservoir,% subdistrict, %\",% division,% raion,郡}')
--     order by
--       importance desc,
--       length(alternative_names) desc on
--       conflict do nothing;

insert into cities_new 
(k,i,l,n,s,population,creative,nl_n,nl_s,nl_c,u,c,r,hcid,hc,rent_low,rent_avg,rent_high,food_low,food_avg,food_high,transport_bus,transport_train,transport_avg,transport_taxi,transport_rentalcar,transport_buycar,x,latitude,longitude,geog,placetype,area,density,wof_id)
select 
k,i,l,n,s,population,creative,nl_n,nl_s,nl_c,u,c,r,hcid,hc,rent_low,rent_avg,rent_high,food_low,food_avg,food_high,transport_bus,transport_train,transport_avg,transport_taxi,transport_rentalcar,transport_buycar,x,latitude,longitude,geog,placetype,area,density,wof_id
from cities;
on conflict do nothing;

--
create table test as 
SELECT * FROM cities
ORDER BY RANDOM()
LIMIT 12

-- remove duplicates
select *
from cities as t
inner join
    (select n,s,u
     from cities as t
     group by n,s,u
     having count(*) > 2) dups 
  on dups.n = t.n and dups.s = t.s and dups.u = t.u
order by t.n,t.s,t.u,t.i,t.hc desc,length(nl_n) desc,t.population desc

--
select *
from
(
SELECT 
  c1.k,
  c1.i,
  c1.l,
  c1.n,
  c1.s,
  c1.population,
  c1.creative,
  c1.nl_n,
  c1.nl_s,
  c1.nl_c,
  c1.u,
  c1.c,
  c1.r,
  c1.hcid,
  c1.hc,
  c1.density,
  c1.rent_low,
  c1.x,
  ROW_NUMBER() OVER(order by c1.c,c1.s,c1.n,length(c1.nl_n) desc,c1.population asc) as rownum
  FROM cities_new as c1
    INNER JOIN cities_new c2
  ON ST_dWithin(c1.geog,c2.geog,500000)
  WHERE c1.k != c2.k
    AND c1.n = c2.n
    AND c1.c = c2.c
    AND c1.s = c2.s
  order by c1.c,c1.s,c1.n,length(c1.nl_n) desc,c1.population desc
  ) t
  where mod(rownum,2) = 0
  ;

-- INSERT INTO public.cities_new (l, u, n, population, creative, r, c, rent_avg, rent_low, rent_high, food_avg, food_low, food_high, transport_avg, i, hcid, hc, latitude, longitude, spread, density, distance, s, geog, transport_bus, transport_train, transport_taxi, transport_rentalcar, transport_buycar, x, nl_s, nl_c, k, nl_n) 
-- SELECT l, u, n, population, creative, r, c, rent_avg, rent_low, rent_high, food_avg, food_low, food_high, transport_avg, i, hcid, hc, latitude, longitude, spread, density, distance, s, geog, transport_bus, transport_train, transport_taxi, transport_rentalcar, transport_buycar, x, nl_s, nl_c, k, nl_n
-- from cities;

-- index
CREATE INDEX citiesn_autocomplete_n_idx     ON public.cities_new USING btree (n text_pattern_ops);
CREATE INDEX citiesn_autocomplete_s_idx ON public.cities_new USING btree (s text_pattern_ops);
CREATE INDEX citiesn_autocomplete_c_idx     ON public.cities_new USING btree (c text_pattern_ops);
CREATE INDEX citiesn_autocomplete_i_idx     ON public.cities_new USING btree (i text_pattern_ops);
CREATE INDEX citiesn_autocomplete_nl_s_idx     ON public.cities_new USING btree (nl_s text_pattern_ops);
CREATE INDEX citiesn_autocomplete_nl_c_idx     ON public.cities_new USING btree (nl_c text_pattern_ops);
-- CREATE INDEX citiesn_autocomplete_idx       ON public.cities_new USING btree (n text_pattern_ops, s text_pattern_ops, c text_pattern_ops, i text_pattern_ops, nl_s text_pattern_ops, nl_c text_pattern_ops);
-- CREATE INDEX citiesn_autocompletegist_idx       ON public.cities_new USING gist (n text_pattern_ops, s text_pattern_ops, c text_pattern_ops, i text_pattern_ops, nl_n text_pattern_ops, nl_s text_pattern_ops, nl_c text_pattern_ops);
CREATE INDEX citiesn_geog_idx               ON public.cities_new USING gist (geog);

CLUSTER public.cities_new USING citiesn_geog_idx; -- exclusive lock on db

-- create unique index on filtered cities
CREATE UNIQUE INDEX unique_airportindex
ON cities (i, l)
where l = false;

-- create index citiesk on cities (k) where l;


-- get number of connections between cities

--local
DROP TABLE IF EXISTS connections;
CREATE TABLE IF NOT EXISTS connections AS
-- select a.k, (least(25, b.count) + 3) as x
SELECT a.k, count(a.k) x
FROM    cities AS a
JOIN    cities AS b
  ON    ST_DWithin(a.geog, b.geog, 80000)
WHERE    a.l = true and a.k > b.k
group by a.k
;

UPDATE cities as a
SET x = b.x
FROM connections as b
where a.k = b.k
;


--airport
DROP TABLE IF EXISTS connections;
CREATE TABLE IF NOT EXISTS connections AS
select a.k k, c.count as x
from cities as a
join (
  SELECT
    from_city, 
    count(*) 
  FROM
    (
    select distinct a.city_code as to_city, b.city_code as from_city
      FROM routes_kiwi r
      join map_citycode as a
      on "flyTo" = a.airport_code
      join map_citycode as b
      on "flyFrom" = b.airport_code
    union all 
    select distinct "flyTo", "flyFrom" 
      FROM routes_kiwi
    ) 
    t
  group by from_city
) as c
on c.from_city = a.i
where a.l = false
;

UPDATE cities as a
SET x = b.x
FROM connections as b
where a.k = b.k
;










-- replace city data

vacuum full public.cities_new;

vacuum ANALYZE public.cities_new;

begin;
DROP TABLE IF EXISTS cities_old;
ALTER TABLE cities_old DROP CONSTRAINT cities_oldi_key;
ALTER TABLE cities_old DROP CONSTRAINT cities_oldk_key;
DROP INDEX cities_autocomplete_n_idx;
DROP INDEX cities_autocomplete_s_idx;
DROP INDEX cities_autocomplete_c_idx;
DROP INDEX cities_autocomplete_i_idx;
DROP INDEX cities_autocomplete_nl_n_idx;
DROP INDEX cities_autocomplete_nl_s_idx;
DROP INDEX cities_autocomplete_nl_c_idx;
DROP INDEX cities_autocomplete_idx;
DROP INDEX cities_geog_idx;

ALTER TABLE cities RENAME TO cities_old;
ALTER TABLE cities_new RENAME TO cities;

ALTER TABLE cities_old RENAME CONSTRAINT cities_i_key TO cities_oldi_key;
ALTER TABLE cities_old RENAME CONSTRAINT cities_k_key TO cities_oldk_key;
ALTER TABLE cities RENAME CONSTRAINT cities_newi_key TO cities_i_key;
ALTER TABLE cities RENAME CONSTRAINT cities_newk_key TO cities_k_key;

ALTER INDEX citiesn_autocomplete_n_idx RENAME TO cities_autocomplete_n_idx;
ALTER INDEX citiesn_autocomplete_s_idx RENAME TO cities_autocomplete_s_idx;
ALTER INDEX citiesn_autocomplete_c_idx RENAME TO cities_autocomplete_c_idx;
ALTER INDEX citiesn_autocomplete_i_idx RENAME TO cities_autocomplete_i_idx;
ALTER INDEX citiesn_autocomplete_nl_s_idx RENAME TO cities_autocomplete_nl_s_idx;
ALTER INDEX citiesn_autocomplete_nl_c_idx RENAME TO cities_autocomplete_nl_c_idx;
ALTER INDEX citiesn_geog_idx RENAME TO cities_geog_idx;

end;