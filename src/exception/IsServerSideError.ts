export default class IsServerSideError extends Error
{
    constructor()
    {
        super('Sorry, AwesomeComment does not support Server-side rendering.')
        this.name = 'IsServerSideError'
    }
}