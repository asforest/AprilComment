# AwesomeComment

一个有后端静态页面评论系统

**本项目仍处于测试版本，建议随时备份数据以免丢失**

CSS部分参考了[xCss/Valine](https://github.com/xCss/Valine)，后端部署需要PHP环境（>7.2），数据使用Sqlite存储，方便随时迁移，所有数据自己持有，可以任意备份或者折腾。

php扩展要求

1. json
2. gd

特点：

1. 自带评论邮件通知，有发件记录文件(log.txt)方便快速排查问题
2. 加入了表情包功能，可将表情分成不同的表情包，布局更加清晰，支持自定义排序
3. 将"加载更多"评论，替换成了""翻页切换""评论
4. 支持简单验证码功能

缺点：

1. 仅支持简体中文，且语言相关配置项较少
2. 不支持访客记录和文章阅读量统计
3. 没有Emoji转图片的兼容过程
4. 仅支持Gravatar头像，不支持QQ头像
5. 无法配置必填项，默认只有昵称必填，邮箱和网站均是可选的
6. 不支持从Valine导入数据

## 代码参考

1. https://github.com/zhaojun1998/Valine-Admin
2. https://github.com/xCss/Valine
5. https://github.com/jerryc127/hexo-theme-butterfly
7. https://github.com/jzwalk/Smilies
8. https://github.com/trinitrotofu/Bubble

