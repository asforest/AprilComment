export default class SmilieManager
{
    smilies:any = {}

    addSmilie(smilieSetBelongsTo: string, filename: string, url: string)
	{
		// 初始化
	    if(!(smilieSetBelongsTo in this.smilies))
		    this.smilies[smilieSetBelongsTo] = {}
		
	    this.smilies[smilieSetBelongsTo][filename] = url
	}

    getTranslation()
	{
	    let trans: any = {}

	    for(let setname in this.smilies)
        {
		    let set = this.smilies[setname]

		    for(let code in set)
			{
			    let url = set[code]
			    trans[code] = url
			}
        }

        return trans
	}

    renderAsHtml(text: string)
	{
	    let trans = this.getTranslation()
	    for(let code in trans)
		{
		    let url = trans[code]
		    let el = '<img class="ac-smilie" src="'+url+'" alt="'+code+'" />';
		    text = text.replace(':'+code+':', el)
		}

        return text
	}

    renderAsMarkdown(content: string)
    {
        let trans = this.getTranslation()
	    for(let code in trans)
		{
		    let url = trans[code]
		    let el = '!['+code+']('+url+')'
		    content = content.replace(':'+code+':', el)
        }

        return content
    }

    loadFromObject(obj: object)
	{
	    let res = obj as any
	    let baseurl = res.url

	    for (const key in res) 
		{
		    if(key == 'url')
			    continue
			
		    let smilieSet = key

		    for (const filename of res[smilieSet])
			{
			    let url = baseurl+'/'+smilieSet+'/'+filename
			    this.addSmilie(smilieSet, filename, url)
			}
		}
	}

}