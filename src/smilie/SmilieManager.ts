import { FetchException } from "../exception/FetchException"
import { JsonParseException } from "../exception/JsonParseException"
import { YamlParseException } from "../exception/YamlParseException"

const yaml = require('js-yaml')

export default class SmilieManager
{
    smiliesData:any = {}

	addSmilieset(name: string, cover='')
	{
		if(!this.doSmiliesetExist(name))
		    this.smiliesData[name] = {
				cover: cover,
				smilies: {}
			}
	}

	doSmiliesetExist(smilieset: string)
	{
		return smilieset in this.smiliesData
	}

    addSmilie(smilieset: string, filename: string, url: string)
	{
		if(!this.doSmiliesetExist(smilieset))
			this.addSmilieset(smilieset)
		
	    this.smiliesData[smilieset]['smilies'][filename] = url
	}

    getTranslation()
	{
	    let trans = {} as any
	    for(let sm in this.smiliesData)
        {
		    let set = this.smiliesData[sm]
		    for(let code in set.smilies)
			{
			    let url = set.smilies[code]
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

	/** 以对象的方式加载表情包 */
    loadAsLegacy(obj: object)
	{
	    let res = obj as any
	    let baseurl = res.url

	    for (const smilieset in res) 
		{
		    if(smilieset == 'url')
			    continue
			this.addSmilieset(smilieset)
		    for (const filename of res[smilieset])
			{
			    let url = baseurl+'/'+smilieset+'/'+filename
			    this.addSmilie(smilieset, filename, url)
			}
		}
	}

	/** 加载AprilComment规范的表情包元文件 */
	async loadAsAprilCommentStandard(baseurl: string)
	{
		let url = baseurl + 'meta.yml'
		let content = await this.fetch(url)
		let data = null as any;

		try {
			data = yaml.load(content)
		} catch(e) {
			if (e.name == 'YAMLException')
				throw new YamlParseException(e.message + '\n\nurl: '+url)
			throw e
		}

		let name = data.name
		let cover = data.cover
		let smilies = data.smilies

		this.addSmilieset(name, cover)

		for (const pic of smilies)
			this.addSmilie(name, pic, baseurl+pic)
	}

	/** 加载Waline规范的表情包元文件 */
	async loadAsWalineStandard(baseurl: string)
	{
		let url = baseurl + 'info.json'
		let content = await this.fetch(url)
		let data = null as any;

		try {
			data = JSON.parse(content)
		} catch(e) {
			throw new JsonParseException(e.message + '\n\nurl: '+url)
		}

		let name = data.name
		let prefix = data.prefix
		let suffix = data.type != ''? '.'+data.type:data.type
		let cover = data.icon
		let smilies = data.items

		this.addSmilieset(name, prefix+cover+suffix)

		for (let pic of smilies)
		{
			pic = prefix+pic+suffix
			this.addSmilie(name, pic, baseurl+pic)
		}
	}

	async load(obj: any)
	{
		if(Array.isArray(obj)) {
			for (let baseurl of obj)
			{
				if(!baseurl.endsWith('/'))
					baseurl += '/'

				try {
					await this.loadAsAprilCommentStandard(baseurl)
				} catch(e) {
					if(e.name == 'FetchException')
						await this.loadAsWalineStandard(baseurl)
					else
						throw e
				}
			}
        } else if(typeof obj == 'object') {
            this.loadAsLegacy(obj)
        }
	}

	async fetch(url: string)
	{
		let response = await fetch(url)
		if(!response.ok)
			throw new FetchException(response.url+' returned '+response.status)
		return await response.text()
	}

}