import moment from "moment";
import CommentingModel from "../interface/CommentingModel";
import CommentModel from "../interface/CommentModel";
import RecentComment from "../interface/RecentComment";
import { getAvatarByMail, useDefault } from "../utils/Utils";
import ServiceProvider from "./ServiceProvider";
import jq from 'jquery'
import LoginInfo from "../interface/LoginInfo";

export default class Waline extends ServiceProvider
{
    async refresh(): Promise<void> 
    {
        let opt = this.aprilComment.opt
        let mainWidget = this.aprilComment.mainWidget
        let editorWidget = mainWidget.$refs.editor

        // 打开加载动画s
        mainWidget.isLoading = true

        let url = opt.api + '/comment?'
        url += 'path=' + opt.pathname + '&'
        url += 'pageSize=' + opt.capacity + '&'
        url += 'page=' + (mainWidget.pagination_current + 1)

        try {
            let sortByTime = function(obj1: any, obj2: any) {
                if(obj1.time > obj2.time) return 1
                if(obj1.time < obj2.time) return -1
                return 0
            }
    
            let parseData = (comments: any[]) => {
                let allcomments = [] as Array<CommentModel>
    
                for (let comment of comments)
                {
                    let isAuthorMail = typeof opt.authorMails == 'object' && opt.authorMails.indexOf(comment.mail) != -1
                    isAuthorMail = isAuthorMail || 'type' in comment && comment['type']=='administrator'

                    let replies = 'children' in comment? parseData(comment.children.slice(0).sort(sortByTime)):[]

                    allcomments.push({
                        id:           comment.objectId,
                        parentId:     comment.pid || '',
                        rootId:       comment.rid || '',
                        avatar:       getAvatarByMail(opt, comment.mail),
                        nick:         comment.nick,
                        website:      comment.link,
                        isauthor:     isAuthorMail,
                        browser:      comment.browser,
                        os:           comment.os,
                        time:         moment(comment.insertedAt).unix(),
                        content:      this.commentPrettify(comment.comment),
                        replies:      replies
                    } as CommentModel)
                }
    
                return allcomments as CommentModel[]
            }

            let json = await this.fetch2(url, { method: 'GET' })
    
            // 加载(并显示)评论数据
            mainWidget.allComments = parseData(json.data)
    
            // 加载分页数据
            mainWidget.pagination_total = json.totalPages
    
            // 设置评论数量
            mainWidget.commentCount = json.count
        } catch(e) {
            if(e.name == 'TypeError' && e.message == 'Failed to fetch') {
                editorWidget.showAlert('评论获取失败<br/>原因：网络连接失败或者协议问题无法与服务端通信<br/>'+e.message)
            } else {
                editorWidget.showAlert('评论获取失败<br/>原因：发生了未知错误<br/>'+e.message)
            }

            editorWidget.alertMessage.button2 = '尝试重试加载评论列表'
            editorWidget.alertMessage.cb_button2 = () => setTimeout(() => this.refresh(), 300)
            
            throw e
        } finally {
            // 隐藏加载动画
            mainWidget.isLoading = false
        }
    }

    async submit(comment: CommentingModel): Promise<void> 
    {
        let opt = this.aprilComment.opt
        let mainWidget = this.aprilComment.mainWidget
        let editorWidget = mainWidget.$refs.editor
        let smilieManager = this.aprilComment.smilieManager

        comment.parent = mainWidget.replyId == -1? undefined:mainWidget.replyId
        comment.root = mainWidget.replyRootId == -1? undefined:(mainWidget.replyRootId==''? comment.parent:mainWidget.replyRootId)
        comment.at = mainWidget.replyNick == -1? undefined:mainWidget.replyNick
        comment.pathname = opt.pathname

        let url = opt.api+'/comment'
        
        // 按不同的方式保存表情图片
        let content = comment.content
        if(opt.smilieAsUrl)
            content = smilieManager?.renderAsMarkdown(content) as string

        try {
            let logininfo = this.aprilComment.profileWidget.userinfo as LoginInfo
            let token = logininfo.token
            
            let params = {
                method: 'POST',
                body: JSON.stringify({
                    comment: content,
                    link: comment.website,
                    mail: token? logininfo.email :comment.mail,
                    nick: token? logininfo.display_name :comment.nick,
                    pid: comment.parent,
                    rid: comment.root,
                    ua: navigator.userAgent ?? '',
                    url: comment.pathname,
                    at: comment.at
                }),
            }

            if(token)
                (params as any).headers = {Authorization: `Bearer ${token}`}

            await this.fetch2(url, params)

            editorWidget.formData_content = ''
            editorWidget.$emit('cancel-reply')
            await this.refresh() // 刷新评论
        } catch(e) {
            if(e.name == 'TypeError' && e.message == 'Failed to fetch') {
                editorWidget.showAlert('评论提交失败<br/>原因：网络连接失败或者协议问题无法与服务端通信<br/>'+e.message)
            } else {
                editorWidget.showAlert('评论提交失败<br/>原因：发生了未知错误<br/>'+e.message)
            }

            editorWidget.alertMessage.button2 = '尝试重试提交评论'
            editorWidget.alertMessage.cb_button2 = () => setTimeout(() => this.submit(comment), 300)

            throw e
        }
    }

    async recent(count: number): Promise<RecentComment[]> 
    {
        let url = this.aprilComment.opt.api + '/comment?type=recent&count=' + count
        
        try {
            return await this.fetch2(url, { method: 'GET' })
        } catch(e) {
            if(e.name == 'TypeError' && e.message == 'Failed to fetch') {
                console.log('获取最新评论失败<br/>原因：网络连接失败或者协议问题无法与服务端通信<br/>'+e.message)
            } else {
                console.log('获取最新评论失败<br/>原因：发生了未知错误<br/>'+e.message)
            }

            throw e
        }
    }

    async count(pathname: string): Promise<number> 
    {
        let url = this.aprilComment.opt.api + '/comment?type=count&url=' + encodeURIComponent(pathname)

        try {
            return await this.fetch2(url, { method: 'GET' })
        } catch(e) {
            if(e.name == 'TypeError' && e.message == 'Failed to fetch') {
                console.log('获取评论数量失败<br/>原因：网络连接失败或者协议问题无法与服务端通信<br/>'+e.message)
            } else {
                console.log('获取评论数量失败<br/>原因：发生了未知错误<br/>'+e.message)
            }

            throw e
        }
    }

    async views(pathname: string): Promise<number> 
    {
        let url = this.aprilComment.opt.api + '/article?path=' + encodeURIComponent(pathname)

        try {
            return await this.fetch2(url, { method: 'GET' })
        } catch(e) {
            if(e.name == 'TypeError' && e.message == 'Failed to fetch') {
                console.log('获取浏览数量失败<br/>原因：网络连接失败或者协议问题无法与服务端通信<br/>'+e.message)
            } else {
                console.log('获取浏览数量失败<br/>原因：发生了未知错误<br/>'+e.message)
            }

            throw e
        }
    }
    
    async visit(pathname: string): Promise<number> 
    {
        let url = this.aprilComment.opt.api + '/article'

        try {
            return await this.fetch2(url, { method: 'POST', body: JSON.stringify({path: pathname}) })
        } catch(e) {
            if(e.name == 'TypeError' && e.message == 'Failed to fetch') {
                console.log('浏览失败<br/>原因：网络连接失败或者协议问题无法与服务端通信<br/>'+e.message)
            } else {
                console.log('浏览失败<br/>原因：发生了未知错误<br/>'+e.message)
            }

            throw e
        }
    }

    async fetch2(input: RequestInfo, init?: RequestInit): Promise<any>
    {
        init = init || {}

        init = useDefault(init, {
            mode: 'cors',
            cache: 'no-cache',
            // credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        } as RequestInit)

        let response = await fetch(input, init)

        if(!response.ok)
            throw new Error(await response.text())

        let raw = await response.text()

            let temp = JSON.parse(raw)

            if(temp.errno && temp.errno!=0)
                throw new Error(temp.errmsg)

            return temp

    }

    commentPrettify(walineHtml: string)
    {
        let $ = jq('<div>'+walineHtml+'</div>')
    
        // 移除At字样
        let at = $.children('p').children('a.at[href]')
        if(at.length > 0)
        {
            let p = at.parent()
            p.html(p.html().replace(at[0].outerHTML + ' , ', ''))
        }
    
        return $.html()
    }
}