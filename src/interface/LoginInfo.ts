export default interface LoginInfo
{
    display_name: string
    email: string
    mailMd5: string
    objectId: string
    remember: boolean
    token: string
    type: string // "administrator"
    url: string
}