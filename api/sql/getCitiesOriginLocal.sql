select 
  l,
  u,
  n,
  trunc( population/100, 0 ) as population,
  creative,
  r,
  c,
  TRUNC( rent_avg, 2 ) as rent_avg,
  TRUNC( rent_low, 2 ) as rent_low,
  TRUNC( rent_high,2 ) as rent_high,
  TRUNC( food_avg, 2 ) as food_avg,
  TRUNC( food_low, 2 ) as food_low,
  TRUNC( food_high,2 ) as food_high,
  TRUNC( transport_avg, 2 ) as transport_avg,
  TRUNC( transport_bus, 2 ) as transport_bus,
  TRUNC( transport_train, 2 ) as transport_train,
  TRUNC( transport_taxi, 2 ) as transport_taxi,
  TRUNC( transport_rentalcar, 2 ) as transport_rentalcar,
  TRUNC( transport_buycar, 2 ) as transport_buycar,
  k,
  i,
  hcid,
  hc,
  x,
  density,
  slope_max,
  slope_median,
  elevation,
  elevation_max,
  elevation_range,
  food,
  tourism,
  beach,
  tags,
  tourism_percent,
  array[r_01,r_02,r_03,r_04,r_05,r_06,r_07,r_08,r_09,r_10,r_11,r_12] rain,
  array[ti_01,ti_02,ti_03,ti_04,ti_05,ti_06,ti_07,ti_08,ti_09,ti_10,ti_11,ti_12] tempmin,
  array[tx_01,tx_02,tx_03,tx_04,tx_05,tx_06,tx_07,tx_08,tx_09,tx_10,tx_11,tx_12] tempmax,
  array[t_01,t_02,t_03,t_04,t_05,t_06,t_07,t_08,t_09,t_10,t_11,t_12] tempavg,
  array[wm_01,wm_02,wm_03,wm_04,wm_05,wm_06,wm_07,wm_08,wm_09,wm_10,wm_11,wm_12] wind,
  array[s_01,s_02,s_03,s_04,s_05,s_06,s_07,s_08,s_09,s_10,s_11,s_12] sun,
  r.price route_price,
  r.routesdata,
  r.updated_at,
  longitude,
  latitude,
  case 
    when r.pricelow is null then '28.68' 
    when r.pricelow > 1800 then '15000'
    else r.pricelow end pricelow
from (
-- if the origin point is a local city
  WITH
    ocity AS (
      SELECT k,
             geog
      FROM   cities
      WHERE  k = ${k} --change this part, this is the local city's K.
    )
  select *
  from (
  (SELECT a.*
  FROM    cities AS a
  JOIN    ocity AS b
    ON    ST_DWithin(a.geog, b.geog, 300000)
    AND    a.k != b.k
  where   l = false
  ORDER BY ST_Distance(a.geog, b.geog)
  LIMIT  5)
  UNION ALL
  (SELECT a.*
  FROM    cities AS a
  JOIN    ocity AS b
    ON    ST_DWithin(a.geog, b.geog, 120000)
    AND    a.k != b.k
    AND NOT ST_DWithin(a.geog, b.geog, 2000)
  where   l = true
  ORDER BY trunc( rent_low, -1 ) ASC, ST_Distance(a.geog, b.geog)
  LIMIT 25)) t
) t
left join rome2rio_routes r on r.fromcity = ${k} and r.tocity = t.k

