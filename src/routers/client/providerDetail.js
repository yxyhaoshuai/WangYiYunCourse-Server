const express = require("express");
const {response} = require("express");
let router = express.Router();
router.get("/provider/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_network_school.id,
        t_network_school.organization_heard_url,
        t_network_school.organization_intro,
        t_network_school.about_school,
        school_title 
    FROM
        t_network_school 
    WHERE
        t_network_school.id = ${id};
    `,"网校信息查询成功！")
})

router.get("/provider/course/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_network_school.id AS schoolid,
        t_courses.id AS courseid,
        t_courses.course_title,
        t_courses.img_url,
        t_courses.price,
        ROUND( avg( score ), 1 ) AS avg_score 
    FROM
        t_network_school
        LEFT JOIN t_teachers ON t_network_school.id = t_teachers.school_id
        LEFT JOIN t_courses ON t_teachers.id = t_courses.teacher_id
        LEFT JOIN t_comment ON t_courses.id = t_comment.course_id 
    GROUP BY
        t_courses.id 
    HAVING
        t_network_school.id = ?;
    `,[id],"网校网课查询成功！")
})

router.get("/provider/course/instructor/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_teachers.id,
        t_teachers.header_url,
        t_teachers.intro,
        t_teachers.name 
    FROM
        t_network_school
        LEFT JOIN t_teachers ON t_network_school.id = t_teachers.school_id 
    WHERE
        t_network_school.id = ?;
    `,[id],"讲师查询成功！")
})



module.exports = router;