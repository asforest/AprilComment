export default class UnknownException extends Error
{
    constructor(ex: string)
    {
        super(ex)
        this.name = 'UnknownException'
    }
}