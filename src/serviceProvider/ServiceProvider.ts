import AprilComment from "..";
import CommentingModel from "../interface/CommentingModel";
import RecentComment from "../interface/RecentComment";

export default abstract class ServiceProvider 
{
    aprilComment: AprilComment

    constructor(aprilComment: AprilComment)
	{
	    this.aprilComment = aprilComment
	}

	/**
	 * 刷新评论数据
	 */
    abstract refresh(): Promise<void>

	/**
	 * 提交一条评论
	 * @param comment 评论数据
	 */
    abstract submit(comment: CommentingModel): Promise<void>

	/**
	 * 获取最新评论
	 * @param count 最大评论数
	 */
    abstract recent(count: number): Promise<RecentComment[]>

	/**
	 * 获取某个页面的评论数量
	 * @param pathname 页面的pathname或者url
	 */
    abstract count(pathname: string): Promise<number>

	/**
	 * 获取某个页面的阅读次数
	 * @param pathname 页面的pathname或者url
	 */
    abstract views(pathname: string): Promise<number>

	/**
	 * 给某个页面的阅读次数+1
	 * @param pathname 页面的pathname或者url
	 */
    abstract visit(pathname: string): Promise<number>

}