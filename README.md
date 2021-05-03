# AprilComment

![npm](https://img.shields.io/npm/v/april-comment?logo=npm&style=flat-square)
![GithubTopLanguage](https://img.shields.io/github/languages/top/innc11/AprilComment?color=success&style=flat-square)
![GithubLastCommit](https://img.shields.io/github/last-commit/innc11/AprilComment?style=flat-square)

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
3. 不支持'最近评论'挂件
4. 不支持上传图片

## 安装

在使用AprilComment之前请确保已经安装好了Waline服务端并且可以正常访问和评论

1. 需要在`head`标签中引入js和css资源
2. 初始化`AprilComment`对象

```html
<head>
    <script src="https://cdn.jsdelivr.net/npm/april-comment@0.2.1/dist/index.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/april-comment@0.2.1/dist/index.css" />
</head>
<body>
    <div id="comment-widget"></div>
    <script>
        $(function() {
            new AprilComment({
                el: 'comment-widget',
                api: 'https://your-waline-backend-url.app',
                pathname: location.pathname
            })
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

>  注意：为安全起见，建议使用Waline自带的登录功能（参考下方），而不建议使用本功能，如果你的邮箱被别人知道了，别人同样是可以假扮你进行回复的，此功能仅做测试作用

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

### avatarDefault

+ 类型：`string`
+ 默认值：`''`
+ 对应Waline选项：`avatar`

Gravatar的默认头像，更多信息请查看[头像配置](https://waline.js.org/client/avatar.html)

可用值：

- `''`
- `'mp'`
- `'identicon'`
- `'monsterid'`
- `'wavatar'`
- `'retro'`
- `'robohash'`
- `'hide'`

### avatarSource

+ 类型：`string`
+ 默认值：`'https://www.gravatar.com/avatar/'`（官方API）
+ 对应Waline选项：`avatarCDN`

设置Gravatar头像的镜像服务地址，默认是官方地址，但在国内访问较慢，可以设置为Ve2x提供的CDN提升头像加载速度`https://cdn.v2ex.com/gravatar/`（注意末尾需要加上`/`）

### avatarNocache

+ 类型：`boolean`
+ 默认值：`false`
+ 对应Waline选项：`avatarForce`

是否不缓存头像，每次都重新加载头像图片

### avatarForce

+ 类型：`boolean`
+ 默认值：`false`

是否强制使用默认头像，无论评论者填写了邮箱

（默认头像可以由`avatarDefault`参数指定）

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

###  Waline登录

右键点击`评论`按钮可以打开登录窗口，如果登录后不能正常跳转，请勾选`记住登录状态`再试，登录成功后昵称、邮箱、网站输入框会隐藏，登录成功后发布的评论后面会带有`作者`的小标签字样（字样可配置）

点击你的头像可以进入管理界面，点击头像上方的x可以退出登录

如果进入管理页面提示`The requested URL '/ui/login' was not found on this server.`，代表token失效了，需要点击x退出后重新登录

### 获取文章评论数

DOM方式：

写一个`class`为`april-comment-count`的元素，元素内的文字会被替换成实际的评论数量

`pathname`属性决定了这个地方是要显示哪一个页面的评论数，如果没有写`pathname`属性的话，则默认使用`location.pathname`

同一个页面里可以有多个这样的元素，`span`、`div`均可

```html
<span class="april-comment-count" pathname="/">xx</span>条评论
```

---

编程方式：

```javascript
var comment = new AprilComment({
    el: 'comment-widget',
    api: 'https://your-waline-backend-url.app',
    pathname: location.pathname
})

var count: number = comment.count(location.pathname)
```
### 获取文章浏览次数

DOM方式：

写一个`class`为`april-comment-views`的元素，元素内的文字会被替换成实际的浏览次数

`pathname`属性决定了这个地方是要显示哪一个页面的浏览次数，如果没有写`pathname`属性的话，则默认使用`location.pathname`

同一个页面里可以有多个这样的元素，`span`、`div`均可

```html
<span class="april-comment-views" pathname="/">xx</span>次浏览
```

---

编程方式：

```js
var comment = new AprilComment({
    el: 'comment-widget',
    api: 'https://your-waline-backend-url.app',
    pathname: location.pathname
})

var count: number = comment.views(location.pathname)
```

### 给文章浏览次数+1

DOM方式：

写一个`class`为`april-comment-visit`的元素，AprilComment检测到以后会自动为此页面浏览次数+1，同时元素内的文字会也被替换成+1之后的浏览次数（相当于包括了获取文章评论数的功能）

`pathname`属性决定了是要给哪一个页面的浏览次数+1，如果没有写`pathname`属性的话，则默认使用`location.pathname`

同一个页面里不建议存在多个这样的元素，一般存在一个就好

```html
<span class="april-comment-visit" pathname="/">xx</span>次浏览
```

---

编程方式：

```js
var comment = new AprilComment({
    el: 'comment-widget',
    api: 'https://your-waline-backend-url.app',
    pathname: location.pathname
})

var count: number = comment.visit(location.pathname)
```

### 获取最新评论

目前时间有限，仅提供了编程API，最新评论的数据需要在拿到后自己渲染

```javascript
var comment = new AprilComment({
    el: 'comment-widget',
    api: 'https://your-waline-backend-url.app',
    pathname: location.pathname
})

var recentComments: object[] = comment.recent()
```

## 编程API

### 获取AprilComment版本

```js
AprilComment.version()
```

## 更新记录

