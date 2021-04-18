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
		let type = typeof(temp[obj])
		let type2 = typeof(defaultObject[obj])

		if(type == 'undefined')
			temp[obj] = defaultObject[obj]

		if(type != type2 && type2 != 'undefined')
			temp[obj] = defaultObject[obj]

		if(type == 'object')
			temp[obj] = useDefault(temp[obj], defaultObject[obj])
	}

	return temp
}

/**
 * 检查必要的字段
 * @param necessaries 必要的字段
 * @param checkFor 被检查的对象
 */
export function checkOptions(necessaries: string[], checkFor: AprilCommentOptions) 
{
	for (const necessary of necessaries) 
	{
		if(!(necessary in checkFor) || typeof (checkFor as any)[necessary]=='undefined')
			throw new MissingNecessaryFieldError(necessary)
	}
}