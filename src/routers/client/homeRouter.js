const express = require("express");
let router = express.Router()
//下面的代码还有回头增加查询课程的功能
//多级大纲列表查询
// router.get("/class_list",(req,resp)=>{
//     resp.tool.execSQLTEMPAutoResponse(`
//     SELECT
//         t_course_categorys.id,
//         t_course_categorys.class_name AS class_name1,
//         a.class_name AS class_name2,
//         courses_t.id AS courseid,
//         courses_t.img_url,
//         courses_t.course_title
//     FROM
//         t_course_categorys
//     LEFT JOIN t_course_categorys AS a ON t_course_categorys.id = a.parent_id
//     LEFT JOIN (
//     SELECT
//         t_courses.id,
//         t_courses.course_title,
//         t_courses.img_url,
//         parentone.class_name AS one,
//         parentone.id AS categorysid
//     FROM
//         t_courses
//     LEFT JOIN t_course_categorys ON t_courses.categorys_id = t_course_categorys.id
//     LEFT JOIN t_course_categorys AS parentone ON t_course_categorys.parent_id = parentone.id
//     LEFT JOIN t_special_course_categorys ON t_courses.special_course_categorys_id = t_special_course_categorys.id
//     WHERE
//         t_special_course_categorys.class_name = "精选好课"
//         ) AS courses_t ON a.id = courses_t.categorysid
//     WHERE
//         t_course_categorys.id <= ?;
//     `,[8],"多级大纲列表查询成功!")
// })

router.get("/class_list1",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        classone.id AS id1,
        classone.class_name AS class_name1,
        classtwo.id AS id2,
        classtwo.class_name AS class_name2
    FROM
        t_course_categorys AS classone
    LEFT JOIN t_course_categorys AS classtwo ON classone.id = classtwo.parent_id
    WHERE
        classone.id <= ?;
    `,[8],"多级大纲列表查询成功!")
})
router.get("/class_list2",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_course_categorys.id as categoryid,
        t_courses.id as courseid,
        t_courses.course_title,
        t_courses.img_url as course_img_url 
    FROM
        t_course_categorys
    LEFT JOIN t_home_course_categorys ON t_course_categorys.id = t_home_course_categorys.course_categorys_course_id
    LEFT JOIN t_courses ON t_home_course_categorys.categorys_course_course_id = t_courses.id 
    WHERE
        t_course_categorys.id <= ?;
    `,[8],"多级大纲列表查询成功!")
})


router.get("/class_list1",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        classone.id AS id1,
        classone.class_name AS class_name1,
        classtwo.id AS id2,
        classtwo.class_name AS class_name2
    FROM
        t_course_categorys AS classone
    LEFT JOIN t_course_categorys AS classtwo ON classone.id = classtwo.parent_id;
    `,[],"多级大纲列表查询成功!")
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

//首页课程列表
router.get("/home_course_list",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_special_course_categorys.id as specialid,
        t_courses.id AS courseid,
        t_courses.course_title,
        t_courses.price,
        t_courses.img_url,
        t_courses.learning_time,
        t_courses.is_live,
        t_courses.course_intro,
        t_courses.is_self_innovate,
        is_special_home_show,
        t_teachers.name,
        t_teachers.header_url,
        class1.class_name 
    FROM
        t_special_course_categorys
    LEFT JOIN t_home_course_special ON t_special_course_categorys.id = t_home_course_special.special_course_category_id
    LEFT JOIN t_courses ON t_courses.id = t_home_course_special.course_id
    LEFT JOIN t_teachers ON t_courses.teacher_id = t_teachers.id
    LEFT JOIN t_course_categorys AS class3 ON class3.id = t_courses.categorys_id
    LEFT JOIN t_course_categorys AS class2 ON class3.parent_id = class2.id
    LEFT JOIN t_course_categorys as class1 on class1.id = class2.parent_id 
    WHERE
        t_courses.id IS NOT NULL;
    `,[],"首页课程查询成功!")
})


//首页系列课程列表
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


//*注:添加兴趣后，前端再查询某一个用户id的所有兴趣所对应的分类id，然后前端根据查询出来的兴趣所对应id对查询的所有课程进行筛选，然后渲染到前端页面
router.post("/set_interest",(req,resp)=>{
    let {interest_array,student_id}= req.body;
    interest_array =eval(interest_array)
    resp.tool.execSQL(`
    DELETE 
    FROM
        t_interest_recommend 
    WHERE
        student_id = ?;
    `,[student_id]).then(result=>{
        resp.tool.execSQLTEMPAutoResponse(`
    INSERT INTO t_interest_recommend ( student_id, categorys_id )
    VALUES
        ${interest_array.map(item=>{
            return "("+student_id+","+item+")"
        })};
    `,[],"我的兴趣插入成功!")
    })

})

router.get("/interest_recommend/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_course_categorys.id,
        t_course_categorys.class_name 
    FROM
        t_interest_recommend
    LEFT JOIN t_course_categorys ON t_interest_recommend.categorys_id = t_course_categorys.id 
    WHERE
        student_id = ? 
    LIMIT 6;
    `,[id],"我的兴趣类别查询成功!")
})



module.exports = router;