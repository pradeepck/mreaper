import {Action} from "./action";
import {Runner} from "../runner";

class Selector extends Action{
    async execute(instructions, config,state,context,results){
        super.execute(...arguments);
        state.logger.info("in execute of selector "+ state.currentInstruction.name)
        let selectedElements = await this.selectElements(state);
        if (config.testMode == true){
            if(state.currentInstruction.params.header != undefined)
                selectedElements = selectedElements.slice(0,2);
            else
                selectedElements = selectedElements.slice(1);

        }
        state.logger.info("selected elements, length "+ selectedElements.length)
        if(state.currentInstruction.params.header != undefined){
            if(selectedElements.length>= 0)
                selectedElements.shift();
        }

        console.log("returning from selector......")
        return selectedElements;
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
}

exports.Action = Selector;