const express = require("express");
let router = express.Router();

//查询学生学习某门课程到哪里
router.get("/get-student-schedule",(req,resp)=>{
    const {student_id,course_id} = req.query;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        student_study_index 
    FROM
        t_student_study_schedule 
    WHERE
        students_id = ? 
    AND courses_id = ?;
    `,[student_id,course_id],"学习到哪个大纲的id查询成功！")
})

//插入学生学习某门课程到哪里
router.post("/set-student-schedule",(req,resp)=>{
    const {students_id,courses_id,student_study_index} = req.body;
    console.log(students_id,courses_id,student_study_index)
    resp.tool.execSQL(`
        SELECT
            student_study_index 
        FROM
            t_student_study_schedule 
        WHERE
            students_id = ? 
        AND courses_id = ?;
    `,[students_id,courses_id]).then((result)=>{
        if (result.length > 0 ){
            resp.tool.execSQLTEMPAutoResponse(`
                UPDATE t_student_study_schedule 
                SET student_study_index = ? 
                WHERE
                    students_id = ? 
                AND courses_id = ?
            `,[student_study_index,students_id,courses_id],"学生学习到哪个student_study_index更新成功！")
        }else {
            resp.tool.execSQLTEMPAutoResponse(`
            INSERT INTO t_student_study_schedule ( students_id, courses_id, student_study_index )
            VALUES
            ( ?, ?, ? );
            `,[students_id,courses_id,student_study_index],"学生学习到哪个student_study_index插入成功！")
        }
    })

})


//插入学生学习某门课程到哪里
router.post("/set-student-schedule",(req,resp)=>{
    const {students_id,courses_id,student_study_index} = req.body;
    console.log(students_id,courses_id,student_study_index)
    resp.tool.execSQL(`
        SELECT
            student_study_index 
        FROM
            t_student_study_schedule 
        WHERE
            students_id = ? 
        AND courses_id = ?;
    `,[students_id,courses_id]).then((result)=>{
        if (result.length > 0 ){
            resp.tool.execSQLTEMPAutoResponse(`
                UPDATE t_student_study_schedule 
                SET student_study_index = ? 
                WHERE
                    students_id = ? 
                AND courses_id = ?
            `,[student_study_index,students_id,courses_id],"学生学习到哪个student_study_index更新成功！")
        }else {
            resp.tool.execSQLTEMPAutoResponse(`
            INSERT INTO t_student_study_schedule ( students_id, courses_id, student_study_index )
            VALUES
            ( ?, ?, ? );
            `,[students_id,courses_id,student_study_index],"学生学习到哪个student_study_index插入成功！")
        }
    })

})


//根据课程id查询学校
router.get("/network-school-info/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            t_network_school.id,
            t_network_school.school_title,
            t_network_school.organization_intro,
            t_network_school.organization_heard_url 
        FROM
            t_courses
        LEFT JOIN t_teachers ON t_courses.teacher_id = t_teachers.id
        LEFT JOIN t_network_school ON t_teachers.school_id = t_network_school.id 
        WHERE
            t_courses.id = ?;
    `,[id],"课程所属教育机构信息查询成功！")

})





module.exports = router;