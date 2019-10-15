const _db = require('../db')
_db.initDB()
db = _db.getDB()

db.any("select n,c from cities where i = ${fly_from}",{fly_from:"LUA"}).then(res=>console.log(res))