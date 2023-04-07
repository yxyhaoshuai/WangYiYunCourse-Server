const express = require("express");
let router = express.Router();

//全部系列课程列表
router.get("/all-series-ourse",(req,resp)=>{
    let {page_num=1,page_size=9}=req.query;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            t_series_courses.id,
            t_series_courses.series_fm_url,
            t_series_courses.title,
            t_series_courses.intro
        FROM
            t_series_courses 
        ORDER BY
            create_time DESC
        LIMIT ${(page_num - 1) * page_size}, ${page_size};
    `,[],"系列课程列表页查询成功！")
})



//系列课程总数
router.get("/all-series-ourse-total",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            COUNT(id) as seriesTotal
        FROM
            t_series_courses;
    `,[],"系列课程列表总数查询成功！")
})


module.exports = router;