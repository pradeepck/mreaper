class Dustbin{
    constructor(state){
        this.state = state;
        this.pages=[]
    }
    addPage(page){
        this.pages.push(page);
    }
    async free(){
        this.state.logger.info("in dustbin free")
        for(let page of this.pages){
            await page.close();
        }
    }
}

exports.Dustbin = Dustbin;