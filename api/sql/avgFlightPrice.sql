-- average flight price

-- uncomment code for city data
-- select cities.*, avg_flight_price from 
(select a.city_code as to_city, b.city_code as from_city, avg(price) as avg_flight_price
  FROM kiwi_links_historical
  join map_citycode as a
  on to_city = a.airport_code
  join map_citycode as b
  on from_city = b.airport_code
  where from_city = 'HOU' --change these
  group by a.city_code, b.city_code
union all 
select to_city, from_city, avg(price) as avg_flight_price
  FROM kiwi_links_historical
  where from_city = 'HOU' --change these
  group by to_city, from_city
  ) t 
-- group by to_city, from_city
-- join cities on cities.i = t.to_city