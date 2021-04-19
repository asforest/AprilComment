import AprilComment from ".."

const $ = require('jquery')

export default class DomActions 
{
	aprilComment: AprilComment

	constructor(aprilComment: AprilComment)
	{
		this.aprilComment = aprilComment
	}

	findDom(selector: string, pathnameAttr: string, handleCallback: (pathname: string, jqdom: any) => void)
	{
		var _this = this

		$(selector).each(function() {
			var pathname = $(this).attr(pathnameAttr)

			if(pathname != null) 
				handleCallback(pathname, $(this))
		})
	}

	renderCommentCount(selector='.april-comment-count', pathnameAttr='pathname')
	{
		this.findDom(selector, pathnameAttr, (pathname: string, jqdom: any) => {
			this.aprilComment.count(pathname.trim()).then(count => jqdom.text(count))
		})

		return this
	}

	renderPageViews(selector='.april-comment-views', pathnameAttr='pathname')
	{
		this.findDom(selector, pathnameAttr, (pathname: string, jqdom: any) => {
			this.aprilComment.views(pathname.trim()).then(views => jqdom.text(views))
		})

		return this
	}

	recordVisit(selector='.april-comment-visit', pathnameAttr='pathname')
	{
		this.findDom(selector, pathnameAttr, (pathname: string, jqdom: any) => {
			this.aprilComment.visit(pathname.trim()).then(views => jqdom.text(views))
		})

		return this
	}
}