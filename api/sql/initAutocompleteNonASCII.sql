select l,k,n,s,c,i,nl_n,nl_s,nl_c
from cities 
where l = false
and (nl_c ~* ${input}
or nl_s ~* ${input}
or nl_n ~* ${input})
order by l, i nulls last, length(n) asc, population desc
limit 10;