const express = require("express");
let router = express.Router();

router.get("/all_OpenCourse",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.learning_time,
        t_courses.stop_time,
        t_courses.course_title,
        t_courses.is_self_innovate,
        t_teachers.name,
        b.class_name AS title,
        t_courses.price,
        t_courses.special_course_categorys_id,
        t_courses.categorys_id 
    FROM
        t_courses
    LEFT JOIN t_teachers ON t_courses.teacher_id = t_teachers.id
    LEFT JOIN t_course_categorys ON t_courses.categorys_id = t_course_categorys.id
    LEFT JOIN t_course_categorys AS a ON t_course_categorys.parent_id = a.id
    LEFT JOIN t_course_categorys AS b ON a.parent_id = b.id 
    WHERE
        t_courses.is_live_open_course = 1;
    `,[],"全部直播公开课查询成功!")
})

router.get("/all_course_live",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.learning_time,
        t_courses.course_title,
        t_teachers.name,
        t_teachers.label 
    FROM
        t_courses
    LEFT JOIN t_teachers ON t_courses.teacher_id = t_teachers.id
    LEFT JOIN t_special_course_categorys ON t_courses.special_course_categorys_id = t_special_course_categorys.id 
    WHERE
        t_special_course_categorys.class_name = "课堂直播";
    `,[],"课堂直播查询成功!")
})

module.exports = router;