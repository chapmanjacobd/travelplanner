select middle_city, avg(avg_flightprice)
from ((select leg1.to_city as middle_city, leg1.price + leg2.price as avg_flightprice
from 
(select distinct * from 
  (select a.city_code as to_city, b.city_code as from_city, avg(price) as price
  FROM kiwi_links_historical
  join map_citycode as a
  on to_city = a.airport_code
  join map_citycode as b
  on from_city = b.airport_code
  where from_city = 'LAX' --change these. the order doesn't matter as it will return the same results whether 'from' is 'to'
  group by a.city_code, b.city_code
union all 
  select to_city, from_city, avg(price) as price
  FROM kiwi_links_historical
  where from_city = 'LAX' --change these
  group by to_city, from_city
  ) t
) leg1
join 
(select distinct * from 
  (select a.city_code as to_city, b.city_code as from_city, avg(price) as price
  FROM kiwi_links_historical
  join map_citycode as a
  on to_city = a.airport_code
  join map_citycode as b
  on from_city = b.airport_code
  where to_city = 'HOU' --change these
  group by a.city_code, b.city_code
union all 
  select to_city, from_city, avg(price) as price
  FROM kiwi_links_historical
  where to_city = 'HOU' --change these
  group by to_city, from_city
  ) t
) leg2 on leg1.to_city = leg2.from_city
)
union all
(select leg1.to_city as middle_city, leg1.price + leg2.price as avg_flightprice
from 
(select distinct * from 
  (select a.city_code as to_city, b.city_code as from_city, avg(price) as price
  FROM kiwi_links_historical
  join map_citycode as a
  on to_city = a.airport_code
  join map_citycode as b
  on from_city = b.airport_code
  where from_city = 'HOU' --change these
  group by a.city_code, b.city_code
union all 
  select to_city, from_city, avg(price) as price
  FROM kiwi_links_historical
  where from_city = 'HOU' --change these
  group by to_city, from_city
  ) t
) leg1
join 
(select distinct * from 
  (select a.city_code as to_city, b.city_code as from_city, avg(price) as price
  FROM kiwi_links_historical
  join map_citycode as a
  on to_city = a.airport_code
  join map_citycode as b
  on from_city = b.airport_code
  where to_city = 'LAX' --change these
  group by a.city_code, b.city_code
union all 
  select to_city, from_city, avg(price) as price
  FROM kiwi_links_historical
  where to_city = 'LAX' --change these
  group by to_city, from_city
  ) t
) leg2 on leg1.to_city = leg2.from_city
)
order by avg_flightprice) foo
group by middle_city