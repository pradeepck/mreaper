import {Action} from "./action";
const puppeteer = require('puppeteer');
import {Dustbin} from "../dustbin";

class LinkOpener extends Action{
    async execute(instructions, config,state,context, results){
        super.execute(...arguments);
        state.logger.info("in execute of Link Opener"+ state.currentInstruction.name);
        let page = state.page;
        let link = await page.evaluate(element=> element.href,state.currentElement);
        state.logger.info("after evaluate")
        state.logger.info(link);

        state.logger.info("in link opener, about to create dustbin")

        page = await state.browser.newPage();
        let dustBin = new Dustbin(state);
        state.logger.info("in link opener, created dustbin")
        dustBin.addPage(page);
        context.forFreeing.push(dustBin);

        state.page = page;
        let counter = 0;
        while(counter <3){
            let result = await this.fetch(state,page,link);
            if (result==true)
                break;
            counter++
        }
        return [{}]
    }

    async fetch(state,page,link){
        try{
            await page.goto(link, {
                waitUntil: 'networkidle2',
                timeout: 3000000
            });
            return true;
        }catch (error){
            state.logger.info("error in fetch");
            state.logger.info(error);
            return false;
        }

    }
}

exports.Action = LinkOpener;