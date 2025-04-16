# WangYiYunCourse-Server
>本项目致敬网易云课堂，仿照其 UI 设计和核心功能逻辑（部分页面未开发），由开发者本人 独立设计数据库结构，独立编写前端与后端代码，从 0 到 1 搭建完成。
---
## ⚠️ 注意事项
本项目为个人开发练习用途，安全性未做严格处理（例如：请求参数未加密），请勿直接用于生产环境。

所有功能与页面为学习参考使用，无商业用途。

欢迎提出建议或一起优化！

---
## 📌 项目简介
本项目为一个仿制网易云课堂的学习平台系统，包含了共 **20 个动态数据渲染页面**，覆盖了网易云课堂的核心功能模块，前后端全部由本人独立完成开发。

该项目由以下两个子项目组成：

- 🎯 后端服务：`WangYiYunCourse-Server`
- 🎯 前台前端：`WangYiYunCourse-Client`

📁 数据库文件（`.sql`）位于 `WangYiYunCourse-Client` 项目根目录。

---
## 🔧 技术要求
- Node.js：**≥ 18.19.0**
- MySQL：**推荐 8.0+**
---
## 🚀 快速启动
### 1. 安装 Node.js
请确保本机已安装 Node.js 18.19.0 或更高版本。
### 2. 克隆项目
将以下两个项目和数据库文件克隆到本地：

WangYiYunCourse-Server

WangYiYunCourse-Client
### 3. 配置数据库
安装并启动 MySQL 8.0+

使用数据库客户端导入 SQL 文件（在 WangYiYunCourse-Client 项目目录中）
### 4. 安装依赖
分别进入两个个项目根目录，执行以下命令：

npm install
### 5. 配置数据库连接权限（仅限 Windows）
如果你在 Windows 上运行，默认 Node.js 可能无法直接连接数据库。你需要在 PowerShell 中为数据库开启远程访问权限，可搜索：

mysql 远程连接权限配置
### 6. 启动后端服务
进入 WangYiYunCourse-Server 项目根目录，执行：

node src/index.js

或使用 PM2 守护进程：

pm2 start src/index.js
### 7. 启动前台项目
进入 WangYiYunCourse-Client 根目录，执行：

npm run dev
### 8. 访问地址
浏览器输入地址：http://localhost:3000/

---
## 📷 效果预览
![Alt text for image1](/src/public/website-screenshot/a.png)
![Alt text for image1](/src/public/website-screenshot/h.png)
![Alt text for image1](/src/public/website-screenshot/c.jpeg)
![Alt text for image1](/src/public/website-screenshot/b.png)
![Alt text for image1](/src/public/website-screenshot/i.png)
![Alt text for image1](/src/public/website-screenshot/g.png)
![Alt text for image1](/src/public/website-screenshot/j.png)
![Alt text for image1](/src/public/website-screenshot/e.png)
![Alt text for image1](/src/public/website-screenshot/f.png)
---
## 📞 联系方式
如果你对该项目有兴趣，欢迎通过微信“YanXiuYuWeiXinHao”与我交流！


```bash
