const express = require("express");
const path = require("path");
const {rizhiM, notFoundMF, handlerErrorMF, crossDomainM, toolM} = require("./middleware/sz_middleware")


//1、前台路由
const homeRouter = require("./routers/client/homeRouter")
const courseSearch = require("./routers/client/courseSearch")
const prividerSearch = require("./routers/client/providerSearch")
const prividerDetail = require("./routers/client/providerDetail")
const teacherDetail = require("./routers/client/teacherDetail")
const courseDetail = require("./routers/client/courseDetail")
const officialMessage = require("./routers/client/officialMessage")
const user = require("./routers/client/user")
const liveOpenClass = require("./routers/client/morePage")
const categorysDetail = require("./routers/client/categorysDetail")




// 2、后台路由器





// 3、PM2:
// Node 进程管理工具: 性能监控, 负载均衡, 自动重启...
// 安装: yarn global add pm2; npm install pm2 -g


let app = express();

// 4、挂载工具的中间件
app.use(toolM)
app.use(express.json(), express.urlencoded({extended: true}));
app.use(rizhiM)
app.use(crossDomainM);
app.use(express.static(path.resolve(__dirname, "public")));




// 5、挂载路由中间件
app.use("/",homeRouter);
app.use("/",courseSearch)
app.use("/",prividerSearch)
app.use("/",prividerDetail)
app.use("/",teacherDetail)
app.use("/",courseDetail)
app.use("/",officialMessage)
app.use("/",user)
app.use("/",liveOpenClass)
app.use("/",categorysDetail)





// 6、404
app.use(notFoundMF(path.resolve(__dirname, "./defaultPages/404.html")));

// 7、500
app.use(handlerErrorMF(path.resolve(__dirname, "./defaultPages/500.html")))




app.listen(3000,()=>{
    console.log("网易云课堂服务器开启成功: localhost:3000/");
})