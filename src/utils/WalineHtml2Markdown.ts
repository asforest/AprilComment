import cheerio from "cheerio";
import { sanitize } from "./Utils";
const katex = require('katex')
const html2md = require('html-to-md')
require('katex/dist/katex.css')

export default function(walineHtml: string)
{
    // 去除前后p标签
    walineHtml = walineHtml.trim().replace(new RegExp("^<p>"), '').replace(new RegExp("</p>$"), '')

    // 提取出原始评论数据（去除html标签）
    // third argument to disable the present of <html>, <head> and <body>
    let $ = cheerio.load(walineHtml, null, false)

    // 移除p元素
    // if($('p').length == 1)
    //     $ = cheerio.load($('p').html() as string, null, false)

    // 移除At字样
    if($('a.at[href]').length > 0)
    {
        $('a.at[href]').remove()
        $ = cheerio.load($.html().replace(new RegExp("^ +, +"), ''), null, false)
    }

    // 还原数学公式
    $('span.katex').each((i, e) => {
        let rawFormula = $(e).find('math semantics annotation').text()
        $(e).replaceWith('\n$$'+rawFormula+'$$\n')
    })

    // 还原换行/净化标签
    let htmlText = $.html().replace(new RegExp("(<br>|<br/>|<br />)", 'g'), '\n')
    let htmlmd = html2md(sanitize(htmlText))

    // 重新渲染数学公式
    let reg = /\$?\$([^$]+)\$\$?/
    let matches = reg.exec(htmlmd)
    let maxTimes = 1000
    while(matches != null)
    {
        let matchedText = matches[0]
		let position = matches['index']

        let countof$ = matchedText.startsWith('$$')? 2:1
        let formulaText = matchedText.substring(countof$, matchedText.length-countof$)
        let formulaHtml = katex.renderToString(formulaText, {
            throwOnError: false,
            displayMode: true,
            // output: 'mathml',
        })

        let before = htmlmd.substr(0, position)
        let after = htmlmd.substring(position + matchedText.length)
        htmlmd = before + formulaHtml + after

        if(maxTimes--<=0)
            throw 'max times reached'
        
        matches = reg.exec(htmlmd)
    }

    return htmlmd
}