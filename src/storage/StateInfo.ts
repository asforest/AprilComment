import { SerializableObject } from "./SerializableStorage"

export interface VisitedPage
{
    pathname: string
    expires: number
}

export default class StateData extends SerializableObject
{
    nick = ''
    website = ''
    mail = ''
    visitedPages = [] as VisitedPage[]

    visitPage(pathname: string, expires: number)
    {
        this.cleanOutdate()
        
        if(!this.isVisited(pathname))
        {
            this.visitedPages.push({pathname, expires})
            this.__owner.write()
            return true
        } else {
            return false
        }
    }

    private isVisited(pathname: string)
    {
        for (let page of this.visitedPages)
        {
            if(page.pathname == pathname)
                return page
        }
        return null
    }

    private cleanOutdate()
    {
        let cleaned = false

        for (let i = 0; i < this.visitedPages.length; i++)
        {
            let page = this.visitedPages[i]
            let expiration = page.expires * 1000
            let now = Date.now()
            if(now > expiration)
            {
                this.visitedPages.splice(i, 1)
                cleaned = true
            }
        }

        if(cleaned)
            this.__owner.write()
    }
}