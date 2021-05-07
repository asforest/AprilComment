
export default interface CommentModel
{
    id: string
    parentId?: string
    rootId?: string
    avatar: string
    nick: string
    website: string
    isauthor: boolean
    browser: string
    os: string
    time: number
    content: string
    replies: CommentModel[]
}