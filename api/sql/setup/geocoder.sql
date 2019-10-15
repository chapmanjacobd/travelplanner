-- geocoder (city name to latlong)
-- try 1:
select i.n,i.s,i.u,o.name,o.alternative_names,o.lat,o.lon from cities as i, osmnames as o
where o."name" = i.n
and o.state = i.s
and o.country_code = lower(i.u)
and type != 'island'
and type != 'state'
and type != 'county'
and class = 'boundary'
order by importance desc, length(alternative_names) desc;

-- try 2:
select i.n,i.s,i.u,o.name,o.alternative_names,o.lat,o.lon from cities as i, osmnames as o
where o."name" = i.n
and o.state ~ i.s
and o.country_code = lower(i.u)
and type != 'island'
and type != 'state'
and type != 'county'
and class = 'boundary'
order by importance desc, length(alternative_names) desc;

-- try 3:
select i.n,i.s,i.u,o.name,o.alternative_names,o.lat,o.lon from cities as i, osmnames as o
where o."name" ~ i.n
and o.state ~ i.s
and o.country_code = lower(i.u)
and type != 'island'
and type != 'state'
and type != 'county'
and class = 'boundary'
order by importance desc, length(alternative_names) desc;

-- try 4:
select i.n,i.s,i.u,o.name,o.alternative_names,o.lat,o.lon from cities as i, osmnames as o
where o.alternative_names ~ i.n
and o.state ~ i.s
and o.country_code = lower(i.u)
and type != 'island'
and type != 'state'
and type != 'county'
and class = 'boundary'
order by importance desc, length(alternative_names) desc;

-- try 5:
select i.n,i.s,i.u,o.name,o.alternative_names,o.lat,o.lon from cities as i, osmnames as o
where o.alternative_names ~ i.n
and o.country_code = lower(i.u)
order by importance desc, length(alternative_names) desc;



-- list all cities of an area
select * from osmnames 
where country_code = lower('JP')
and state ~* '\yKyushu'
and type != 'island'
and type != 'state'
and type != 'county'
order by  importance desc, length(alternative_names) desc

select name as n,alternative_names as nl_n,lat,lon from osmnames 
where type != 'island'
and type != 'state'
and type != 'county'
and importance > 0.3
and osm_type != 'way'
and country_code = 'tw'
and alternative_names != ''
and not lower("name") like any ('{%district,%ward,%county,%province,%zone,%reservoir,%lake}') -- this will of course cause problems for places named 'Big Lake'
order by importance desc, length(alternative_names) desc
;