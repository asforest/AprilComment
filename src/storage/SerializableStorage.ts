export abstract class SerializableObject
{
    __owner: SerializableStorage<SerializableObject>

    constructor(owner: SerializableStorage<SerializableObject>) { this.__owner = owner }
    init() {}
    beforeUnserialization() {}
    afterUnserialization() {}
    beforeSerialization() {}
    afterSerialization() {}
}

export default class SerializableStorage<T extends SerializableObject>
{
    object: T
    storageKey: string

    constructor(type: new(owner: SerializableStorage<T>) => T, storageKey: string)
    {
        this.object = new type(this)
        this.object.init()
        this.storageKey = storageKey
    }

    read()
    {
        this.object.beforeUnserialization()

        let unserialized = JSON.parse(localStorage.getItem(this.storageKey) ?? '{}')

        for (const prop in unserialized)
        {
            if(!prop.startsWith('__'))
                (this.object as any)[prop] = unserialized[prop]
        }

        this.object.afterUnserialization()
    }

    write()
    {
        this.object.beforeSerialization()

        let temp = {}
        for (const prop in this.object)
        {
            if(!prop.startsWith('__'))
                (temp as any)[prop] = this.object[prop]
        }

        localStorage.setItem(this.storageKey, JSON.stringify(temp))

        this.object.afterSerialization()
    }
}