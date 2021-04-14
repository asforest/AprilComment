import AwesomeCommentOptions from "./model/AwesomeCommentOptions";
import LanguageOptions from "./model/LanguageOptions";

export default {
    key: location.pathname,
    api: 'http://127.0.0.1:600',
    pageLabel: document.querySelector('title').innerText,
    smilieAsUrl: true,
    language: {
        editorPlaceholder: '说点儿什么吧',
        nickPlaceholder: '昵称',
        mailPlaceholder: '邮箱',
        websitePlaceholder: '网站',
    } as LanguageOptions,
    paginatorLength: 3,
    mailRequired: true,
    websiteRequired: true,
} as AwesomeCommentOptions