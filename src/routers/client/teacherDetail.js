const express = require("express");
let router = express.Router();

router.get("/instructor/:id",(req,resp)=>{
    const id = req.params.id;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.course_intro,
        t_teachers.name
    FROM
        t_teachers
        LEFT JOIN t_courses ON t_teachers.id = t_courses.teacher_id 
    WHERE
        t_teachers.id = ?;
    `,[id])
})

//instructor页
router.get("/instructor/course/:id",(req,resp)=>{
    const id = req.params.id;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.course_title,
        t_courses.price,
        t_teachers.name
    FROM
        t_teachers
        LEFT JOIN t_courses ON t_teachers.id = t_courses.teacher_id 
    WHERE
        t_teachers.id = ?;
    `,[id])
})



module.exports = router;