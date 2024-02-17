const express = require("express");
let router = express.Router();

router.get("/course/introduction/crumbs/:id", (req, resp) => {
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id AS courseId,
        c.id AS classoneId,
        c.class_name AS classone,
        b.id AS classtwoId,
        b.class_name AS classtwo,
        a.id AS classthreeId,
        a.class_name AS classthree
    FROM
        t_courses
        LEFT JOIN t_course_categorys AS a ON t_courses.categorys_id = a.id
        LEFT JOIN t_course_categorys AS b ON a.parent_id = b.id
        LEFT JOIN t_course_categorys AS c ON b.parent_id = c.id 
    WHERE
        t_courses.id = ?;
    `, [id], "面包屑导航查询成功！")
})

router.get("/course/introduction/:id", (req, resp) => {
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
    `, [id], "课程详情查询成功！")
})

router.get("/course/commentList", (req, resp) => {
    let {id,page_num=1,page_size=20}=req.query;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            t_students.id,
            t_students.header_url,
            t_students.nick_name,
            t_comment.score,
            t_comment.content,
            t_comment.creation_time 
        FROM
            t_comment
        LEFT JOIN t_students ON t_comment.student_id = t_students.id 
        WHERE
            t_comment.course_id = ? 
        ORDER BY
            t_comment.creation_time DESC 
        LIMIT ${(page_num - 1) * page_size}, ${page_size};
    `, [id], "课程详情评论查询成功！")
})


router.get("/course/commentListLimit5/:id", (req, resp) => {
    let {id}=req.params;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            t_students.id,
            t_students.header_url,
            t_students.nick_name,
            t_comment.score,
            t_comment.content,
            t_comment.creation_time 
        FROM
            t_comment
        LEFT JOIN t_students ON t_comment.student_id = t_students.id 
        WHERE
            t_comment.course_id = ? 
        ORDER BY
            t_comment.creation_time DESC 
        LIMIT 5;
    `, [id], "课程详情评论限制5条查询成功！")
})


router.get("/course/is_comment", (req, resp) => {
    let {cid,uid}=req.query;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        * 
    FROM
        t_comment 
    WHERE
        course_id = ? 
    AND student_id = ?;
    `,[cid,uid],"用户是否评论该课程查询成功！")

})


router.get("/course/commentListCount/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            COUNT(id) as commentCount
        FROM
            t_comment WHERE course_id = ?; 
    `,[id],"评论数量查询成功！")

})


router.get("/course/introduction/course_item/:id", (req, resp) => {
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        * 
    FROM
        t_course_list 
    WHERE
        course_id = ? 
    ORDER BY
        t_course_list.num ASC;
    `, [id], "课时条目查询成功！")
})

router.post("/course/introduction/insertcomment", (req, resp) => {
    const {course_id, student_id, content, score} = req.body;

    //查看是否评论过
    resp.tool.execSQL(`select id from t_comment where student_id=? and course_id=?;`, [student_id, course_id]).then(result => {
        if (result.length > 0) {
            resp.send(resp.tool.ResponseTemp(-1, "您已经评论过了哦！", {}))
        } else {
            resp.tool.execSQLTEMPAutoResponse(`
        INSERT INTO t_comment(course_id,student_id,content,score) VALUES(?,?,?,?);
    `, [course_id, student_id, content.length ===0 ? "该用户未给予评价" : content, score], "评论成功!", result => {
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


//收藏单个课程
router.post("/course/introduction/insertfavorite", (req, resp) => {
    const {course_id, student_id} = req.body;
    console.log(course_id, student_id)

    //查看是否收藏过
    resp.tool.execSQL(`select id from t_favorite where student_id=? and course_id=?;`, [student_id, course_id]).then(result => {
        if (result.length > 0) {
            resp.send(resp.tool.ResponseTemp(-1, "您已经收藏过了哦！", {}))
        } else {
            resp.tool.execSQLTEMPAutoResponse(`
        INSERT INTO t_favorite(course_id,student_id) VALUES(?,?);
    `, [course_id, student_id], "收藏成功!", result => {
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


//收藏多个课程
router.post("/course/introduction/insertfavorites", (req, resp) => {
    const {courseIdArray, student_id} = req.body;
    console.log(courseIdArray,1)
    //查看是否收藏过
    resp.tool.execSQL(`
        SELECT
            * 
        FROM
            t_favorite 
        WHERE
            student_id = ?;
`, [student_id]).then(result => {
        console.log(result,2)
        if (result.length > 0) {
            resp.tool.execSQL(`
                DELETE FROM t_favorite WHERE course_id IN (${courseIdArray.map(item=>{
                    return item
                })});
            `).then((result) => {
                if (result.affectedRows > 0) {
                    resp.tool.execSQLTEMPAutoResponse(`
                        INSERT INTO t_favorite ( course_id, student_id ) VALUES ${courseIdArray.map(item=>{
                            return "("+item+","+student_id+")"
                    })};
            `,[],"系列课程中的子课程插入成功！")
                }
            })
        } else {
            resp.tool.execSQLTEMPAutoResponse(`
            INSERT INTO t_favorite ( course_id, student_id ) VALUES ${courseIdArray.map(item=>{
            return "("+item+","+student_id+")"
        })};
            `, [], "系列课里的子课程成功！")
        }
    })
})


router.post("/course/introduction/courseinsertstatus", (req, resp) => {
    const {student_id, course_list_id, status} = req.body;
    resp.tool.execSQL(`
        SELECT * FROM t_student_study_history WHERE student_id = ? and course_list_id = ?;
    `, [student_id, course_list_id]).then(result => {
        if (result.length > 0) {
            resp.tool.execSQLTEMPAutoResponse(`
                UPDATE t_student_study_history set status=? WHERE student_id = ? and course_list_id = ?;
            `, [status, student_id, course_list_id], "学习历史状态修改成功！")
        } else {
            resp.tool.execSQLTEMPAutoResponse(`
            INSERT INTO t_student_study_history ( t_student_study_history.student_id, t_student_study_history.course_list_id, t_student_study_history.status )
            VALUES
                ( ?, ?, ? );
            `, [student_id, course_list_id, status], "学习状态记录成功！")
        }
    })
})

router.post("/course/introduction/insertcart", (req, resp) => {
    const {courses_id, students_id} = req.body;
    resp.tool.execSQL(`
    SELECT * FROM t_cart WHERE courses_id = ? and students_id = ?;
    `, [courses_id, students_id]).then(result => {
        if (result.length > 0) {
            resp.send(resp.tool.ResponseTemp(-1, "您已经加入过购物车了！", {}))
        } else {
            resp.tool.execSQLTEMPAutoResponse(`
                INSERT INTO t_cart ( courses_id, students_id )
                VALUES
                    ( ?, ? );
            `, [courses_id, students_id], "加入购物车成功！")
        }
    })
})

// 4. 课程大纲
router.get("/outline", (req, resp) => {
    const {courseId,student_id} = req.query;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            t_course_list.id,
            t_course_list.num,
            t_course_list.title,
            t_course_list.video_url,
            t_student_study_history.status
        FROM
            t_course_list
        LEFT JOIN t_student_study_history on  t_course_list.id = t_student_study_history.course_list_id
        WHERE
            t_course_list.course_id = ? and t_student_study_history.student_id = ?
        ORDER BY
        num;
    `, [courseId,student_id],"课程大纲查询成功！")
})


// 4. 课程大纲二
router.get("/outline/two", (req, resp) => {
    const {courseId} = req.query;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            t_course_list.id,
            t_course_list.num,
            t_course_list.title,
            t_course_list.video_url
        FROM
            t_course_list
        WHERE
            t_course_list.course_id = ?
        ORDER BY
            num;
    `, [courseId],"课程大纲查询成功！")
})


module.exports = router;