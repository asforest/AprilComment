import AprilComment from "../april-comment"
const $ = require('jquery')

export default class DomActions 
{
    aprilComment: AprilComment

    constructor(aprilComment: AprilComment)
	{
	    this.aprilComment = aprilComment
	}
	
    foreachDom(selector: string, callback: (pathname: string, expires: number, jq: any) => void)
	{
		let that = this
		$(selector).each(function() {
		    var pathname = $(this).attr('pathname') ?? location.pathname
			var expires = !isNaN(parseInt($(this).attr('expires')))? parseInt($(this).attr('expires')) : that.aprilComment.opt.visit_interval as number
			
		    callback(pathname, expires, $(this))
		})
	}

    renderCommentCount(selector='.april-comment-count')
	{
		this.foreachDom(selector, (pathname: string, expires: number, jq: any) => {
			this.aprilComment.count(pathname).then(count => jq.text(count))
		})
	    return this
	}

    renderPageViews(selector='.april-comment-views')
	{
		this.foreachDom(selector, (pathname: string, expires: number, jq: any) => {
			this.aprilComment.views(pathname).then(count => jq.text(count))
		})
	    return this
	}

    recordVisit(selector='.april-comment-visit')
	{
	    this.foreachDom(selector, (pathname: string, expires: number, jq: any) => {
			let expiresInSeconds = parseInt((new Date(Date.now() + expires * 1000).getTime() / 1000) as unknown as string)
			if(this.aprilComment.stateData.object.visitPage(pathname, expiresInSeconds))
			{
				this.aprilComment.visit(pathname).then(views => jq.text(views))
			} else {
				this.aprilComment.views(pathname).then(count => jq.text(count))
			}
		})

	    return this
	}
}