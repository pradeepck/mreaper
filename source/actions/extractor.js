import {Action} from "./action";
const puppeteer = require('puppeteer');

class Extractor extends Action{

    async execute(instructions, config,state,context,results){
        console.log("in execute of extractor")
        state.logger.info("in execute of Extractor "+ state.currentInstruction.name);
        let elements = await this.selectElements(state)
        if (elements.length>0){
            let text = await state.page.evaluate(element=> element.innerHTML,elements[0]);
            text = this.cleanse(state,text);
            let currentNode = results.get();
            currentNode[[state.currentInstruction.params.fieldName]] = text;
            state.logger.info("found something, fieldname");
            state.logger.info(state.currentInstruction.params.fieldName);
            state.logger.info(text);

        }else{
            state.logger.info("no element found!");
        }
        if (elements.length> 0)
            return [elements[0]];
        else return []

    }
    async selectElements(state){
        let selectorQuery =state.currentInstruction.params.selector;
        state.logger.info("selectorQuery")
        state.logger.info(selectorQuery)
        let elements = null;
        let page = state.page;
        if (state.currentInstruction.params.relative == undefined){
            state.logger.info("absolute path")
            elements = await page.$x(selectorQuery);
            state.logger.info("evaluated")
        }
        else{
            state.logger.info("relative path")
            if(state.currentElement == undefined)
                throw "undefined element!";
            elements = await state.currentElement.$x(selectorQuery);
        }

        return elements;
    }

    cleanse(state,text){
        let currentInstruction = state.currentInstruction;
        let cleanser = currentInstruction.cleanser;
        if (cleanser != undefined)
            text = cleanser(text);
        return text;
    }

}

exports.Action = Extractor;