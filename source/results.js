var fs          = require('fs');
var path        = require('path');
let winston     = require("winston");
let ResultNode  = require("./resultNode").ResultNode;

class Results {
    constructor(config,state){
        this.config = config;
        if (state != undefined)
            this.state = state;
        else {
            this.state = {};
            this.state.logger = winston.createLogger({
                level:this.config.logLevel,
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.File({ filename: this.config.logFileName})
                ]
            });

        }
        this.records = 0;
    }
    add(node){
        this.records++;

        if(this.start == undefined){
            this.start = new ResultNode(node,null,this.state);
            this.current = this.start;
            return;
        }
        this.state.logger.info("adding node to results");
        let child = this.current.addChild(node);
        this.current = child;
        if(this.records == this.config.numberOfRecordsToSaveAfter){
            this.saveToFile();
            this.records =0;
        }
    }

    saveInArray(){
        let resultArray = [];
        if (this.start==undefined){
            return resultArray;
        }
        this.addNodesToArray(resultArray,this.start,{})
        return resultArray;
    }

    addNodesToArray(resultArray,node,currentRecord) {
        let result = {};
        result = Object.assign(result, currentRecord);
        Object.assign(result, node.data);
        resultArray.push(result);

        if (node.children.length > 0) {
            //console.log("children length >0");
            for (let child of node.children) {
                //console.log("got a child");
                this.addNodesToArray(resultArray, child, result);
            }
        }
    }


    get(){
        if(this.current != undefined){
            this.state.logger.info("in get, not undefined")
            return this.current.pop();
        }
        else{
            this.state.logger.info("in get, undefined")
            return undefined;
        }
    }
    pop(){
        let current = this.current;
        this.current = this.current.parent;
        return current.data;
    }

    asJson(){
        if (this.start == undefined){
            return {};
        }
        let data = this.start.data;
        data = JSON.parse(JSON.stringify(data));
        this.fetchTree(data,this.start);
        return data;
    }

    fetchTree(data,node){
        data.children = [];
        let children = node.children;
        for (let child of children){
            data.children.push(child.data);
            this.fetchTree(child.data, child);
        }
    }
    saveToFile(){
        console.log("in saveToFile");
        this.state.logger.info("logging via state");
        let result = JSON.stringify(this.asJson());
        console.log(result);
        fs.writeFileSync(this.config.resultsFile, result, (err) => {
            if (err) {
                console.log(err);
                return;
            };
            //state.logger.info("Results saved!");
        });
    }
}

exports.Results= Results;
