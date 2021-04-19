# AprilComment

<img alt="npm" src="https://img.shields.io/npm/v/april-comment?logo=npm&style=flat-square"><img alt="GitHub top language" src="https://img.shields.io/github/languages/top/innc11/AprilComment?color=success&style=flat-square"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/innc11/AprilComment?style=flat-square">

一个[Waline](https://github.com/lizheming/waline)评论系统的客户端实现，特点是简洁易用，兼容Waline客户端的大部分特性

## 与Waline官方客户端的区别

特色功能

1. 支持表情分类（表情包分类）和表情动态渲染
2. 支持指定多个作者邮箱（对应会显示作者小标签）
3. 作者小标签本身可配置显示其它的文字
4. 支持在顶部也显示一个分页按钮，方便快速翻页
5. 评论数据以Markdown格式渲染显示

不兼容的地方

1. 不支持多语言
2. 不支持代码高亮
3. 不支持Gravatar 头像 CDN
4. 不支持上传图片
5. 不支持登录

## 安装

在使用AprilComment之前请确保已经安装好了Waline服务端并且可以正常访问和评论

1. 需要在`head`标签中引入js和css资源
2. 初始化`AprilComment`对象并调用`create()`方法

```html
<head>
    <script src="https://cdn.jsdelivr.net/npm/april-comment@0.1.2/dist/index.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/april-comment@0.1.2/dist/index.css" />
</head>
<body>
    <div id="comment-widget"></div>
    <script>
        $(function() {
            new AprilComment({
                el: 'comment-widget',
                api: 'https://your-waline-backend-url.app',
                pathname: location.pathname
            }).create()
        })
    </script>
    
</body>
```

## 配置选项

### el

+ 类型：`string`
+ 默认值：`无，必选参数`
+ 对应Waline选项：`el`

AprilComment的初始化位置，参数格式为元素id（不带`#`），而非CSS选择器

### api

+ 类型：`string`
+ 默认值：`无，必选参数`
+ 对应Waline选项：`serverURL`

Waline 的服务端地址（地址末尾没有`/`）

### pathname

+ 类型：`string`
+ 默认值：`location.pathname`
+ 对应Waline选项：`path`

当前页面的路径，相同的pathname会被视为是同一个页面，会加载相同的评论

### authorMails

+ 类型：`string[]`
+ 默认值：`undefined`

作者的邮箱(md5格式)列表，对应的评论下面会显示一个"作者"的小标签，支持多个邮箱

### authorLabel

+ 类型：`string`
+ 默认值：`'作者'`

"作者"小标签里面显示的文字，可以改成"博主"或者"开发者"的样式

### smilieEnabled

+ 类型：`boolean`
+ 默认值：`true`

是否显示表情按钮，关闭的话就没法插入表情了（但不影响解析）

### smilieAsUrl

+ 类型：`boolean`
+ 默认值：`false`

是否将表情以html的img标签存储在评论里，比如`<p>你好啊！<img src="https://domain.com/表情URL.png" /></p>`，如果是`false`会以代码的形式进行存储，比如：`<p>你好啊！:aru_001.png:</p>`

如果为`true`：就和Waline默认的行为一致，表情可以显示在评论邮件里，但表情URL一旦更换就会无法显示

如果为`false`：每次显示评论的时候才会把表情代码（比如上面的代码）进行渲染，无法在评论邮件里显示表情，但更换表情URL不会影响到表情在网页端的显示

### smilies

+ 类型：`object`
+ 默认值：`undefined`
+ 对应Waline选项：`emojiCDN/emojiMaps`

自定义表情对象

```js

<script>
    var simlies = {
        "url": "https://cdn.jsdelivr.net/gh/innc11/BlogSmilies@latest",
        "maomao": [
            "mao_haha.gif",
            "mao_laugh.jpg",
            "mao_001.png"
        ],
        "aru": [
            "aru_huaji.png",
            "aru_1.png",
            "aru_2.png",
            "aru_3.png"
        ]
    }

    $(function() {
        new AprilComment({
            el: 'comment-widget',
            api: 'https://your-waline-backend-url.app',
            pathname: location.pathname
            simlies: simlies
        }).create()
    })
</script>

```

`url`代表表情图片的目录地址，`maomao`和`aru`是表情包的名字（名字可以自定义，不影响表情解析），每个表情会按表情包进行归类显示

需要注意的是，与Waline不同，每个表情的`title`或者说是表情代码，取决于文件名本身，请确保每个表情图片的文件名中没有空格，不同表情包之间也不要出现图片的文件名冲突的情况

（`url`本身不能作为一个表情包的名字存在）

### capacity

+ 类型：`number`
+ 默认值：`10`
+ 对应Waline选项：`pageSize`

评论分页，每页最多显示多少条评论

### focusOnComment

+ 类型：`boolean`
+ 默认值：`true`

是否自动聚焦到对应的评论上（当从通知邮件跳转过来时）

### paginatorLength

+ 类型：`number`
+ 默认值：`3`

最多显示多少个翻页按钮，如果设置为3表示最多显示`1+3x2=7`个按钮

### dualPaginator

+ 类型：`boolean`
+ 默认值：`true`

是否在评论顶部也显示翻页按钮，方便快速翻阅评论（第一页不显示）

### mailRequired

+ 类型：`boolean`
+ 默认值：`true`

评论时是否一定要填写邮箱

### websiteRequired

+ 类型：`boolean`
+ 默认值：`true`

评论时是否一定要填写网站链接

### placeholders

+ 类型：`boolean`
+ 默认值：`true`
+ 对应Waline选项：`placeholder`

各种占位符

+ `comment_tips`：评论框的占位符
+ `nick`：昵称输入框的占位符
+ `mail`：邮箱输入框的占位符
+ `website`：网站链接输入框的占位符

```js
<script>
    $(function() {
    new AprilComment({
        el: 'comment-widget',
        api: 'https://your-waline-backend-url.app',
        pathname: location.pathname,
        placeholders: {
            comment_tips: '说点儿什么吧，留下邮箱可以收到回复提醒',
            nick: '昵称',
            mail: '邮箱',
            website: '网站',
        }
    }).create()
})
</script>
```

只替换一部分占位符也是可以的

```html
<script>
    new AprilComment({
        placeholders: {
            comment_tips: '说点儿什么吧，留下邮箱可以收到回复提醒'
        }
    }).create()
</script>
```

## 高级用法

目前时间有限，仅提供了API，很多数据需要在拿到后自己渲染

### 获取最新评论

```javascript
var comment = new AprilComment({
    el: 'comment-widget',
    api: 'https://your-waline-backend-url.app',
    pathname: location.pathname
})

var recentComments: object[] = comment.recent()
```

### 获取文章评论数

```javascript
var comment = new AprilComment({
    el: 'comment-widget',
    api: 'https://your-waline-backend-url.app',
    pathname: location.pathname
})

var count: number = comment.count(location.pathname)
```
### 获取文章浏览次数

```js
var comment = new AprilComment({
    el: 'comment-widget',
    api: 'https://your-waline-backend-url.app',
    pathname: location.pathname
})

var count: number = comment.views(location.pathname)
```

### 给文章浏览次数+1

```js
var comment = new AprilComment({
    el: 'comment-widget',
    api: 'https://your-waline-backend-url.app',
    pathname: location.pathname
})

var count: number = comment.visit(location.pathname)
```

## API

### 获取AprilComment版本

```js
AprilComment.version()
```