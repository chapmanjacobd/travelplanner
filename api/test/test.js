var kiwi = require('../helpers/kiwi.js')
var _db = require('../db');



function getDB () {
    _db.initDB();
    return _db.getDB();
  }


// test the getLocalRoutesFrom 
const db = getDB()

async function testFunc(){
    try{
        const result = await kiwi.getLocalRoutesFrom({fly_from:'SEA', db})
        console.log(result)
    } catch (e) {
        console.log(e)
    }
}


testFunc()


return 0