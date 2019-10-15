-- geo trigger function
CREATE OR REPLACE FUNCTION fn_cities_geo_update_event() RETURNS trigger AS $fn_cities_geo_update_event$
  BEGIN
  if NEW.nl_n IS NULL then
  NEW.nl_n := NEW.n;
  end if;
  if NEW.nl_s IS NULL then
  NEW.nl_s := NEW.s;
  end if;
  NEW.n := unaccent(NEW.n);
  NEW.s := unaccent(NEW.s);
-- RAISE NOTICE 'Block1 %', clock_timestamp();
  -- get geography dupdooodoooduup!
  NEW.geog := ST_SetSRID(ST_MakePoint(NEW.longitude,NEW.latitude), 4326)::geography;
  NEW.k := ST_GeoHash(NEW.geog,6);
  -- yo
-- RAISE NOTICE 'Block7 %', clock_timestamp();
  -- if NEW.i IS NULL then
  if NEW.l IS NULL then
    NEW.l := true;
  --   else 
  --   NEW.l := false;
  end if;
-- RAISE NOTICE 'Block8 %', clock_timestamp();
  if NEW.c IS NULL then
    NEW.c := (
    select g.name_0
    from gadm as g
    where ST_Intersects(NEW.geog::geometry, g.wkb_geometry)
    );
  end if;
-- RAISE NOTICE 'Block9 %', clock_timestamp();
  if NEW.u IS NULL then
    NEW.u := (
    select iso2c 
    from map_region 
    where lower("country.name.en") = lower(NEW.c)
    order by length("country.name.en")
    limit 1
    );
  end if;
-- RAISE NOTICE 'Block10 %', clock_timestamp();
  if NEW.u IS NULL then
    NEW.u := (
    select iso2c 
    from map_region 
    where lower("country.name.en.regex") ~ lower(NEW.c)
    or lower("country.name.en") ~ lower(NEW.c)
    order by length("country.name.en")
    limit 1
    );
  end if;
  if NEW.r IS NULL then
    NEW.r := (
    select region 
    from map_region 
    where iso2c = NEW.u
    order by length("country.name.en")
    limit 1
    );
  end if;
-- RAISE NOTICE 'Block11 %', clock_timestamp();
  if NEW.s IS NULL then
    NEW.s := (
    select g.name_1 
    from gadm as g
    where ST_Intersects(NEW.geog::geometry, g.wkb_geometry)
    );
  end if;
  if NEW.nl_s IS NULL then
    NEW.nl_s := (
    select g.nl_name_2
    from gadm as g
    where ST_Intersects(NEW.geog::geometry, g.wkb_geometry)
    );
  end if;
-- RAISE NOTICE 'Block12 %', clock_timestamp();
  if NEW.nl_c IS NULL then
    NEW.nl_c := (
    select g.nl_name_1
    from gadm as g
    where ST_Intersects(NEW.geog::geometry, g.wkb_geometry)
    );
  end if;
-- RAISE NOTICE 'Block13 %', clock_timestamp();
  if NEW.population IS null then
    NEW.population := (
      SELECT avg(a.population)
      FROM osmpopulation as a
      where ST_DWithin(a.geog, NEW.geog, 1000)
    );
  end if;
-- RAISE NOTICE 'Block13.5 %', clock_timestamp();
  if NEW.population IS null then
    NEW.population := (
      SELECT avg(a.population)
      FROM osmpopulation as a
      where ST_DWithin(a.geog, NEW.geog, 5000)
    );
  end if;
-- RAISE NOTICE 'Block14 %', clock_timestamp();
  if NEW.population IS null then
    NEW.population := (
      SELECT avg(a.population)
      FROM osmpopulation as a
      where ST_DWithin(a.geog, NEW.geog, 10000)
    );
  end if;
-- RAISE NOTICE 'Block15 %', clock_timestamp();
  if NEW.population IS null then
    NEW.population := (
      SELECT avg(a.population)
      FROM osmpopulation as a
      where ST_DWithin(a.geog, NEW.geog, 40000)
    );
  end if;
-- RAISE NOTICE 'Block16 %', clock_timestamp();
  if NEW.hcid IS NULL then
    NEW.hcid := (
      select k from hotelscombined as h
      where lower(h.cc) = lower(NEW.u)
      and not h.k ~ 'hotel'
      and (lower(h.p) ~ lower(NEW.n) or lower(h.n) ~ lower(NEW.n) or lower(h.k) ~ lower(NEW.n))
      order by h.hc desc, length(h.k)
      limit 1
    );
  end if;
  if NEW.hc IS NULL then
    NEW.hc := (
      select avg(hc) from hotelscombined as h
      where h.k = NEW.hcid
    );
  end if;
-- RAISE NOTICE 'Block17 %', clock_timestamp();
  if NEW.rent_avg IS null then
    NEW.rent_avg := (
      SELECT avg(a.rent_avg)
      FROM cities as a
      where ST_DWithin(a.geog, NEW.geog, 45000)
      );
  end if;
  if NEW.food_avg IS null then
  NEW.food_avg := (
    SELECT avg(a.food_avg)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 45000)
    );
  end if;
-- RAISE NOTICE 'Block18 %', clock_timestamp();
  if NEW.transport_avg IS null then
  NEW.transport_avg := (
    SELECT avg(a.transport_avg)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 45000)
    );
  end if;
-- RAISE NOTICE 'Block19 %', clock_timestamp();
  if NEW.rent_low IS null then
    NEW.rent_low := (
      SELECT avg(a.rent_low)
      FROM cities as a
      where ST_DWithin(a.geog, NEW.geog, 45000)
      );
  end if;
  if NEW.food_low IS null then
  NEW.food_low := (
    SELECT avg(a.food_low)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 45000)
    );
  end if;
  if NEW.rent_high IS null then
    NEW.rent_high := (
      SELECT avg(a.rent_high)
      FROM cities as a
      where ST_DWithin(a.geog, NEW.geog, 45000)
      );
  end if;
  if NEW.food_high IS null then
  NEW.food_high := (
    SELECT avg(a.food_high)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 45000)
    );
  end if;
-- RAISE NOTICE 'Block20 %', clock_timestamp();
  if NEW.transport_bus IS null then
  NEW.transport_bus := (
    SELECT avg(a.transport_bus)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 45000)
    );
  end if;
  if NEW.transport_train IS null then
  NEW.transport_train := (
    SELECT avg(a.transport_train)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 45000)
    );
  end if;
  if NEW.transport_taxi IS null then
  NEW.transport_taxi := (
    SELECT avg(a.transport_taxi)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 45000)
    );
  end if;
  if NEW.transport_rentalcar IS null then
  NEW.transport_rentalcar := (
    SELECT avg(a.transport_rentalcar)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 45000)
    );
  end if;
  if NEW.transport_buycar IS null then
  NEW.transport_buycar := (
    SELECT avg(a.transport_buycar)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 45000)
    );
  end if;

  if NEW.transport_bus IS null then
  NEW.transport_bus := (
    SELECT avg(a.transport_bus)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 90000)
    );
  end if;
-- RAISE NOTICE 'Block21 %', clock_timestamp();
  if NEW.transport_train IS null then
  NEW.transport_train := (
    SELECT avg(a.transport_train)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 90000)
    );
  end if;
  if NEW.transport_taxi IS null then
  NEW.transport_taxi := (
    SELECT avg(a.transport_taxi)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 90000)
    );
  end if;
  if NEW.transport_rentalcar IS null then
  NEW.transport_rentalcar := (
    SELECT avg(a.transport_rentalcar)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 90000)
    );
  end if;
  if NEW.transport_buycar IS null then
  NEW.transport_buycar := (
    SELECT avg(a.transport_buycar)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 90000)
    );
  end if;
  if NEW.rent_avg IS null then
    NEW.rent_avg := (
      SELECT avg(a.rent_avg)
      FROM cities as a
      where ST_DWithin(a.geog, NEW.geog, 90000)
      );
  end if;
  if NEW.food_avg IS null then
  NEW.food_avg := (
    SELECT avg(a.food_avg)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 90000)
    );
  end if;
  if NEW.transport_avg IS null then
  NEW.transport_avg := (
    SELECT avg(a.transport_avg)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 90000)
    );
  end if;
  if NEW.rent_low IS null then
    NEW.rent_low := (
      SELECT avg(a.rent_low)
      FROM cities as a
      where ST_DWithin(a.geog, NEW.geog, 90000)
      );
  end if;
  if NEW.food_low IS null then
  NEW.food_low := (
    SELECT avg(a.food_low)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 90000)
    );
  end if;
  if NEW.rent_high IS null then
    NEW.rent_high := (
      SELECT avg(a.rent_high)
      FROM cities as a
      where ST_DWithin(a.geog, NEW.geog, 90000)
      );
  end if;
-- RAISE NOTICE 'Block22 %', clock_timestamp();
  if NEW.food_high IS null then
  NEW.food_high := (
    SELECT avg(a.food_high)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 90000)
    );
  end if;
if NEW.rent_avg IS null then
    NEW.rent_avg := (
      SELECT avg(a.rent_avg)
      FROM cities as a
      where ST_DWithin(a.geog, NEW.geog, 500000)
      );
  end if;
  if NEW.food_avg IS null then
  NEW.food_avg := (
    SELECT avg(a.food_avg)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 500000)
    );
  end if;
  if NEW.transport_avg IS null then
  NEW.transport_avg := (
    SELECT avg(a.transport_avg)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 500000)
    );
  end if;
  if NEW.rent_low IS null then
    NEW.rent_low := (
      SELECT avg(a.rent_low)
      FROM cities as a
      where ST_DWithin(a.geog, NEW.geog, 500000)
      );
  end if;
  if NEW.food_low IS null then
  NEW.food_low := (
    SELECT avg(a.food_low)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 500000)
    );
  end if;
  if NEW.rent_high IS null then
    NEW.rent_high := (
      SELECT avg(a.rent_high)
      FROM cities as a
      where ST_DWithin(a.geog, NEW.geog, 500000)
      );
  end if;
  if NEW.food_high IS null then
  NEW.food_high := (
    SELECT avg(a.food_high)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 500000)
    );
  end if;
  if NEW.transport_bus IS null then
  NEW.transport_bus := (
    SELECT avg(a.transport_bus)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 500000)
    );
  end if;
  if NEW.transport_train IS null then
  NEW.transport_train := (
    SELECT avg(a.transport_train)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 500000)
    );
  end if;
  if NEW.transport_taxi IS null then
  NEW.transport_taxi := (
    SELECT avg(a.transport_taxi)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 500000)
    );
  end if;
  if NEW.transport_rentalcar IS null then
  NEW.transport_rentalcar := (
    SELECT avg(a.transport_rentalcar)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 500000)
    );
  end if;
-- RAISE NOTICE 'Block23 %', clock_timestamp();
  if NEW.transport_buycar IS null then
  NEW.transport_buycar := (
    SELECT avg(a.transport_buycar)
    FROM    cities AS a
    where ST_DWithin(a.geog, NEW.geog, 500000)
    );
  end if;
-- RAISE NOTICE 'Block24 %', clock_timestamp();
  RETURN NEW;
EXCEPTION
  WHEN invalid_regular_expression THEN RAISE NOTICE 'invalid_regular_expression';
  END;
$fn_cities_geo_update_event$ LANGUAGE plpgsql;
