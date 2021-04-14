
export default interface CommentingModel
{
    key?: string,
    nick: string,
    mail: string,
    website: string,
    content: string,
    parent?: string,
    root?: string,
    at?: string
}