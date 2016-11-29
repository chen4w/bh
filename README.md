# BH
BeHere的后端服务,用Meteor搭建,通过Mac和Win下测试

## Running the app
-----------------------------------
* git clone 到本地
* meteor npm install 安装依赖组件
* [Win下单独安装GraphicsMagick] (http://www.graphicsmagick.org/)
* [Mac下单独安装GraphicsMagick] (https://www.npmjs.com/package/gm)
* [Ubuntu下允许监视文件目录]（https://github.com/BrowserSync/browser-sync/issues/224） 
* echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
* meteor 
* 或者 meteor debug

## 用到的主要组件
-----------------------------------
* 前端组件用React + Material-ui
* 采用React router路由url
* chokidar监视文件目录
* websocket推送文件变更消息
* Meteor.call 调用后端api
* node-cache 缓存文件
* gm图像抽点





