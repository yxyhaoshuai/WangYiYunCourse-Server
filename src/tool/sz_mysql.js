const mysql = require("mysql");

let pool  = mysql.createPool({

    //连接池里的连接最大个数
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'qq123456.',
    database        : 'wangyiyun_course'
});

function execSQL(sqlTemp,values=[], successCB, failCB) {
    return new Promise((resolve, reject) => {
        pool.query(sqlTemp, values, function (error, results, fields) {
            if (error) {
                if (typeof failCB === "function") {
                    failCB(error);
                }
                reject(error)
            } else {
                if (typeof successCB === "function") {
                    successCB(results);
                }
                resolve(results)
            }
        });
    })
}

module.exports = {
    execSQL
}