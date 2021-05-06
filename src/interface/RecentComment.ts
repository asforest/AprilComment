export default interface RecentComment
{
	/** 本条评论的唯一ID .e.g. 79550af2607b08e10f157bc62bbcb17c */
    objectId: string

	/** 此条评论对应的页面地址 e.g. / */
    url: string

	/** 评论内容 e.g. <p>fffsfsaf</p>\n */
    comment: string

	/** 评论时间 e.g. 2021-04-17T16:12:17.127Z */
    insertedAt: string

	/** 评论人的昵称 e.g. 四月浅森1 */
    nick: string

	/** 评论人的邮箱md5 e.g. 90751353e9a977c60f5a7d43e6cb0761 */
    mail: string

	/** 评论人的网站链接 e.g. https://baidu.com */
    link: string

	/** 浏览器版本. e.g. Chrome 89.0.4389.128 */
    browser: string

	/** 评论人的操作系统 e.g. Windows 10 */
    os: string

	/** 评论的审核状态 此字段永远是 approved */
    status: string
}