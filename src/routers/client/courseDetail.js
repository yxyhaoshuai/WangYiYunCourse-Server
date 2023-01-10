const express = require("express");
let router = express.Router();

router.get("/course/introduction/:id",(req,resp)=>{
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



module.exports = router;