export class JsonParseException extends Error
{
    constructor(message: string)
    {
        super(message)
        this.name = 'JsonParseException'
    }
}