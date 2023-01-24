const express = require("express");
let router = express.Router();

router.get("/categorys_detail_nav/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_course_categorys.id as classoneid,
        t_course_categorys.class_name as classonename,
        a.id as classtwoid,
        a.class_name as classtwoname 
    FROM
        t_course_categorys
    LEFT JOIN t_course_categorys AS a ON t_course_categorys.id = a.parent_id 
    WHERE
        t_course_categorys.id <= 8 and t_course_categorys.id = ?;
    `,[id],"分类导航栏查询成功!")
})

router.get("/free/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.is_self_innovate,
        t_courses.course_title,
        t_courses.price,
        t_special_course_categorys.class_name,
        ROUND( AVG( t_comment.score ), 1 ) AS avg_score 
    FROM
        t_courses
    LEFT JOIN t_course_categorys AS a ON t_courses.categorys_id = a.id
    LEFT JOIN t_course_categorys AS b ON a.parent_id = b.id
    LEFT JOIN t_course_categorys AS c ON b.parent_id = c.id
    LEFT JOIN t_special_course_categorys ON t_courses.special_course_categorys_id = t_special_course_categorys.id
    LEFT JOIN t_comment ON t_courses.id = t_comment.course_id 
    WHERE
        c.id = ? 
        AND t_special_course_categorys.class_name = "免费好课" 
    GROUP BY
        t_courses.id;
    `,[id],"免费好课查询成功!")
})

router.get("/choiceness/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.is_self_innovate,
        t_courses.course_title,
        t_courses.price,
        t_special_course_categorys.class_name,
        ROUND( AVG( t_comment.score ), 1 ) AS avg_score 
    FROM
        t_courses
    LEFT JOIN t_course_categorys AS a ON t_courses.categorys_id = a.id
    LEFT JOIN t_course_categorys AS b ON a.parent_id = b.id
    LEFT JOIN t_course_categorys AS c ON b.parent_id = c.id
    LEFT JOIN t_special_course_categorys ON t_courses.special_course_categorys_id = t_special_course_categorys.id
    LEFT JOIN t_comment ON t_courses.id = t_comment.course_id 
    WHERE
        c.id = ? 
        AND t_special_course_categorys.class_name = "精选好课" 
    GROUP BY
        t_courses.id;
    `,[id],"精选好课查询成功!")
})

router.get("/new_course/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.is_self_innovate,
        t_courses.course_title,
        t_courses.price,
        t_special_course_categorys.class_name,
        ROUND( AVG( t_comment.score ), 1 ) AS avg_score 
    FROM
        t_courses
    LEFT JOIN t_course_categorys AS a ON t_courses.categorys_id = a.id
    LEFT JOIN t_course_categorys AS b ON a.parent_id = b.id
    LEFT JOIN t_course_categorys AS c ON b.parent_id = c.id
    LEFT JOIN t_special_course_categorys ON t_courses.special_course_categorys_id = t_special_course_categorys.id
    LEFT JOIN t_comment ON t_courses.id = t_comment.course_id 
    WHERE
        c.id = ? 
        AND t_special_course_categorys.class_name = "新课推荐" 
    GROUP BY
        t_courses.id;
    `,[id],"新课推荐查询成功!")
})

router.get("/open_course/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.learning_time,
        t_courses.is_self_innovate,
        t_courses.course_title,
        t_teachers.name,
        t_courses.course_intro
    FROM
        t_courses
    LEFT JOIN t_course_categorys AS a ON t_courses.categorys_id = a.id
    LEFT JOIN t_course_categorys AS b ON a.parent_id = b.id
    LEFT JOIN t_course_categorys AS c ON b.parent_id = c.id
    LEFT JOIN t_teachers on t_courses.teacher_id = t_teachers.id
    WHERE
        c.id = ? 
        AND t_courses.is_live_open_course = 1;
    `,[id],"直播公开课查询成功!")
})

router.get("/categorys_detail_ad/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_ad.course_id,
        t_ad.ad_img_url 
    FROM
        t_courses
    LEFT JOIN t_course_categorys AS a ON t_courses.categorys_id = a.id
    LEFT JOIN t_course_categorys AS b ON a.parent_id = b.id
    LEFT JOIN t_course_categorys AS c ON b.parent_id = c.id
    LEFT JOIN t_ad ON t_courses.id = t_ad.course_id 
    WHERE
        c.id = ? 
        AND t_ad.is_categorys_show = 1;
    `,[id],"分类详情页广告查询成功!")
})


router.get("/categorys_detail_nav_click/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        a.id,
        a.class_name 
    FROM
        t_course_categorys
    LEFT JOIN t_course_categorys AS a ON t_course_categorys.id = a.parent_id 
    WHERE
        t_course_categorys.id = ?;
    `,[id],"最细的分类id查询成功！")
})
//下面这个路由路径和上面的路由路径是需要前端联合使用的
router.get("/categorys_detail_nav_click2/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.is_self_innovate,
        t_courses.course_title,
        ROUND( avg( score ), 1 ) AS avg_score,
        t_courses.price
    FROM
        t_courses
    LEFT JOIN t_comment ON t_courses.id = t_comment.course_id 
    WHERE
        categorys_id = ? 
    GROUP BY
        t_courses.id;
    `,[id],"最细的分类id查询课程成功！")
})


router.get("/categorys_detail_nav_click_opencourse/:id",(req,resp)=>{
    const {id} = req.params;
    console.log(id)
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.learning_time,
        t_courses.is_self_innovate,
        t_courses.course_title,
        t_teachers.name,
        t_courses.course_intro
    FROM
        t_courses
    LEFT JOIN t_course_categorys AS a ON t_courses.categorys_id = a.id
    LEFT JOIN t_course_categorys AS b ON a.parent_id = b.id
    LEFT JOIN t_course_categorys AS c ON b.parent_id = c.id
    LEFT JOIN t_teachers on t_courses.teacher_id = t_teachers.id
    WHERE
        b.id = ? 
        AND t_courses.is_live_open_course = 1;
    `,[id],"直播公开课查询成功!")
})

module.exports = router;