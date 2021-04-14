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

		if(type != type2)
			temp[obj] = defaultObject[obj]

		if(type == 'object')
			temp[obj] = useDefault(temp[obj], defaultObject[obj])
	}

	return temp
}