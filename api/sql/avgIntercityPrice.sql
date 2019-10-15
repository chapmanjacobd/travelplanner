select avg(len) km, avg(p_km) * avg(len) calc_price, avg(pricelow) price_low, avg(price) price_high, avg(pricelow) + avg(price) / 2 price_avg from rome2rio_routes_line 
where 1=1
and st_dwithin(cf, st_setsrid(st_makepoint(129.0756,35.1796), 4326), 10000)
and st_dwithin(ct, st_setsrid(st_makepoint(128.8894,35.2285), 4326), 10000)
and len > 1000 - st_distance(st_setsrid(st_makepoint(129.0756,35.1796), 4326)::geography, st_setsrid(st_makepoint(128.8894,35.2285), 4326)::geography)
and len < 2000 + st_distance(st_setsrid(st_makepoint(129.0756,35.1796), 4326)::geography, st_setsrid(st_makepoint(128.8894,35.2285), 4326)::geography)