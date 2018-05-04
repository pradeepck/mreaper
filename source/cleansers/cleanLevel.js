export function cleanse(text){
    if (text == undefined){
        return;
    }
    text =  text?text.replace('\n          <span class=\"arrow\">▾</span>',''):text;

    return text;
}
