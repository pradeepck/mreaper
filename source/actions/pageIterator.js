import {Action} from "./action";
const puppeteer = require('puppeteer');
import {Dustbin} from "../dustbin";

class PageIterator extends Action{

    async execute(instructions, config,state,context,results){
        super.execute(...arguments);
        state.logger.info("in execute of Page Iterator" + state.currentInstruction.name);
        /*
            Responsibilities
                - find all the elements corresponding to "selector"
                - return the elements
         */
        let pageElementsQuery =state.currentInstruction.params.selector;
        let selectedElements = await this.selectElements(state);
        if (config.testMode == true && selectedElements.length >0){
            selectedElements = selectedElements.slice(0,1);
        }
        //selectedElements.splice(0,length);
        state.logger.info("got elements");
        state.logger.info("selected elements, length "+ selectedElements.length)
        return selectedElements;

    }
    async selectElements(state){
        let selectorQuery =state.currentInstruction.params.itemSelector;
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

    async more(instructions, config,state,context,results){
        state.logger.info("in more function of page iterator")
        // find the element for "next" using selector
        // if element is found
            // click on "next" and load page
            // return true
        // else
            // return false
        let nextElementQuery =state.currentInstruction.params.nextSelector;
        state.logger.info("in more, nextselector");
        state.logger.info(nextElementQuery);
        let page = state.page;
        let elements         = await page.$x(nextElementQuery);
        if (elements.length ==0)
            return false;
        else{
            let link = await page.evaluate(element=> element.href,elements[0]);
            page = await state.browser.newPage();
            state.logger.info("in page iterator more, link to next page is")
            state.logger.info(link);
            await page.goto(link);
            state.page = page;

            let dustbin = new Dustbin(state);
            dustbin.addPage(state.page);
            context.forFreeing.push(dustbin)

            return true;
        }

    }
}

exports.Action = PageIterator;