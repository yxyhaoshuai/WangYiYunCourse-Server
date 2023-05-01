const express = require("express");
let router = express.Router();

//网校信息
router.get("/provider/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_network_school.id,
        t_network_school.organization_heard_url,
        t_network_school.organization_intro,
        t_network_school.about_school,
        school_title,
        about_school 
    FROM
        t_network_school 
    WHERE
        t_network_school.id = ${id};
    `,"网校信息查询成功！")
})

//网校课程
router.get("/provider/course/list",(req,resp)=>{
    const {id,page_num=1,page_size=10,method="create_time"} = req.query;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            t_network_school.id AS schoolid,
            t_courses.id AS id,
            t_courses.course_title,
            t_courses.img_url,
            t_courses.price,
            t_courses.course_intro,
            ROUND( avg( score ), 1 ) AS avg_score,
            t_courses.is_school_recommend 
        FROM
            t_network_school
        LEFT JOIN t_teachers ON t_network_school.id = t_teachers.school_id
        LEFT JOIN t_courses ON t_teachers.id = t_courses.teacher_id
        LEFT JOIN t_comment ON t_courses.id = t_comment.course_id 
        GROUP BY
            t_courses.id 
        HAVING
            t_network_school.id = ? 
        ORDER BY
            ${method} desc 
        LIMIT ${(page_num - 1) * page_size}, ${page_size};
    `,[id],"网校网课查询成功！")
})


//课程结果总数量查询成功，用于分页
router.get("/provider/course/count/:id",(req,resp)=>{
    const {id} =  req.params;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            COUNT( t_network_school.id ) AS courseCount 
        FROM
            t_network_school
        LEFT JOIN t_teachers ON t_network_school.id = t_teachers.school_id
        LEFT JOIN t_courses ON t_teachers.id = t_courses.teacher_id 
        WHERE
            t_network_school.id = ?;
    `,[id],"课程结果总数量查询成功！")
})


//provider页面中的主页中的推荐课程
router.get("/provider/course/list/home",(req,resp)=>{
    const {id} = req.query;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            t_network_school.id AS schoolid,
            t_courses.id AS id,
            t_courses.course_title,
            t_courses.img_url,
            t_courses.price,
            t_courses.course_intro,
            ROUND( avg( score ), 1 ) AS avg_score,
            t_courses.is_school_recommend
        FROM
            t_network_school
        LEFT JOIN t_teachers ON t_network_school.id = t_teachers.school_id
        LEFT JOIN t_courses ON t_teachers.id = t_courses.teacher_id
        LEFT JOIN t_comment ON t_courses.id = t_comment.course_id 
        GROUP BY
            t_courses.id 
        HAVING
            t_network_school.id = ? and t_courses.is_school_recommend = 1
        ORDER BY
            create_time desc 
        LIMIT 10;
    `,[id],"网校网课查询成功！")
})

// 网校的推荐老师和所有老师，通过is_school_recommend是否为1判断是否为推荐老师
router.get("/provider/course/instructor/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_teachers.id,
        t_teachers.header_url,
        t_teachers.intro,
        t_teachers.name,
        is_school_recommend 
    FROM
        t_network_school
        LEFT JOIN t_teachers ON t_network_school.id = t_teachers.school_id 
    WHERE
        t_network_school.id = ?;
    `,[id],"讲师查询成功！")
})

//广告轮播图
router.get("/provider/course/instructor/lunbo/:id",(req,resp)=>{
    const {id} =req.params;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            * 
        FROM
            t_network_school_ad 
        WHERE
            network_school_id = ?;
    `,[id],"网校广告轮播图查询成功！")

})



module.exports = router;