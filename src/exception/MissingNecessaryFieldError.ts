export default class MissingNecessaryFieldError extends Error
{
    constructor(fieldName: string)
    {
        super('The parameter of "'+fieldName+'" must be given.')
        this.name = 'MissingNecessaryFieldError'
    }
}