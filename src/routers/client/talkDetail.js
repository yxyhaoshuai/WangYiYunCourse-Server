const express = require("express");
let router = express.Router();

router.get("/talk", (req, resp) => {
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            t_courses.id AS courseid,
            t_courses.course_title,
            t_courses.price,
            t_courses.img_url,
            t_courses.learning_time,
            t_courses.is_live,
            t_courses.course_intro,
            t_courses.is_self_innovate,
            class1.class_name,
            t_teachers.name 
        FROM
            t_home_course_special
        LEFT JOIN t_courses ON t_home_course_special.course_id = t_courses.id
        LEFT JOIN t_course_categorys AS class3 ON class3.id = t_courses.categorys_id
        LEFT JOIN t_course_categorys AS class2 ON class3.parent_id = class2.id
        LEFT JOIN t_course_categorys AS class1 ON class1.id = class2.parent_id
        LEFT JOIN t_teachers ON t_courses.teacher_id = t_teachers.id 
        WHERE
            special_course_category_id = 10;
    `,[],"所有直播公开课查询成功！")

})


module.exports = router;