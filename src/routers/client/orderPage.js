const express = require("express");
let router = express.Router();


router.get("/order",(req,resp)=>{
    const {id} = req.query;
    console.log(id)
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            t_courses.id,
            t_courses.img_url,
            t_courses.course_title,
            t_courses.price 
        FROM
            t_series_courses
        LEFT JOIN t_series_courses_son ON t_series_courses.id = t_series_courses_son.series_courses_id
        LEFT JOIN t_courses ON t_courses.series_courses_son_id = t_series_courses_son.id 
        WHERE
            t_courses.id IS NOT NULL 
        AND t_series_courses.id = ?;
    `,[id],"系列课程所属的所有课程查询成功！")
})




module.exports = router;