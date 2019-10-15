-- -- setup (already done) -- DO NOT RUN !!!



-- -- alter extension postgis update;

-- -- ALTER TABLE cities
-- --   ADD COLUMN geog geography(Point,4326);

-- -- UPDATE cities SET geog = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography;

-- -- -- ALTER TABLE cities ADD COLUMN id SERIAL PRIMARY KEY;
-- -- ALTER TABLE public.cities ADD UNIQUE CONSTRAINT cities_k_key PRIMARY KEY (k)

-- -- ALTER TABLE cities ADD UNIQUE (i);
-- -- ALTER TABLE cities ADD UNIQUE (k);

-- -- index geography
-- DROP INDEX IF EXISTS cities_geog_idx;
-- CREATE INDEX cities_geog_idx
--   ON cities
--   USING gist
--   (geog);

-- -- cluster for performance
-- CLUSTER cities USING cities_geog_idx;


-- -- index autocomplete
-- drop index if exists cities_autocomplete_idx;

-- CREATE INDEX cities_autocomplete_idx ON cities(n text_pattern_ops, state text_pattern_ops, c text_pattern_ops, u text_pattern_ops, i text_pattern_ops)

-- CREATE INDEX cities_autocomplete_state_idx ON cities(state text_pattern_ops)

-- CREATE INDEX cities_autocomplete_c_idx ON cities(c text_pattern_ops)

-- CREATE INDEX cities_autocomplete_u_idx ON cities(u text_pattern_ops)

-- CREATE INDEX cities_autocomplete_i_idx ON cities(i text_pattern_ops)


-- -- date trigger
-- CREATE OR REPLACE FUNCTION trigger_set_timestamp()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- alter table rome2rio_routes add updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

-- DROP TRIGGER IF EXISTS set_timestamp ON rome2rio_routes;
-- create TRIGGER set_timestamp
-- BEFORE insert or UPDATE ON rome2rio_routes
-- FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_timestamp();

-- CREATE UNIQUE INDEX IF NOT EXISTS uq_romerio_fromto ON public.rome2rio_routes(fromcity,tocity);



-- -- population
-- create table osmpopulation as (
-- select population,poi,poly,paths from tags
-- where population is not null
-- )

-- -- triggers
-- -- INSERT trigger
-- DROP TRIGGER IF EXISTS tr_cities_inserted ON cities;
-- CREATE TRIGGER tr_cities_inserted
--   BEFORE INSERT ON cities
--   FOR EACH ROW
--   EXECUTE PROCEDURE fn_cities_geo_update_event();


--  --  UPDATE trigger
-- DROP TRIGGER IF EXISTS tr_cities_geo_updated ON cities;
-- CREATE TRIGGER tr_cities_geo_updated
--   BEFORE UPDATE OF 
--   latitude,
--   longitude
--   ON cities
--   FOR EACH ROW
--   EXECUTE PROCEDURE fn_cities_geo_update_event();

-- DROP TRIGGER IF EXISTS a_trigger_alwaysupdate ON cities;
  

-- -- test queries
-- --INSERT INTO cities (latitude, longitude) VALUES(43.653226, -79.3831843);
-- --UPDATE cities SET latitude=39.653226 WHERE id=1;
-- --SELECT to_timestamp(updated_ts), * FROM cities;


-- UPDATE cities SET rent_avg = rent_avg + random()
-- where rent_avg is not null;

-- UPDATE cities SET food_avg = food_avg + random()
-- where food_avg is not null;

-- UPDATE cities SET transport_avg = transport_avg + random()
-- where transport_avg is not null;

-- UPDATE cities SET rent_low = rent_low + random()
-- where rent_low is not null;

-- UPDATE cities SET food_low = food_low + random()
-- where food_low is not null;

-- UPDATE cities SET rent_high = rent_high + random()
-- where rent_high is not null;

-- UPDATE cities SET food_high = food_high + random()
-- where food_high is not null;


-- --cost mesh network grid
-- -- drop table costmesh;
-- create
--   table
--     costmesh( k text null,
--     rent_low numeric(8,
--     4) null,
--     rent_avg numeric(8,
--     4) null,
--     rent_high numeric(8,
--     4) null,
--     food_low numeric(8,
--     4) null,
--     food_avg numeric(8,
--     4) null,
--     food_high numeric(8,
--     4) null,
--     transport_bus numeric(8,
--     4) null,
--     transport_train numeric(8,
--     4) null,
--     transport_avg numeric(8,
--     4) null,
--     transport_taxi numeric(8,
--     4) null,
--     transport_rentalcar numeric(8,
--     4) null,
--     transport_buycar numeric(8,
--     4) null,
--     phonedata_permb numeric(20,
--     19) null,
--     CONSTRAINT costmesh_key PRIMARY KEY (k)
--     );

-- -- create grid
--   insert into
--   costmesh (k) 
--   select
--     distinct st_geohash(geog,3) as k
--   from
--     cities_new
--     union
--   select distinct st_geohash(geog,3) k from cities
--   on conflict (k) do nothing;

-- alter table costmesh add column geom geometry(Polygon);
-- update costmesh set geom = ST_GeomFromGeoHash(k);

-- -- create cost kernel from cities data
-- update costmesh as a
-- set 
-- rent_low = c.rent_low,
-- rent_avg = c.rent_avg,
-- rent_high = c.rent_high,
-- food_low = c.food_low,
-- food_avg = c.food_avg,
-- food_high = c.food_high,
-- transport_bus = c.transport_bus,
-- transport_train = c.transport_train,
-- transport_avg = c.transport_avg,
-- transport_taxi = c.transport_taxi,
-- transport_rentalcar = c.transport_rentalcar,
-- transport_buycar = c.transport_buycar
-- from
-- (
-- select 
-- t.geom,
-- avg(t.rent_low) rent_low,
-- avg(t.rent_avg) rent_avg,
-- avg(t.rent_high) rent_high,
-- avg(t.food_low) food_low,
-- avg(t.food_avg) food_avg,
-- avg(t.food_high) food_high,
-- avg(t.transport_bus) transport_bus,
-- avg(t.transport_train) transport_train,
-- avg(t.transport_avg) transport_avg,
-- avg(t.transport_taxi) transport_taxi,
-- avg(t.transport_rentalcar) transport_rentalcar,
-- avg(t.transport_buycar) transport_buycar
-- from
-- (
-- select 
-- c.rent_low,
-- c.rent_avg,
-- c.rent_high,
-- c.food_low,
-- c.food_avg,
-- c.food_high,
-- c.transport_bus,
-- c.transport_train,
-- c.transport_avg,
-- c.transport_taxi,
-- c.transport_rentalcar,
-- c.transport_buycar,
-- geom
--   from
--     cities c,costmesh a
--     where ST_Intersects(geog::geometry, ST_SetSRID(a.geom,4326))
--     ) t
--     group by t.geom
--     ) c
--     where c.geom = a.geom