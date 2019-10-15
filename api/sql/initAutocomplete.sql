select l,k,n,s,c,i,nl_n,nl_s,nl_c
from cities 
where 1=1
and (n ~* ${input} -- $input will start with \y
or s ~* ${input}
or c ~* ${input}
or i ~* ${input})
or (n = ${input} -- $input will start with \y
or s  = ${input}
or c  = ${input}
or i  = ${input})
order by l, i nulls last, length(n) asc, population desc
limit 10;