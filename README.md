# AprilComment

![npm](https://img.shields.io/npm/v/april-comment?logo=npm&style=flat-square)
![GithubTopLanguage](https://img.shields.io/github/languages/top/innc11/AprilComment?color=success&style=flat-square)
![GithubLastCommit](https://img.shields.io/github/last-commit/innc11/AprilComment?style=flat-square)

一个[Waline](https://github.com/lizheming/waline)评论系统的客户端实现，特点是简洁易用，兼容Waline客户端的大部分特性

[文档/演示](https://innc11.github.io/AprilComment/)

## 与Waline官方客户端的对比

特色功能

+ 可以在不对服务端进行任何修改的前提下平滑切换到AprilComment
+ 支持表情分类（表情包分类）和表情动态渲染
+ 支持指定多个作者邮箱（对应会显示作者小标签）
+ 支持在顶部也显示一个分页按钮，方便快速翻页
+ 评论数据以Markdown格式渲染显示

尚未完善的地方

+ 不支持多语言
+ 不支持代码高亮
+ 不支持'最近评论'挂件
+ 不支持上传图片

## 图片

![overview.png](assets/overview.png)

支持Markdown渲染、表情包分类、实时编辑预览

![md_preview_smilie.png](assets/md_preview_smilie.png)

支持Waline登录系统和顶部翻页按钮（只在第二页开始才会显示）

![login_pagin.png](assets/login_pagin.png)
