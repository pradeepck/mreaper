class ResultNode {
    constructor (data,parent,state){
        this.state = state;
        this.parent = parent;
        this.data = data;
        this.children=[];
        this.parent = parent;
    }
    addChild(data){
        let child = new ResultNode(data,this,this.state);
        this.children.push(child);
        return child;
    }
    pop(){
        return this.data;
    }
}
exports.ResultNode = ResultNode;