const express = require("express");
let router = express.Router()

router.get("/",(req,res)=>{
    res.send({
        test:"成功"
    })

})

module.exports = router;