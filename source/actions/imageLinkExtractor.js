import {Action} from "./action";
const puppeteer = require('puppeteer');

class ImageLinkExtractor extends Action{
    async execute(instructions, config,state,context,results){
        super.execute(...arguments);

        state.logger.info("in execute of Image link Extractor ");
        let elements = await this.selectElements(state)
        if (elements.length>0){
            let text = await state.page.evaluate(element=> element.href,elements[0]);
            let currentNode = results.get();
            currentNode[[state.currentInstruction.params.fieldName]] = text;
            state.logger.info("found data");
            state.logger.info(text);

        }else{
            console.log("no element found!");
        }

        return [state.currentElement]

    }
    async selectElements(state){
        let selectorQuery =state.currentInstruction.params.selector;
        state.logger.info("selectorQuery")
        console.log(selectorQuery)
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

}

exports.Action = ImageLinkExtractor;