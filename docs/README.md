# AprilComment

![npm](https://img.shields.io/npm/v/april-comment?logo=npm&style=flat-square)
![GithubTopLanguage](https://img.shields.io/github/languages/top/innc11/AprilComment?color=success&style=flat-square)
![GithubLastCommit](https://img.shields.io/github/last-commit/innc11/AprilComment?style=flat-square)

一个[Waline](https://github.com/lizheming/waline)评论系统的客户端实现，特点是简洁易用，兼容Waline客户端的大部分特性

## 使用

在使用AprilComment之前请确保已经安装好了Waline服务端并且可以正常访问和评论

1. 需要在`head`标签中引入js和css资源（如果需要使用特定版本，可以参考更新记录中的版本号）
2. 初始化`AprilComment`对象

```html
<head>
    <script src="https://cdn.jsdelivr.net/npm/april-comment@latest/dist/index.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/april-comment@latest/dist/index.css" />
</head>
<body>
    <div id="comment-widget"></div>
    <script>
        $(function() {
            new AprilComment({
                el: 'comment-widget',
                api: 'https://your-waline-backend-url.app'
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

### manualMode

+ 类型：`boolean`
+ 默认值：`false`

是否手动控制AprilComment的初始化和销毁（生命周期），大多数情况下建议设置为`false`

如果为`false`AprilComment会自动初始化并挂载DOM

如果为`true`则不会自动初始化，需要在合适的时机显式调用`mount()`和`destroy()`方法以手动控制AprilComment的初始化和销毁（通常适用于pjax或者spa场景）

### visit_interval

+ 类型：`number`
+ 默认值：`1800`

此选项可以控制用户在浏览一次页面后，经过多长时间后，会被视为新的访客（此功能仅支持以dom方式增加浏览量）

单位秒，默认30min，默认值1800

每个`pathname`共用一个间隔标记，如果`pathname`相同，会被视为同一个页面

### authorMails

+ 类型：`string[]`
+ 默认值：`undefined`

作者的邮箱(md5格式)列表，对应的评论下面会显示一个"作者"的小标签，支持多个邮箱

>  注意：为安全起见，建议使用Waline自带的登录功能（参考下方），而不建议使用本功能，如果你的邮箱被别人知道了，别人同样是可以假扮你进行回复的，此功能仅做测试作用

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

+ 类型：`array`
+ 默认值：`undefined`
+ 对应Waline选项：`emoji`

加载自定义表情的选项。

除了可以使用AprilComment自己的加载方式以外，同时还兼容Waline标准的表情包格式。

具体用法请参考[#使用表情包](#使用表情包)

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

设置Gravatar头像的镜像服务地址，默认是官方地址，但在国内访问较慢，可以设置为Loli提供的CDN提升头像加载国内加载速度`https://gravatar.loli.net/avatar/`（注意末尾需要加上`/`）

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

注意：此功能与hash路由冲突，history路由不受影响

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

### standaloneLoginButton

+ 类型：`boolean`
+ 默认值：`true`

是否显示独立的登录按钮

如果为`true`，则会在按钮区显示一个按钮用于Waline登录

如果为`false`，则使用右键点击`评论`按钮登录

### language

+ 类型：`object`

各种语言文本

+ `author`：作者小标签里面显示的文字
+ `comment_tips`：评论框的占位符
+ `nick`：昵称输入框的占位符
+ `mail`：邮箱输入框的占位符
+ `website`：网站链接输入框的占位符
+ `no_comment`：没有评论时显示的文字

```js
<script>
    $(function() {
    new AprilComment({
        el: 'comment-widget',
        api: 'https://your-waline-backend-url.app',
        pathname: location.pathname,
        language: {
            author: '开发者',
            comment_tips: '说点儿什么吧，留下邮箱可以收到回复提醒',
            nick: '昵称',
            mail: '邮箱',
            website: '网站',
            no_comment: '还没有任何评论哦'
        }
    })
})
</script>
```

只替换一部分占位符也是可以的

```html
<script>
    new AprilComment({
        language: {
            comment_tips: '说点儿什么吧，留下邮箱可以收到回复提醒'
        }
    })
</script>
```

## 高级用法

### 使用表情包

AprilComment支持使用自定义表情包。

> 需要注意的是，每个表情的表情代码取决于文件名本身，请确保每个表情图片的文件名中没有空格（有的话请用_下划线替换），同时确保不同表情包之间也不要出现图片的文件名相同冲突的情况

#### 创建自定义表情包

1. 将所有表情文件放到同一个文件夹内
2. 在这个文件夹里创建名为`meta.yml`的文件，并把下面的代码复制粘贴进去

```yaml
# 表情包的名字，这个会显示在表情框的顶部选项卡里
name: maomao

# 表情包的封面图片，会显示在表情包的名字的左侧（这里同Waline的icon选项）
# 这个文件只能从下面的smilies中选择一个
cover: mao_001.gif

# 所有的表情包文件
smilies:
  - mao_001.gif
  - mao_002.jpg
  - mao_003.png
  - mao_004.gif
```

3. 将所有表情文件的文件名 一 一 列举在`smilies`选项下面，并设置好表情包的名字和封面
4. 保存关闭这个`yml`文件，然后将这个目录上传到自己的Github仓库上或者其它服务器上
5. 最后将这个目录的URL（也就是`meta.yml`的父目录的URL）填写到`smilies`配置项里，表情包就会被加载啦

#### 使用表情包

比如我将这些文件上传到我的Github仓库`biaoqingbao`里：

```
https://github.com/innc11/biaoqingbao/maomao/
├─ mao_001.gif
├─ mao_002.jpg
├─ mao_003.png
├─ mao_004.gif
└─ meta.yml
```

`meta.yml`的内容：

```yaml
name: maomao
cover: mao_001.gif
smilies:
  - mao_001.gif
  - mao_002.jpg
  - mao_003.png
  - mao_004.gif
```

之后，在AprilComment初始化时这样写，就可以读取并使用这些表情啦：

```javascript
new AprilComment({
    el: 'comment-widget',
    api: 'https://your-waline-backend-url.app',
    smilies: [
        // 这里可以加载多个表情包，这里使用了maomao表情包和qq表情包
        'https://cdn.jsdelivr.net/gh/innc11/biaoqingbao@latest/maomao',
        'https://cdn.jsdelivr.net/gh/innc11/biaoqingbao@latest/qq'
        // 这里加载的先后顺序也决定了表情包的排列顺序
    ]
})

```

#### 兼容Waline表情包

除了可以使用AprilComment的表情包格式外，同时还支持直接使用Waline标准的表情包格式，无需做任何改动，就可以直接使用啦。

使用方式也特别简单，在初始化时，将Waline表情包的预设链接填写到`smilies`里就可以啦（和AprilComment格式的表情包写法完全一致，并且两种表情包可以混合使用！）

比如

```javascript
new AprilComment({
    el: 'comment-widget',
    api: 'https://your-waline-backend-url.app',
    smilies: [
        // 这里先加载了waline官方提供的 bilibili表情包（Waline格式表情包）
        'https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/bilibili',
        // 随后又加载了自定义的表情包（AprilComment格式表情包）
        'https://cdn.jsdelivr.net/gh/innc11/biaoqingbao@latest/maomao'
        // 这里加载的先后顺序也决定了表情包的排列顺序
    ]
})

```

有关Waline表情包的更多信息和教程，可以参考[(自定义表情 | Waline)](https://waline.js.org/guide/client/emoji.html)

###  Waline登录

右键点击`评论`按钮可以打开登录窗口，如果登录后不能正常跳转，请勾选`记住登录状态`再试，登录成功后昵称、邮箱、网站输入框会隐藏，登录成功后发布的评论后面会带有`作者`的小标签字样（字样可配置）

点击你的头像可以进入管理界面，点击头像上方的x可以退出登录

如果进入管理页面提示`The requested URL '/ui/login' was not found on this server.`，或者`invalid signature`代表token失效了，需要点击x退出后重新登录

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

`expires`属性决定了这次浏览后，经过多长时间再次浏览，用户会被视为新访客，如果没有写`expires`属性的话，默认是1800s

每个`pathname`共用一个间隔标记，如果`pathname`相同，会被视为同一个页面

同一个页面里不建议存在多个这样的元素，一般存在一个就好

```html
<span class="april-comment-visit" pathname="/" expires="1800">xx</span>次浏览
```

---

编程方式：

编程方式不支持自动设置新访客判断，需要自行处理相关情况

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

### 手动初始化和销毁

在一些PJAX或者SPA(单页应用)场景中，切换页面时页面可能并不会重新加载，可能就会出现页面已经加载成新页面了，但是评论系统还没有跟过来的问题，这时就需要自己手动控制初始化和销毁了。

只需要在初始化时设置`manualMode: true`，然后在pjax回调函数或者对应的渲染回调函数中销毁AprilComment，然后更新`pathname`参数后再次重新初始化即可

```javascript
var ac = new AprilComment({
    el: 'comment-widget',
    api: 'https://aprilcomment-demo-bp92yy3n5-innc11.vercel.app',
});

function cb_after_rendering() // 每次切换页面时会被调用一次
{
    // 通常需要更新pathname以加载新页面对应的评论
    ac.update({ pathname: location.pathname })
}
```

## API

### version()

+ 参数：`无`

+ 返回值：`string`

`静态方法`，用于返回AprilComment的版本

```js
AprilComment.version()
```

### isProduction()

+ 参数：`无`

+ 返回值：`boolean`

`静态方法`，用于返回AprilComment当前是否工作在生产模式下

```js
AprilComment.isProduction()
```

### setOptions(optionsOverrode)

+ 参数1：`optionsOverrode?: AprilCommentOptions`，新的参数对象
+ 返回值：`无`

用于更新一些参数的值，此方法的参数和初始化AprilComment时传入的参数类型一致，也可以只更新部分参数，传入的参数会以`深拷贝`的方式合并到当前options中

```js
var ac = new AprilComment({
    el: 'comment-widget',
    api: 'https://aprilcomment-demo-bp92yy3n5-innc11.vercel.app',
    manualMode: true,
    focusOnComment: false
});

ac.setOptions({
    focusOnComment: true // 关闭自动聚焦到评论上的功能
})
```

### focusOnComment()

+ 参数：`无`
+ 返回值：`void`

聚焦到目标评论上（仅当从通知邮件内的链接跳转过来时）

原理是根据hash进行滚动到对应的DOM位置上，如果hash为空或者找不到对应的评论dom，此方法不会有任何效果

### mount()

+ 参数：`无`
+ 返回值：`Promise<void>`

控制AprilComment的初始化操作并挂载DOM，需要在合适的时机调用

### destroy()

+ 参数：`无`
+ 返回值：`void`

控制AprilComment的销毁操作并卸载DOM，需要在合适的时机调用

### update()

+ 参数：`optionsOverrode?: AprilCommentOptions`：重载的选项，相当于间接调用了`setOptions()`
+ 返回值：`void`

当由于页面切换导致评论系统的DOM被销毁时，请手动调用`update()`销毁DOM并重新创建以刷新评论（一般用在SPA场景中）

此方法和`manualMode`选项能够相互兼容（无论`manualMode`是什么值都能正常工作）

示例：

```javascript
var ac = new AprilComment({
    el: 'comment-widget',
    api: 'https://aprilcomment-demo-bp92yy3n5-innc11.vercel.app',
});

function cb_after_rendering() // 每次切换页面时会被调用一次
{
    // 通常需要更新pathname以加载新页面对应的评论
    ac.update({ pathname: location.pathname })
}
```

### isDestroyed()

+ 参数：`无`
+ 返回值：`boolean`

返回AprilComment是否已经被销毁了，未初始化之前也被视为是销毁状态

### refresh()

+ 参数：`无`
+ 返回值：`Promise<void>`

刷新/重新加载评论列表

### submit(comment)

+ 参数1：`comment: CommentingModel`，包括了准备发布的评论的一些信息
+ 返回值：`Promise<void>`

发布/提交一条评论

### recent(count=5)

+ 参数1：`count=5`，最多返回多少条评论，默认值`5`
+ 返回值：`Promise<RecentComment[]>`

获取最近/最新的5条评论，此方法只返回原始对象，需要自己进行渲染

### count(pathname)

+ 参数1：`pathname: string`，需要被返回的页面的`pathname`，或者说`url`
+ 返回值：`Promise<number>`

获取指定页面的评论数量

### views(pathname)

+ 参数1：`pathname: string`，需要被返回的页面的`pathname`，或者说`url`
+ 返回值：`Promise<number>`

获取指定页面的浏览次数

### visit(pathname)

+ 参数1：`pathname: string`，需要被+1和返回浏览次数的页面的`pathname`，或者说`url`
+ 返回值：`Promise<number>`

为指定页面的浏览次数+1，并获取指定页面的浏览次数