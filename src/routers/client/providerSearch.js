const express = require("express");
let router = express.Router();

router.get("/provider-search",(req,resp)=>{
    let {keyword,page_num=1,page_size=10}=req.query;
    resp.tool.execSQL(`
    SELECT
        * 
    FROM
        t_network_school 
    WHERE
        school_title LIKE ?
    LIMIT ${(page_num - 1) * page_size}, ${page_size};
        ;
    `,[`%${keyword}%`]).then((result)=>{
        if (result.length > 0){
            let data = [];
            let promises = result.map((item)=>{
                return resp.tool.execSQL(`
                    SELECT
                        t_courses.id,
                        t_courses.course_title,
                        t_courses.price,
                        t_courses.img_url 
                    FROM
                        t_network_school
                        LEFT JOIN t_teachers ON t_network_school.id = t_teachers.school_id
                        LEFT JOIN t_courses ON t_courses.teacher_id = t_teachers.id 
                    WHERE
                        t_network_school.id = ?
                    ORDER BY
                        t_courses.create_time DESC
                    LIMIT 3;
                `,[item.id]).then((result2)=>{
                    let row = JSON.parse(JSON.stringify(item));
                    row.courses = result2;
                    data.push(row);
                })
            })
            Promise.all(promises).then(()=>{
                resp.send(
                    resp.tool.ResponseTemp(0, "教育机构下的课程查询成功！", data)
                );
            });
        } else {
            resp.send(resp.tool.ResponseTemp(0, "查询结果为空！", result));
        }
    })

})


module.exports = router;