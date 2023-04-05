const express = require("express");
let router = express.Router();

//系列课程详情页
router.get("/seriesCourse",(req,resp)=>{
    let {id}=req.query;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        id,
        title,
        intro,
        course_introduction_img 
    FROM
        t_series_courses 
    WHERE
        id = ?;
    `,[+id],"网校对应课程查询成功！")

})

//系列课程里的课程列表
router.get("/seriesCourse/course-list", (req, resp) => {
    let { id } = req.query;
    resp.tool.execSQL(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.course_title as course_title2,
        t_courses.course_intro as course_intro2,
        t_teachers.name,
        t_courses.price,
        t_series_courses_son.course_title as course_title1,
        t_series_courses_son.course_intro as course_intro1
    FROM
        t_series_courses
    LEFT JOIN t_series_courses_son ON t_series_courses.id = t_series_courses_son.series_courses_id
    LEFT JOIN t_courses ON t_series_courses_son.id = t_courses.series_courses_son_id
    LEFT JOIN t_teachers ON t_courses.teacher_id = t_teachers.id 
    WHERE
        t_series_courses.id = ?;
    `, [+id]).then((result) => {
            if (result.length > 0) {
                let data = [];
                let promises = result.map((item) => {
                    return resp.tool.execSQL(
                        `
                    SELECT
                        t_students.id,
                        t_students.header_url
                    FROM
                        t_courses
                    LEFT JOIN t_have_bought ON t_courses.id = t_have_bought.course_id
                    LEFT JOIN t_students on t_have_bought.student_id = t_students.id
                    WHERE
                        t_courses.id = ?
                        LIMIT 6;
                `, [item.id]).then((result2) => {
                        let row = JSON.parse(JSON.stringify(item));
                        row.users = result2;
                        data.push(row);
                    });
                });

                Promise.all(promises).then(() => {
                    resp.send(
                        resp.tool.ResponseTemp(0, "课程和用户查询成功！", data)
                    );
                });
            } else {
                resp.send(resp.tool.ResponseTemp(0, "课程列表为空！", result));
            }
        });
});



module.exports = router;