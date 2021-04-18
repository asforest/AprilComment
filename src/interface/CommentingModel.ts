export default interface CommentingModel
{
    pathname?: string,
    nick: string,
    mail: string,
    website: string,
    content: string,
    parent?: string,
    root?: string,
    at?: string
}