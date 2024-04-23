# 抄袭了网易云课堂的UI和网站的业务逻辑,然后自己设计数据库结构、自己写前端和后端代码，独自从0到1构建网易云课堂
# WangYiYunCourse-Client
# 总共有20个动态数据渲染的页面，包含了网易云课堂所有基本功能架构！
![Alt text for image1](/public/website-screenshot/a.png)
![Alt text for image1](/public/website-screenshot/h.png)
![Alt text for image1](/public/website-screenshot/c.jpeg)
![Alt text for image1](/public/website-screenshot/b.png)
![Alt text for image1](/public/website-screenshot/i.png)
![Alt text for image1](/public/website-screenshot/g.png)
![Alt text for image1](/public/website-screenshot/j.png)
![Alt text for image1](/public/website-screenshot/e.png)
![Alt text for image1](/public/website-screenshot/f.png)

网站说明： 这个网站一共包含了后端接口服务器、前台服务器、后台服务器、三个项目，如果你想运行这个网站，你需要下载这三个项目和mysql文件。

可以运行的nodejs版本：18.19.0
一、下载网易云课堂三个项目和MySQL文件到本地（网易云课堂后台还没有开发，但不影响前台的运行，所以现在我的github远程仓库只有两个关于网易云课堂的项目）  
二、下载到本地后，如果你的计算机安装了WebStorm，请你使用WebStorm打开这三个项目，WebStorm就会提示你使用npm安装依赖包，你点击安装依赖包即可（三个项目都是同样的操作，用webstorm打开三个项目后点击安装依赖包）。  
三、安装完依赖包后运行sql文件。此网站和严选云课有着相似的架构，可以说是阉割版严选与课堂。当然安全性和健全性比网易云课堂原网站差太远，原因是安全性需要后端开发工程师、前端开发工程师、网站架构师、网络安全等等岗位共同设计，我一个人是无法完成的。但是无论怎样此网站也是有自己的数据库架构。你需要在你的电脑上安装mysql并且运行sql文件（建议使用MySql可视化工具运行sql文件更方便），这样你的电脑上就有网易云课堂数据库的数据和结构了。默认情况下你的电脑上的网易云课堂后端服务器是无法访问数据库的，需要先在Windows PoverShell设置权限，否则网站运行的时候后端访问数据库时会报错，具体设置权限的步骤可以查百度。  
四、启动三个项目的服务器，如果你的计算机安装了webstorm：1、打开前台服务器需要你双击前台根目录的package.json，点击"dev": "next dev"前面的开始按钮运行。后端服务器需要进入src目录下并且运行index.js文件。  
五、保证后端和前端服务器都打开的前提下。打开浏览器，地址栏输入 http://localhost:3000/ 即可访问网站。  