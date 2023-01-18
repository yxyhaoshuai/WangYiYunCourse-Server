const express = require("express");
let router = express.Router()

//首页测试
router.get("/",(req,res)=>{
    res.send({
        test:"成功"
    })

})

//下面的代码还有回头增加查询课程的功能
//多级大纲列表查询
router.get("/class_list",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_course_categorys.id,
        t_course_categorys.class_name AS class_name1,
        a.class_name AS class_name2 
    FROM
        t_course_categorys
    LEFT JOIN t_course_categorys AS a ON t_course_categorys.id = a.parent_id 
    WHERE
        t_course_categorys.id <= ?;
    `,[8],"多级大纲列表查询成功!")
})

//广告轮播图查询
router.get("/ad",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        * 
    FROM
        t_ad
    WHERE is_home_page=?;
    `,[1],"首页广告轮播图查询成功！")
})

router.get("/home_course_list",(req,resp)=>{
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
        t_courses.special_course_categorys_id
    FROM
        t_courses
    LEFT JOIN t_teachers ON t_courses.teacher_id = t_teachers.id
    LEFT JOIN t_course_categorys ON t_courses.categorys_id = t_course_categorys.id
    LEFT JOIN t_course_categorys AS a ON t_course_categorys.parent_id = a.id
    LEFT JOIN t_course_categorys AS b ON a.parent_id = b.id 
    WHERE
        t_courses.is_special_home_show = 1 ;
    `,[],"首页课程查询成功!")
})

router.get("/home_series_course",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        * 
    FROM
        t_series_courses 
    WHERE
        is_home_show = 1;
    `,[],"首页系列课程查询成功!")
})

router.get("/home_mini_ad",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        * 
    FROM
        t_mini_ad 
    WHERE
        is_home_show = 1;
    `,[],"首页左侧小广告查询成功!")
})






module.exports = router;