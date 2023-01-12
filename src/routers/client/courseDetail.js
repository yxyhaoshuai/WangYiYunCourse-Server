const express = require("express");
let router = express.Router();

router.get("/course/introduction/crumbs/:id",(req,resp)=>{
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

router.get("/course/introduction/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        a.id as courseid,
        a.img_url as courseurl,
        a.course_title as coursetitle,
        a.price as courseprice,
        a.study_count as studentcount,
        a.course_intro as courseintro,
        a.course_intro_url as courseintro_url,
        a.name as teacher_name,
        a.intro as teacherintro,
        ROUND( AVG( score ), 1 ) AS avg_score 
    FROM
        (
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.course_title,
        t_courses.price,
        t_courses.course_intro_url,
        t_courses.course_intro,
        t_teachers.name,
        t_teachers.intro,
        COUNT( t_have_bought.id ) AS study_count 
    FROM
        t_courses
    LEFT JOIN t_have_bought ON t_courses.id = t_have_bought.course_id
    LEFT JOIN t_teachers ON t_courses.teacher_id = t_teachers.id 
    GROUP BY
        t_courses.id 
        ) AS a
    LEFT JOIN t_comment ON a.id = t_comment.course_id 
    GROUP BY
        a.id 
    HAVING
        a.id = ?;
    `,[id],"课程详情查询成功！")
})

router.get("/course/introduction/comment/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_students.id,
        t_students.header_url,
        t_students.nickname,
        t_comment.score,
        t_comment.content,
        t_comment.creation_time 
    FROM
        t_comment
    LEFT JOIN t_students ON t_comment.student_id = t_students.id 
    WHERE
        t_comment.course_id = ?;
    `,[id],"课程详情评论查询成功！")
})


router.get("/course/introduction/course_item/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        * 
    FROM
        t_course_list 
    WHERE
        course_id = ? 
    ORDER BY
        t_course_list.id ASC;
    `,[id],"课时条目查询成功！")
})

router.post("/course/introduction/insertcomment", (req, resp) => {
    const {course_id, student_id, content,score} = req.body;

    //查看是否评论过
    resp.tool.execSQL(`select id from t_comment where student_id=? and course_id=?;`, [student_id,course_id]).then(result => {
        if (result.length > 0) {
            resp.send(resp.tool.ResponseTemp(-1, "每个人只能评论一次哦!", {}))
        } else {
            resp.tool.execSQLTEMPAutoResponse(`
        INSERT INTO t_comment(course_id,student_id,content,score) VALUES(?,?,?,?);
    `, [course_id, student_id, content,score], "评论成功!", result=>{
                if (result.affectedRows > 0) {
                    return {
                        message: "评论成功!"
                    }
                } else {
                    return {
                        message: "评论失败"
                    }
                }
            })
        }
    })
})


router.post("/course/introduction/insertfavorite", (req, resp) => {
    const {course_id, student_id} = req.body;

    //查看是否收藏过
    resp.tool.execSQL(`select id from t_favorite where student_id=? and course_id=?;`, [student_id,course_id]).then(result => {
        if (result.length > 0) {
            resp.send(resp.tool.ResponseTemp(-1, "您已经收藏过了哦！", {}))
        } else {
            resp.tool.execSQLTEMPAutoResponse(`
        INSERT INTO t_favorite(course_id,student_id) VALUES(?,?);
    `, [course_id, student_id], "收藏成功!", result=>{
                if (result.affectedRows > 0) {
                    return {
                        message: "收藏成功!"
                    }
                } else {
                    return {
                        message: "收藏失败！"
                    }
                }
            })
        }
    })
})

module.exports = router;