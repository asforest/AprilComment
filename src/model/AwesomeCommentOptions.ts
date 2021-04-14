import LanguageOptions from "./LanguageOptions";

export default interface AwesomeCommentOptions
{
    elementId: string
    authorMail?: string
    smiliesUrl?: string
    smilieAsUrl?: boolean
    api?: string
    key?: string
    pageLabel?: string
    language?: LanguageOptions
    paginatorLength?: number
    mailRequired?: boolean
    websiteRequired?: boolean
}