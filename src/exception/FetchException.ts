
export class FetchException extends Error
{
    constructor(message: string)
    {
        super(message)
        this.name = 'FetchException'
    }
}