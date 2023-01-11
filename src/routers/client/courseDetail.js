const express = require("express");
let router = express.Router();

router.get("/course/introduction/crumbs/:id",(req,resp)=>{
    const {id}=req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        c.class_name AS classone,
        b.class_name AS classtwo,
        a.class_name AS classthree
    FROM
        t_courses
        LEFT JOIN t_course_categorys AS a ON t_courses.categorys_id = a.id
        LEFT JOIN t_course_categorys AS b ON a.parent_id = b.id
        LEFT JOIN t_course_categorys AS c ON b.parent_id = c.id 
    WHERE
        t_courses.id = ?;
    `,[id],"面包屑导航查询成功！")


})

router.get("/course/introduction/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        a.id as courseid,
        a.img_url as courseurl,
        a.course_title as coursetitle,
        a.price as courseprice,
        a.study_count as studentcount,
        a.course_intro as courseintro,
        a.course_intro_url as courseintro_url,
        a.name as teacher_name,
        a.intro as teacherintro,
        ROUND( AVG( score ), 1 ) AS avg_score 
    FROM
        (
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.course_title,
        t_courses.price,
        t_courses.course_intro_url,
        t_courses.course_intro,
        t_teachers.name,
        t_teachers.intro,
        COUNT( t_have_bought.id ) AS study_count 
    FROM
        t_courses
    LEFT JOIN t_have_bought ON t_courses.id = t_have_bought.course_id
    LEFT JOIN t_teachers ON t_courses.teacher_id = t_teachers.id 
    GROUP BY
        t_courses.id 
        ) AS a
    LEFT JOIN t_comment ON a.id = t_comment.course_id 
    GROUP BY
        a.id 
    HAVING
        a.id = ?;
    `,[id],"课程详情查询成功！")
})



module.exports = router;