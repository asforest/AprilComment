import Vue from 'vue'
import AwesomeCommentWidget from './AwesomeComment.vue'
import CommentingModel from './model/CommentingModel'
import CommentModel from './model/CommentModel'
import MissingNecessaryFieldError from './exception/MissingNecessaryFieldError'
import IsServerSideError from './exception/IsServerSideError'
import ServerSideException from './exception/ServerSideException'
import AwesomeCommentOptions from './model/AwesomeCommentOptions'
import { useDefault } from './utils/Utils'
import defaultOptions from './DefaultOptions'
import UnknownException from './exception/UnknownException'
import DOMPurify = require('dompurify')
import cheerio = require('cheerio')
const $ = require('jquery')
const cookies = require('brownies')
const uaparser = require('ua-parser-js');
const moment = require('moment');
require('moment/locale/zh-cn');

moment.locale('zh-cn')

export default class AwesomeComment
{
    opt: AwesomeCommentOptions

    index: any|Vue // Vue组件实例
    editor: any|Vue // Vue组件实例
    
    constructor(config: AwesomeCommentOptions)
    {
        if (!config)
            throw new MissingNecessaryFieldError('setting-parameter-object')
        
        if (!config.elementId)
            throw new MissingNecessaryFieldError('elementId')

	    this.opt = useDefault(config, defaultOptions)
        this.opt.elementId = config.elementId
    }

    async create(config?: AwesomeCommentOptions)
    {
        if(typeof(config) == 'object')
            this.opt = useDefault(config, this.opt)

        this.index = new AwesomeCommentWidget({
            el: '#'+this.opt.elementId,
            propsData: {
                owner: this
            }
        })
        // this.index.owner = this

        this.editor = this.lookupVueComponent('comment-editor')

        for (let component of this.lookupVueComponents('paginator'))
            component.owner = this

        this.loadCookies()
        
        await this.refresh()

        await this.smilies()

        this.jumpToComment()
    }

    jumpToComment()
    {
        let hash = location.hash
        if(hash.startsWith('#ac-comment-object-id-'))
        {
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 1000)
        }
    }

    destroy()
    {
        this.editor.$destroy()
        this.index.$destroy()
        this.editor = null
        this.index = null
    }

    isDestroyed()
    {
        return this.index == null
    }

    lookupVueComponent(componentName: string)
    {
        let result = this.lookupVueComponents(componentName)
        return result.length>0? result[0]:null
    }

    lookupVueComponents(componentName: string)
    {
        let result = []
        for (let index in this.index.$children)
        {
            if (this.index.$children[index].$vnode.tag.replace(new RegExp('vue-component-\\d+-'), '') == componentName)
                result.push(this.index.$children[index])
        }
        return result
    }

    checkServerSide(): void
    {
        if (typeof document === 'undefined')
        {
            throw new IsServerSideError()
        }
    }

    loadCookies()
    {
        if (cookies.cookies.va_nick)
            this.editor.formData.nick = cookies.cookies.va_nick
        else if (cookies.cookies.ac_nick)
            this.editor.formData.nick = cookies.cookies.ac_nick

        if (cookies.cookies.va_mail)
            this.editor.formData.mail = cookies.cookies.va_mail
        else if (cookies.cookies.ac_mail)
            this.editor.formData.mail = cookies.cookies.ac_mail

        if (cookies.cookies.va_website)
            this.editor.formData.website = cookies.cookies.va_website
        else if (cookies.cookies.ac_website)
            this.editor.formData.website = cookies.cookies.ac_website
    }

    storageCookies()
    {
        cookies.cookies.ac_nick = this.editor.formData.nick
        cookies.cookies.ac_mail = this.editor.formData.mail
        cookies.cookies.ac_website = this.editor.formData.website
    }

    async fetch2(input: RequestInfo, init?: RequestInit): Promise<any>
    {
        if(typeof(init)=='undefined')
            init = {}
            
        let defaultOptions = {
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
        } as any

        // 加载默认参数
        let _init = init as any
        for (const obj in defaultOptions)
            if(!_init[obj])
                _init[obj] = defaultOptions[obj]
        
        if(init.headers)
            (init.headers as any)['Content-Type'] = 'application/json'
            else
            init.headers = {
                'Content-Type': 'application/json'
            }

        let response = await fetch(input, init)

        if(!response.ok)
            throw new UnknownException(await response.text())

        let raw = await response.text()

        try {
            return JSON.parse(raw)
        } catch (e) {
            if(e instanceof SyntaxError)
                return raw
            return null;
        }
    }

    // 获取评论
    async refresh()
    {
        // 打开加载动画s
        this.index.isLoading = true

        let url = this.opt.api + '/comment?'
        url += 'path=' + this.opt.key + '&'
        url += 'pageSize=10&'
        url += 'page=' + (this.index.pagination_current + 1)

        try {
            let json = await this.fetch2(url, {
                method: 'GET'
            })

            let sortfun = function(obj1: any, obj2: any) {
                if(obj1.time > obj2.time) return 1
                if(obj1.time < obj2.time) return -1
                return 0
            }
    
            let parseData = (comments: any[]) =>
            {
                let allcomments = [] as Array<CommentModel>
    
                for (let comment of comments)
                {
                    let che = cheerio.load(comment.comment) as any
                    che('p a').remove()
                    let content = DOMPurify.sanitize(che.text(''), {ALLOWED_TAGS: [], KEEP_CONTENT: false})
                    if(content.startsWith(' , '))
                        content = content.substr(2)

                    allcomments.push({
                        id: comment.objectId,
                        parentId: comment.pid || '',
                        rootId: comment.rid || '',
                        avatar: 'https://www.gravatar.com/avatar/'+comment.mail+'&f=y',
                        nick: comment.nick,
                        website: comment.link,
                        isauthor: comment.mail==this.opt.authorMail || ('type' in comment && comment['type']=='administrator'),
                        authorlabel: '作者',
                        browser: comment.browser,
                        os: comment.os,
                        time: moment(comment.insertedAt).unix(),
                        content: content,
                        replies: 'children' in comment? parseData(comment.children.slice(0).sort(sortfun)):[]
                    } as CommentModel)
                }
    
                return allcomments as CommentModel[]
            }
    
            // 加载(并显示)评论数据
            this.index.allComments = parseData(json.data)
    
            // 加载分页数据
            this.index.pagination_total = json.totalPages
    
            // 设置评论数量
            this.index.commentCount = json.count
        } catch(e) {
            if(e.name == 'ServerSideException')
            {
                this.editor.showAlert('评论获取失败<br/>原因：'+e.message)
            } else if(e.name == 'TypeError' && e.message == 'Failed to fetch') {
                this.editor.showAlert('评论获取失败<br/>原因：网络连接失败或者协议问题无法与服务端通信<br/>'+e.message)
            } else {
                this.editor.showAlert('评论获取失败<br/>原因：发生了未知错误<br/>'+e.message)
            }

            this.editor.alertMessage.button2 = '尝试重试加载评论列表'
            this.editor.alertMessage.cb_button2 = () => setTimeout(() => this.refresh(), 300)
            
            this.index.isLoading = false

            throw e
        }

        // 隐藏加载动画
        this.index.isLoading = false
    }

    // 提交评论
    async submit(comment: CommentingModel)
    {
        comment.parent = this.index.replyId == -1? undefined:this.index.replyId
        comment.root = this.index.replyRootId == -1? undefined:(this.index.replyRootId==''? comment.parent:this.index.replyRootId)
        comment.at = this.index.replyNick == -1? undefined:this.index.replyNick
        comment.key = this.opt.key

        let url = this.opt.api+'/comment'

        try {
            await this.fetch2(url, {
                method: 'POST',
                body: JSON.stringify({
                    comment: comment.content,
                    link: comment.website,
                    mail: comment.mail,
                    nick: comment.nick,
                    pid: comment.parent,
                    rid: comment.root,
                    ua: navigator.userAgent || '',
                    url: comment.key,
                    at: comment.at
                }),
            })

            this.editor.formData.content = ''
            this.editor.$emit('cancel-reply')
            this.storageCookies()
            await this.refresh() // 刷新评论
        } catch(e) {
            if(e.name == 'ServerSideException')
            {
                this.editor.showAlert('评论提交失败<br/>原因：'+e.message)
            } else if(e.name == 'TypeError' && e.message == 'Failed to fetch') {
                this.editor.showAlert('评论提交失败<br/>原因：网络连接失败或者协议问题无法与服务端通信<br/>'+e.message)
            } else {
                this.editor.showAlert('评论提交失败<br/>原因：发生了未知错误<br/>'+e.message)
            }

            this.editor.alertMessage.button2 = '尝试重试提交评论'
            this.editor.alertMessage.cb_button2 = () => setTimeout(() => this.submit(comment), 300)

            throw e
        }
    }

    // 获取表情
    async smilies()
    {
        if(!('smiliesUrl' in this.opt))
            return

        try {
            let res = await this.fetch2(this.opt.smiliesUrl, { method: 'GET' })
            let baseurl = res.url

            for (const key in res) 
            {
                if(key == 'url')
                    continue
                
                let smilieSet = key
                this.editor.smiliesComponet.smilies[smilieSet] = {}

                for (const filename of res[smilieSet])
                {
                    let url = baseurl+'/'+smilieSet+'/'+filename
                    this.editor.smiliesComponet.smilies[smilieSet][filename] = url
                }
            }

            this.editor.smiliesComponet.$forceUpdate()
            this.editor.smiliesComponet.defaultSmilieSet()
            this.index.update()
        } catch(e) {
            if(e.name == 'ServerSideException')
            {
                this.editor.showAlert('表情获取失败<br/>原因：'+e.message)
            } else if(e.name == 'TypeError' && e.message == 'Failed to fetch') {
                this.editor.showAlert('表情获取失败<br/>原因：网络连接失败或者协议问题无法与服务端通信<br/>'+e.message)
            } else {
                this.editor.showAlert('表情获取失败<br/>原因：发生了未知错误<br/>'+e.message)
            }

            this.editor.alertMessage.button2 = '尝试重试加载表情'
            this.editor.alertMessage.cb_button2 = () => setTimeout(() => this.smilies(), 300)

            throw e
        }
    }

    static version()
    {
        return require('../package.json').version;
    }

    static isProduction()
    {
        return process.env.NODE_ENV === 'production'
    }
}

// 暴露到全局变量
window.AwesomeComment = AwesomeComment