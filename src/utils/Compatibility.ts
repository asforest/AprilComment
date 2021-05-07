import AprilCommentOptions from "../interface/AprilCommentOptions";

export default function(options: any): AprilCommentOptions
{
    let opt = Object.assign({}, options)

    if(!opt.language && opt.placeholders)
    {
        opt.language = opt.placeholders
        opt.language.author = opt.authorLabel
    }
    
    return opt as AprilCommentOptions
}