class TextSender{
    static async delivText(ans, msg){
        let txt = []
        for(let i in ans)
            txt.push(...ans[i].split('.//'))
        for(let i in txt)
            if(txt[i] !== '')
                await msg.reply(txt[i])
    }
}

export {TextSender}