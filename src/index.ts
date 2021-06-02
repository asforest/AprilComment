import AprilCommentWidget from './widget/AprilComment.vue'
import CommentingModel from './interface/CommentingModel'
import MissingNecessaryFieldError from './exception/MissingNecessaryFieldError'
import AprilCommentOptions, { LanguageOptions } from './interface/AprilCommentOptions'
import { checkNecessaryOptions, useDefault } from './utils/Utils'
import SmilieManager from './smilie/SmilieManager'
import RecentComment from './interface/RecentComment'
import ServiceProvider from './serviceProvider/ServiceProvider'
import Waline from './serviceProvider/Waline'
import DomActions from './domRenderer/DomActions'
import Compatibility from './utils/Compatibility'
const $ = require('jquery')
const moment = require('moment');
require('moment/locale/zh-cn');

moment.locale('zh-cn')

var defaultOptions: AprilCommentOptions = {
    el: undefined as any,
    api: undefined as any,
    pathname: location.pathname,
    manualMode: false,
    authorMails: undefined,
    smilieEnabled: true,
    smilies: undefined,
    smilieAsUrl: false,
    avatarDefault: '',
    avatarSource: 'https://www.gravatar.com/avatar/',
    avatarNocache: false,
    avatarForce: false,
    capacity: 10,
    focusOnComment: true,
    paginatorLength: 3,
    dualPaginator: true,
    mailRequired: true,
    websiteRequired: true,
    language: {
        author: '作者',
        comment_tips: '说点儿什么吧',
        nick: '昵称',
        mail: '邮箱',
        website: '网站',
        no_comment: '还没有任何评论哦',
    } as LanguageOptions,
}

export default class AprilComment
{
    opt: AprilCommentOptions
    lang: LanguageOptions // shortcut for this.opt.language
    smilieManager: SmilieManager
    serviceProvider: ServiceProvider
    domActions: DomActions

    mainWidget: any = null // AprilCommentWidget
    editorWidget: any = null // CommentEditor
    profileWidget: any = null // Profile

    constructor(options: AprilCommentOptions)
    {
        if (!options)
            throw new MissingNecessaryFieldError('Options-Object')
        
        options = Compatibility(options)
        
        checkNecessaryOptions(['el', 'api'], options)

	    this.opt = useDefault(options, defaultOptions)
        this.lang = this.opt.language as LanguageOptions

        this.smilieManager = new SmilieManager()
        this.domActions = new DomActions(this)
        this.serviceProvider = new Waline(this)

        if(!this.opt.manualMode && document.querySelector('#'+this.opt.el) != null)
            this.mount()

        this.domActions.renderCommentCount().renderPageViews().recordVisit()
    }

    setOptions(optionsOverrode?: AprilCommentOptions)
    {
        if(typeof(optionsOverrode) == 'object')
            this.opt = useDefault(optionsOverrode, this.opt)
    }

    /**
     * 创建评论系统的DOM
     * 
     * @deprecated since 0.2.7. use mount() instead
     */
    async create()
    {
        this.mount()
    }

    /**
     * 创建评论系统的DOM
     */
     async mount()
     {
         this.mainWidget = new AprilCommentWidget({
             propsData: { owner: this }
         }).$mount('#'+this.opt.el)
 
         this.editorWidget = this.mainWidget.$refs.editor as Vue
         this.profileWidget = this.mainWidget.$refs.profile as Vue
         
         await this.refresh()
 
         if(typeof this.opt.smilies == 'object')
             this.smilieManager?.loadFromObject(this.opt.smilies as object)
         this.editorWidget.smiliesComponet.$forceUpdate()
         this.editorWidget.smiliesComponet.defaultSmilieSet()
         this.mainWidget.update()
 
         if(this.opt.focusOnComment)
             this.focusOnComment()
     }

    /**
     * 聚焦到目标评论上（仅当从通知邮件内的链接跳转过来时）
     */
    focusOnComment()
    {
        let hash = location.hash
        try {
            let commentDom = $(hash)
            if(commentDom.length > 0)
            {
                $('html, body').animate({
                    scrollTop: commentDom.offset().top
                }, 1000)
            }
        } catch(e) {
            console.warn('Comment could not be focused on: '+hash)
        }
        
    }

    /**
     * 销毁AprilComment的DOM
     */
    destroy()
    {
        if(this.mainWidget!=null)
        {
            this.mainWidget.$destroy()
            this.editorWidget = null
            this.mainWidget = null
        }
    }

    /**
     * 是否AprilComment的DOM已经被销毁了
     * @returns 是否销毁
     */
    isDestroyed()
    {
        return this.mainWidget == null
    }

    /** 
     * 刷新评论数据
     */
    async refresh()
    {
        return this.serviceProvider.refresh()
    }

    /** 
     * 提交评论
     */
    async submit(comment: CommentingModel)
    {
        return this.serviceProvider.submit(comment)
    }

    /** 
     * 获取最近评论
     */
    async recent(count=5): Promise<RecentComment[]>
    {
        return this.serviceProvider.recent(count)
    }

    /** 
     * 获取评论数量
     */
    async count(pathname: string): Promise<number>
    {
        return this.serviceProvider.count(pathname)
    }

    /** 
     * 获取浏览次数
     */
    async views(pathname: string): Promise<number>
    {
        return this.serviceProvider.views(pathname)
    }

    /** 
     * 给某个页面的阅读次数+1
     */
    async visit(pathname: string): Promise<number>
    {
        return this.serviceProvider.visit(pathname)
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
window.AprilComment = AprilComment