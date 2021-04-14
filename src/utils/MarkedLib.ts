const marked = require("marked");
const hanabi = require('hanabi');
const DOMPurify = require('dompurify');

// MD解析器
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: false ? null : hanabi,
    gfm: true,
    breaks: true,
    smartLists: true,
    xhtml: false
})

let dompOptions = {
    ALLOWED_TAGS: [
        'h1', 'h2', 'h3',
        'h4', 'h5', 'h6',
        'pre', 'code', 'span', 'hr',
        'ul', 'li', 'ol', 'br',
        'a', 'img', 'p', 
        'blockquote',
        'em','strong',
        'table', 'thead', 'tr', 'th', 'td', 'tbody'
    ]
}

// dompOptions = undefined

export default function (text: string) {
    return DOMPurify.sanitize(marked(text), dompOptions)
}