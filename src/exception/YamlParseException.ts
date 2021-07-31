export class YamlParseException extends Error
{
    constructor(message: string)
    {
        super(message)
        this.name = 'YamlParseException'
    }
}