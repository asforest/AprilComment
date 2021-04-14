import LanguageOptions from "./LanguageOptions";

export default interface AprilCommentOptions
{
    elementId: string
    api: string
    key?: string
    pageLabel?: string
    authorMail?: string
    smiliesUrl?: string
    smilieAsUrl?: boolean
    focusOnComment?: boolean
    language?: LanguageOptions
    paginatorLength?: number
    mailRequired?: boolean
    websiteRequired?: boolean
}