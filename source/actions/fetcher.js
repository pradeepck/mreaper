import {Action} from "./action";
const puppeteer = require('puppeteer');

class Fetcher extends Action{
    async execute(instructions, config,state,context,results){
        super.execute(...arguments);
        state.logger.info("in execute of fetch");
        state.logger.info(!config.ui)
        var options = {
            headless: config.headless,
            args: [
                '--no-sandbox',
                '--disable-extensions-except=/home/vagrant/.config/chromium/Default/Extensions/bihmplhobchoageeokmgbdihknkjbknd/1.5.13_0',
                '--load-extension=/home/vagrant/.config/chromium/Default/Extensions/bihmplhobchoageeokmgbdihknkjbknd/1.5.13_0',
            ]
        }
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        state.logger.info("url");
        state.logger.info(state.currentInstruction.params.url);
        await page.goto(state.currentInstruction.params.url, {
                waitUntil: 'networkidle2',
                timeout: 3000000
        });
        state.page = page;
        state.browser = browser;
        return [{}]
    }
}

exports.Action = Fetcher;