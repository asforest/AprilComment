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
export function checkOptions(necessaries: string[], checkFor: AprilCommentOptions) 
{
	for (const necessary of necessaries) 
	{
		if(!(necessary in checkFor) || typeof (checkFor as any)[necessary]=='undefined')
			throw new MissingNecessaryFieldError(necessary)
	}
}