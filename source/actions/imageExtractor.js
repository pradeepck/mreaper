import {Action} from "./action";
const puppeteer = require('puppeteer');
let Extractor = require("./extractor").Action;
var request = require('request-promise')
let fs = require("fs");

class ImageExtractor extends Extractor{

    async execute(instructions, config,state,context,results){
        console.log("in execute of extractor")
        state.logger.info("in execute of Extractor "+ state.currentInstruction.name);
        let elements = await this.selectElements(state)
        if (elements.length>0){
            let url = await state.page.evaluate(image=> image.src,elements[0]);
            let fileName = this.extractFileNameFromUrl(url);
            let fullFileName = null;
            if (config.filesPath != undefined)
                fullFileName = config.filesPath +"/"+ fileName;
            else
                fullFileName = "./"+ fileName;

            let currentNode = results.get();
            currentNode[[state.currentInstruction.params.fieldName]] = fileName;
            currentNode[[state.currentInstruction.params.urlFieldName]] = url;

            console.log("full FileName");
            console.log(fullFileName);
            await download(url,fullFileName,()=>{})
            state.logger.info("found something, fieldname");
            state.logger.info(state.currentInstruction.params.fieldName);
            state.logger.info(fileName);

        }else{
            state.logger.info("no element found!");
        }
        if (elements.length> 0)
            return [elements[0]];
        else return []

    }
    extractFileNameFromUrl(url){
        if (url.lastIndexOf("?") != -1)
            return url? url.slice(url.lastIndexOf('/') + 1,url.lastIndexOf('?')):url;
        else
            return url? url.slice(url.lastIndexOf('/') +1 ):url;

    }

}
async function download (uri, fileName, callback){
    console.log("in download function");
    var options = {
        uri,
        encoding: null
    };
    let res = await request.get(options).promise();
    const buffer = Buffer.from(res, 'utf8');
    fs.writeFileSync(fileName, buffer);
    console.log("file written!");
};


exports.Action = ImageExtractor;