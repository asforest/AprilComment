const marked = require("marked");
const hanabi = require('hanabi');

// MD解析器
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: false ? null : hanabi,
    gfm: true,
    breaks: true,
    smartLists: true,
    xhtml: false
})

export default function (text: string)
{
    return marked(text)
}