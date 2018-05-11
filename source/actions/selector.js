import {Action} from "./action";
import {Runner} from "../runner";

class Selector extends Action{
    async execute(instructions, config,state,context,results){
        super.execute(...arguments);
        state.logger.info("in execute of selector "+ state.currentInstruction.name)
        let selectedElements = await this.selectElements(state);
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        console.log("initially got " + selectedElements.length)
        if (state.currentInstruction.params.header != undefined){
            this.removeFirst(selectedElements)
        }
        console.log("after removing header, got " + selectedElements.length)
        if (config.testMode == true){
            this.removeAfterFirst(selectedElements)
        }
        console.log("after removing all after header" + selectedElements.length)

        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        state.logger.info("selected elements, length "+ selectedElements.length)

        console.log("returning from selector......")
        return selectedElements;
    }

    removeFirst(array){
        if(array.length>0){
            array.shift();
        }
    }
    removeAfterFirst(array){
        if (array.length>0)
            array.splice(1);
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