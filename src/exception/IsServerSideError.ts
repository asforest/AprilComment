export default class IsServerSideError extends Error
{
    constructor()
    {
        super('Sorry, AprilComment does not support Server-side rendering.')
        this.name = 'IsServerSideError'
    }
}