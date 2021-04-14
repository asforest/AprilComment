export default class ServerSideException extends Error
{
    constructor(ex: string)
    {
        super(ex)
        this.name = 'ServerSideException'
    }
}