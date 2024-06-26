const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {getCurrentTime} = require("../../tool/sz_dateTime");
let router = express.Router();

// 1. 注册接口
router.post("/register", (req, resp) => {
    const {account, password} = req.body;
    // 1. 账号重名检测
    resp.tool.execSQL(`select id from t_students where account=?;`, [account]).then(result => {
        if (result.length > 0) {
            resp.send(resp.tool.ResponseTemp(-2, "用户名已存在, 请修改!", {}))
        } else {
            //回头测试下面代码，有可能是int类型也有可能是字符串类型
            let nick_name = "用户"+Math.floor(Date.now());
            let header_url = "/images/user/newUser.jpg";
            let intro = "我要做爱学习的人！";
            resp.tool.execSQLTEMPAutoResponse(`
                insert into t_students (account, password, nick_name, header_url ,intro) values (?, ?, ?, ?, ?);
            `, [account, password, nick_name, header_url, intro], "注册成功!", result => {
                if (result.affectedRows > 0) {
                    return {
                        id: result.insertId,
                        account,
                        nick_name,
                        header_url,
                        intro
                    }
                }
            })
        }
    })
})


// 2. 登录接口
router.post("/login", (req, resp) => {
    const {account, password} = req.body;
    resp.tool.execSQLTEMPAutoResponse(`
        select id, account, nick_name, header_url, intro, phone_number from t_students where account=? and password=?;
    `, [account, password], "验证成功!", result => {
        if (result.length > 0) {
            return result[0]
        }
        return {
            id: -1,
            message: "用户名或者密码错误"
        }
    })
})


// // 后面的几个接口, 没有进行任何的鉴权判定，没有作操作健全处理
// router.use((req, resp, next)=>{
//     let isLogin = true;
//     if (isLogin) {
//         next()
//     } else {
//         resp.send({
//             code: -1,
//             message: "你还未登录, 请登录后调用该接口"
//         })
//     }
//     // 判定用户是否登录过了?
//     // 登录: next()
//     // 没有登录: 拦截->响应提示给回客户端
// })

//我的购物车查询
router.get("/my_cart/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.course_title,
        t_courses.price
    FROM
        t_cart
    LEFT JOIN t_courses ON t_cart.courses_id = t_courses.id 
    WHERE
        t_cart.students_id = ?;
    `,[id],"我的购物车查询成功！")
})

//删除我的购物车
router.get("/remove_cart",(req,resp)=>{
    const {course_id,student_id} = req.query;
    resp.tool.execSQLTEMPAutoResponse(`
    DELETE 
    FROM
        t_cart 
    WHERE
        courses_id = ? 
        AND students_id = ?;
    `,[parseInt(course_id),parseInt(student_id)],"我的购物车移除成功！")
})


//我的学习界面
router.get("/mystudy/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url,
        t_courses.course_title,
        COUNT( t_courses.id ) AS course_count,
        MAX( t_have_bought.create_time ) AS max_create_time
    FROM
        t_have_bought
        LEFT JOIN t_courses ON t_have_bought.course_id = t_courses.id
        LEFT JOIN t_course_list ON t_courses.id = t_course_list.course_id 
    WHERE
        t_have_bought.student_id = ${id} 
    GROUP BY
        t_courses.id 
    ORDER BY
        max_create_time DESC;
    `,[id],"我的学习查询成功!")
})

//上面的接口将要和下面的接口合并，并且上面的接口和前端都已渲染完毕


//我的学习界面(已学习)
router.get("/mystudylater",(req,resp)=>{
    const {student_id,course_id} = req.query;
    resp.tool.execSQL(`
        SELECT
            COUNT( t_student_study_history.id ) as studycount 
        FROM
            t_student_study_history
        LEFT JOIN t_course_list ON t_student_study_history.course_list_id = t_course_list.id 
        WHERE
            student_id = ? 
        AND course_id = ?
        AND status = 2;
    `,[student_id,course_id]).then((result)=>{
            resp.tool.execSQL(`
            SELECT
                COUNT(id) as total 
            FROM
                t_course_list
            WHERE course_id = ?;`,[course_id]).then((result2)=>{
                resp.send(resp.tool.ResponseTemp(0,"查询学生已学习某课程数和课程总数查询成功！",[result[0],result2[0]]))
            })
    })
})



//置顶我的学习
router.post("/top-my-study-course",(req,resp)=>{
    const {course_id,student_id} = req.body;
    const newTime = getCurrentTime();

    resp.tool.execSQLTEMPAutoResponse(`
    UPDATE t_have_bought 
    SET create_time = ?
    WHERE
        course_id = ? 
    AND student_id = ?;
    `,[newTime,course_id,student_id],"置顶成功！")

})

router.get("/my_collect/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_courses.id,
        t_courses.img_url as series_fm_url,
        t_courses.course_title as title,
        t_courses.price,
        t_courses.course_intro as intro,
        ROUND( AVG( score ), 1 ) as avg_score 
    FROM
        t_favorite
    LEFT JOIN t_courses ON t_favorite.course_id = t_courses.id
    LEFT JOIN t_comment ON t_courses.id = t_comment.course_id 
    WHERE
        t_favorite.student_id = ? 
    GROUP BY
        t_courses.id;
    `,[id],"我的收藏页查询成功！")
})

router.get("/my_coupon/:id",(req,resp)=>{
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_discount_coupon.id,
        issuing_agency,
        discounts_type,
        calculate_value,
        starting_time,
        stop_time,
        course_id 
    FROM
        t_my_discount_coupon
    LEFT JOIN t_discount_coupon ON t_my_discount_coupon.discount_coupon_id = t_discount_coupon.id 
    WHERE
        t_my_discount_coupon.student_id = ?;
    `,[id],"我的优惠卷查询成功!")
})

router.get("/my_order/:id",(req,resp)=>{

    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_my_order.course_id,
        t_my_order.create_time,
        t_courses.course_title,
        t_my_order.real_pay,
        t_my_order.order_number,
        t_my_order.is_viptype,
        t_my_order.titel,
        t_my_order.deal_state,
        t_courses.price 
    FROM
        t_my_order
    LEFT JOIN t_courses ON t_my_order.course_id = t_courses.id 
    WHERE
        t_my_order.student_id = ?;
    `,[id],"我的订单查询成功!")
})


// 5. 头像的更新
let uploader = multer({dest: path.resolve(__dirname, "../../public/images/user")})
router.post("/update_header",uploader.single("header"), (req, resp) => {
    let file = req.file;
    let {user_id} = req.body;
    let extName = path.extname(file.originalname);
    fs.renameSync(file.path, path.resolve(__dirname, "../../public/images/user/", file.filename + extName))

    // 0. 把用户对应的老头像, 删除
    resp.tool.execSQL(`
        select header_url from t_students where id=?;
    `, [user_id]).then(result=>{
        if (result.length > 0) {
            let userObj = result[0];
            // /images/user/zsf.jpg
            let userHeaderPath = userObj.header_url;
            // 不是默认头像
            if (userHeaderPath !== "/images/user/newUser.jpg") {
                // 删除对应的图片资源
                fs.unlinkSync(path.resolve(__dirname, "../../public", "." + userHeaderPath))
            }
            // 1. 把新图片路径, 存储到数据库表当中(更新)
            let newPath = `/images/user/${file.filename + extName}`;
            resp.tool.execSQL(`
                update t_students set header_url = ? where id=?;
            `, [newPath, user_id]).then(result=>{
                if (result.affectedRows > 0) {
                    resp.tool.execSQL("select id, account, nick_name, header_url, intro from t_students where id=?;", [user_id]).then(userResult=>{
                        resp.send(resp.tool.ResponseTemp(0, "更新头像成功", userResult[0]))
                    })
                } else {
                    resp.send(resp.tool.ResponseTemp(0, "更新头像失败", {}))
                }

            })

        }
    })

})


// 6. 用户基本信息更新
router.post("/update_info", (req, resp) => {
    const {nick_name,sex,intro,name,E_mail,phone_number,qq_number,student_id} = req.body;
    resp.tool.execSQL(`
    UPDATE t_students 
    SET nick_name = ?,
        sex = ?,
        intro = ?,
        name = ?,
        E_mail = ?,
        phone_number = ?,
        qq_number = ? 
    WHERE
        id = ?;
    `, [nick_name,+sex,intro,name,E_mail,phone_number,qq_number,+student_id]).then(result=>{
        // id 不存在 affectedRows
        // id 存在 新旧内容不一样
        // id 存在  新旧内容一样
        // console.log(result);
        if (result.changedRows > 0) {
            // 更新成功
            resp.tool.execSQL("select id, account, nick_name, header_url, intro from t_students where id=?;", [student_id]).then(userResult=>{
                resp.send(resp.tool.ResponseTemp(0, "更新成功！", userResult[0]))
            })
        }else {
            //已经更新过了
            resp.send(resp.tool.ResponseTemp(-1, "更新失败！", {}))
        }
    })
})



// 6. 用户基本信息查询
router.get("/get-user-info/:id", (req, resp) => {
    const {id} = req.params;
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            id,
            nick_name,
            sex,
            intro,
            name,
            E_mail,
            phone_number,
            qq_number,
            shipping_address 
        FROM
            t_students 
        WHERE
            id = ?;
    `,[id],"用户基本信息查询成功！")
})

// 7. 密码的修改
router.post("/update_password", (req, resp)=>{
    const {account, password, new_password} = req.body;
    resp.tool.execSQLTEMPAutoResponse(`
        update t_students set password=? where account=? and password=?;
    `, [new_password, account, password], "更新完成!", result=>{
        if (result.affectedRows > 0) {
            return {
                code: 0
            }
        } else {
            return {
                code: -1
            }
        }
    })
})

// 7. 收货地址的修改
router.post("/update_address", (req, resp)=>{
    const {address,student_id} = req.body;
    resp.tool.execSQLTEMPAutoResponse(`
        update t_students set shipping_address=? where id=?;
    `, [address,student_id], "收货地址更新完成!", result=>{
        if (result.affectedRows > 0) {
            return {
                message: "用户收货地址更新成功!"
            }
        } else {
            return {
                message: "更新失败！"
            }
        }
    })
})

//8.获取其他用户信息
router.post("/other_people_data", (req, resp)=>{
    const {student_id} = req.body;
    console.log(student_id)
    resp.tool.execSQLTEMPAutoResponse(`
        SELECT
            id,
            nick_name,
            header_url,
            intro 
        FROM
            t_students WHERE id = ?;
    `, [student_id], "其他用户的信息接口开发完毕！")
})


// 4. 学习历史记录新增/更新操作
router.post("/update_study_history", (req, resp) => {


    // is_finish: 1 代表已经学完了该课时, 否则, 就正在学习
    const {student_id, course_list_id, status=0} = req.body;

    resp.tool.execSQL(`
        select count(*) as is_learned from t_student_study_history where student_id=? and course_list_id=?;
    `, [student_id, course_list_id]).then(result=>{
        let is_learned = result[0].is_learned;
        if (is_learned > 0) {
            // 更新

            resp.tool.execSQLTEMPAutoResponse(`
                    UPDATE t_student_study_history 
                        SET status = ?
                    WHERE
                        student_id = ? 
                        AND course_list_id = ?;
            `, [+status === 0 ? 1 : 2, student_id, course_list_id], "更新成功", result=>({}))
        } else {
            // 新增
            resp.tool.execSQLTEMPAutoResponse(`
                insert into t_student_study_history (student_id, course_list_id, status) values (?, ?, ?);
            `, [student_id, course_list_id, +status === 0 ? 1 : 2, student_id, course_list_id], "插入成功!", result=>({}))
        }
    })
})


// 购买接口
router.post("/buy-course", (req, resp) => {
    try {
        const { courseIdArray, student_id } = req.body;
        // 查询指定学生已经购买的课程id集合
        resp.tool.execSQL(`
      SELECT course_id FROM t_have_bought WHERE student_id = ?;
    `, [student_id]).then((result) => {
            const boughtCourseIds = new Set(result.map((item) => item.course_id));

            // 筛选出未购买的课程id集合
            const newCourseIdArray = courseIdArray.filter((item) => !boughtCourseIds.has(item));

            if (newCourseIdArray.length === 0) {
                resp.send(resp.tool.ResponseTemp(-1, "你选择的课程都买过了哦！", []));
                return;
            }

            // 将新的课程id和学生id组成的组合插入到 t_have_bought 表中
            const values = newCourseIdArray.map((course_id) => `(${course_id}, ${student_id})`).join(", ");

            resp.tool.execSQL(`
        INSERT INTO t_have_bought (course_id, student_id)
        VALUES ${values};
      `, []).then((result) => {
                if (result.affectedRows > 0) {
                    resp.send(resp.tool.ResponseTemp(0, "课程购买成功！", []));
                } else {
                    resp.send(resp.tool.ResponseTemp(-1, "课程购买失败", []));
                }
            });
        });
    } catch (error) {
        console.log("什么鬼")
        resp.send(resp.tool.ResponseTemp(-1, "购买课程失败：" + error.message, []));
    }
});






module.exports = router;