import cheerio from "cheerio";
const html2md = require('html-to-md')

export default function(walineHtml: string)
{
    // 提取出原始评论数据（去除html标签）
    // third argument to disable the present of <html>, <head> and <body>
    let $ = cheerio.load(walineHtml, null, false)

    // 移除p元素
    if($('p').length == 1)
        $ = cheerio.load($('p').html() as string, null, false)

    // 移除At字样
    if($('a.at').length > 0)
    {
        $('a.at').remove()

        let text = $.html().replace(new RegExp("^ +, +"), '')
        $ = cheerio.load(text, null, false)
    }

    // 还原数学公式
    $('span.katex').each((i, e) => {
        let rawFormula = $(e).find('math semantics annotation').text()
        $(e).replaceWith('\n$$'+rawFormula+'$$\n')
    })

    // 还原换行
    let htmlText = $.html().replace(new RegExp("(<br>|<br/>|<br />)", 'g'), '\n')
    let htmlmd = html2md(htmlText)

    console.log('------', htmlmd)

    return htmlmd
}