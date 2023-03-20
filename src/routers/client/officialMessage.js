const express = require("express");
let router = express.Router();


router.get("/officialMessage",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        official_notice,
        create_time,
        id 
    FROM
        t_office_notice 
    ORDER BY
        create_time DESC;
    `,"平台通知查询成功!")
})




module.exports = router;