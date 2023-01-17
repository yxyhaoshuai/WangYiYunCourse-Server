const express = require("express");
let router = express.Router();

router.get("/courses-search",(req,resp)=>{
    let {keyword,page_num=1,page_size=50}=req.query;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        is_series,
        t_courses.img_url,
        t_courses.course_title,
        t_courses.course_intro,
        ROUND( avg( score ), 1 ) AS avg_score,
        t_teachers.name,
        t_network_school.school_title,
        t_series_courses.title 
    FROM
        t_comment
        LEFT JOIN t_courses ON t_comment.course_id = t_courses.id
        LEFT JOIN t_series_courses ON t_courses.series_course_id = t_series_courses.id
        LEFT JOIN t_teachers ON t_courses.teacher_id = t_teachers.id
        LEFT JOIN t_network_school ON t_teachers.school_id = t_network_school.id 
    GROUP BY
        t_courses.id 
    HAVING
        t_courses.course_title LIKE ? 
        OR t_teachers.name LIKE ? 
        OR t_network_school.school_title LIKE ? 
        OR t_series_courses.title LIKE ? 
    ORDER BY
        avg_score DESC
        LIMIT ${(page_num - 1) * page_size}, ${page_size};
        ;
    `,["%"+keyword+"%","%"+keyword+"%","%"+keyword+"%","%"+keyword+"%"],"课程查询成功！")

})

router.post("/course-count",(req,resp)=>{
    let {keyword}=req.body;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        COUNT(t_courses.id) as course_count
    FROM
        t_courses
        LEFT JOIN t_series_courses ON t_courses.series_course_id = t_series_courses.id
        LEFT JOIN t_teachers ON t_courses.teacher_id = t_teachers.id
        LEFT JOIN t_network_school ON school_id = t_network_school.id
    WHERE
        course_title LIKE ? 
        OR title LIKE ? 
        OR name LIKE ? 
        OR school_title LIKE ? 
        ;
    `,[""+keyword+"",""+keyword+"",""+keyword+"",""+keyword+"",""+keyword+""],"课程数量查询成功！")
})






module.exports = router;