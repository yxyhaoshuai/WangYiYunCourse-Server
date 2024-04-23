# 抄袭网易云课堂的所有UI和功能逻辑(有一些页面不做),独自设计数据库结构、独自编写前端和后端代码，独自从0到1构建网易云课堂！
# WangYiYunCourse-Client
# 总共有20个动态数据渲染的页面，包含了网易云课堂所有基本功能架构！
一、网站说明： 此网站包含了后端（WangYiYunCourse-Server）、前端前台（WangYiYunCourse-Client）、前端后台（wang-yi-yun-course-manage）三个项目，如果你想运行这个网站，你需要下载这三个项目和mysql文件，mysql文件在项目WangYiYunCourse-Client的文件目录里。
二、此网站所有项目的nodejs版本为：18.19.0 以上版本。
三、运行网站：
1.安装18.19.0以上版本的nodejs。
2.克隆网易云课堂的三个项目和MySQL文件到本地。
3.安装8.0版本的mysql并执行sql文件。
4.用终端分别进入三个项目的根目录执行npm install安装所有依赖包。  
5.此网站和网易云课有着相似的架构，可以说是阉割版网易云课堂。当然安全性比真实的网易云课堂差，请求参数这些都没有做加密处理。默认情况下你的电脑上的网易云课堂后端是无法连接数据库的，需要先在Windows PoverShell设置权限，否则网站无法运行，具体设置权限的步骤可以自行查百度。  
6.启动后端项目（WangYiYunCourse-Server）：运行src目录下的index.js文件即可，也可以用pm2启动项目。
7.启动网站前台项目（WangYiYunCourse-Client）：用终端进入项目根目录执行npm run dev命令。
8.启动网站后台项目（wang-yi-yun-course-manage）：用终端进入项目根目录执行npm run serve命令。
9.打开浏览器，地址栏输入 http://localhost:3000/ 访问网站前台，地址栏输入 http://localhost:3002/ 访问网站后台。  
![Alt text for image1](/public/website-screenshot/a.png)
![Alt text for image1](/public/website-screenshot/h.png)
![Alt text for image1](/public/website-screenshot/c.jpeg)
![Alt text for image1](/public/website-screenshot/b.png)
![Alt text for image1](/public/website-screenshot/i.png)
![Alt text for image1](/public/website-screenshot/g.png)
![Alt text for image1](/public/website-screenshot/j.png)
![Alt text for image1](/public/website-screenshot/e.png)
![Alt text for image1](/public/website-screenshot/f.png)

