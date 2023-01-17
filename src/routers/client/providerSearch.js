const express = require("express");
let router = express.Router();

router.get("/provider-search",(req,resp)=>{
    let {keyword,page_num=1,page_size=10}=req.query;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        * 
    FROM
        t_network_school 
    WHERE
        school_title LIKE ?
    LIMIT ${(page_num - 1) * page_size}, ${page_size};
        ;
    `,[`%${keyword}%`],"网校查询成功！")

})

router.get("/provider-search-count",(req,resp)=>{
    let {keyword}=req.query;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        count(t_network_school.id) 
    FROM
        t_network_school 
    WHERE
        school_title LIKE ?
        ;
    `,[`%${keyword}%`],"网校查到的数量查询成功！")

})

router.get("/provider-search/course",(req,resp)=>{
    let {schoolid}=req.query;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.course_title,
        t_courses.price,
        t_courses.img_url 
    FROM
        t_network_school
        LEFT JOIN t_teachers ON t_network_school.id = t_teachers.school_id
        LEFT JOIN t_courses ON t_courses.teacher_id = t_teachers.id 
    WHERE
        t_network_school.id = ?;
    `,[+schoolid],"网校对应课程查询成功！")

})



module.exports = router;