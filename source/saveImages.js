let fs = require("fs");
const assert = require('assert');
const puppeteer = require('puppeteer');
import fetch from "node-fetch";
var request = require('request-promise')

async function download (uri, filename, callback){
    console.log("in download function");
    var options = {
        uri,
        encoding: null
    };
    let res = await request.get(options).promise();
    console.log(res);
    const buffer = Buffer.from(res, 'utf8');
    let responseFile = "./a.txt";
    fs.writeFileSync(responseFile, buffer);
    console.log("file written!");
};

async function test(){
    try {
        var options = {
            headless: false,
            args: [
                '--no-sandbox'
            ]
        }
        console.log("creating browser");
        const browser = await puppeteer.launch(options);
        console.log("creating page");
        const page = await browser.newPage();
        console.log("going to url");
        await page.goto("https://www.schoolbooks.ie/collections/junior-infants-art-books/products/folens-rainy-days-junior-infants", {
            waitUntil: 'networkidle2',
            timeout: 3000000
        });
        let imageXPath = "//*[@id=\"shopify-section-product-template\"]/div[2]/div[1]/div/div[1]/div/ul/li/a/img";
        console.log("getting data url");
        await getAndSaveImage( imageXPath, page, "./a.jpg");
        console.log("done");


    } catch (error) {
        console.log(error);
    }
}

async function getAndSaveImage (selector, page, fileName) {
    console.log("executing xpath query")
    const image = await page.$x(selector);
    console.log("after executing xpath query");
    const url = await page.evaluate(image=> image.src,image[0]);
    console.log("url is " + url);
    await download(url,fileName,()=>{})
};

async function parseDataUrl (dataUrl){
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (matches.length !== 3) {
        throw new Error('Could not parse data URL.');
    }
    return { mime: matches[1], buffer: Buffer.from(matches[2], 'base64') };
};

test().then((result)=>{
    console.log(result);
    process.exit(0);
});