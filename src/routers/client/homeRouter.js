const express = require("express");
let router = express.Router()

//首页测试
router.get("/",(req,res)=>{
    res.send({
        test:"成功"
    })

})


//多级大纲列表查询
router.get("/class_list",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        t_course_categorys.id,
        t_course_categorys.class_name AS class_name1,
        a.class_name AS class_name2 
    FROM
        t_course_categorys
    LEFT JOIN t_course_categorys AS a ON t_course_categorys.id = a.parent_id 
    WHERE
        t_course_categorys.id <= ?;
    `,[8],"多级大纲列表查询成功!")
})

//广告轮播图查询
router.get("/ad",(req,resp)=>{
    resp.tool.execSQLTEMPAutoResponse(`
    SELECT
        * 
    FROM
        t_ad
    WHERE is_home_page=?;
    `,[1],"首页广告轮播图查询成功！")
})

module.exports = router;