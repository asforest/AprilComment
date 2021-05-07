import DOMPurify from "dompurify"
import MissingNecessaryFieldError from "../exception/MissingNecessaryFieldError"
import AprilCommentOptions from "../interface/AprilCommentOptions"

/**
 * 使用默认的object对另一个object进行初始化（合并）
 * @param object 被合并的Object
 * @param defaultObject 默认值Object
 * @returns 合并后的新Object
 */
export function useDefault(object: any, defaultObject: any): any
{
    let temp = Object.assign({}, object)

    if(typeof object == 'undefined' || object == null)
	    return defaultObject

    if(defaultObject == null)
	    return temp

    for (const obj in defaultObject)
	{
	    let var1 = temp[obj]
	    let var2 = defaultObject[obj]
	    let type1 = typeof var1
	    let type2 = typeof var2
	    let arr1 = Array.isArray(var1)
	    let arr2 = Array.isArray(var2)

	    if(type1 == 'undefined')
		    temp[obj] = defaultObject[obj]

	    else if(type1 != type2 && type2 != 'undefined') 
		    temp[obj] = defaultObject[obj]

	    else if(arr1 != arr2) {
		    if(type2 != 'undefined')
			    temp[obj] = defaultObject[obj]
		}

	    else if(type1 == 'object')
		    temp[obj] = useDefault(temp[obj], defaultObject[obj])
	}

    return temp
}

/**
 * 检查必要的字段
 * @param necessaries 必要的字段
 * @param checkFor 被检查的对象
 */
export function checkNecessaryOptions(necessaries: string[], checkFor: AprilCommentOptions) 
{
    for (const necessary of necessaries) 
	{
	    if(!(necessary in checkFor) || typeof (checkFor as any)[necessary]=='undefined')
		    throw new MissingNecessaryFieldError(necessary)
	}
}

export function sanitizeThroughly(text: string) 
{
    return DOMPurify.sanitize(text, {ALLOWED_TAGS: [], KEEP_CONTENT: true})
}

export function sanitize(text: string)
{
	let options = {
		KEEP_CONTENT: true,
		ALLOWED_TAGS: [
			'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
			'pre', 'code', 'span', 'hr',
			'ul', 'li', 'ol', 'br',
			'a', 'img', 'p', 
			'blockquote',
			'em','strong',
			'table', 'thead', 'tr', 'th', 'td', 'tbody',
		]
	}

	return DOMPurify.sanitize(text, options)
}

export function objectToQueryParamter(obj: any)
{
    let buffer = ''

    for (let prop in obj) 
	{
	    let val = obj[prop]

	    if(typeof val!='undefined' && val!=null && val!='')
		{
		    buffer += (buffer==''? '':'&')
		    buffer += prop+'='+val
		}
	}

    return buffer
}

export function getAvatarByMail(opt: AprilCommentOptions, mail: string)
{
    let avatarUrl = opt.avatarSource + mail
    let param = objectToQueryParamter({
	    d: opt.avatarDefault,
	    f: opt.avatarForce? 'y':null,
	    _: opt.avatarNocache? new Date().getTime().toString():null
	})
	
    return avatarUrl + (param==''? '':'?') + param
}