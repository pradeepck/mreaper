let winston = require("winston");
var fs = require('fs');
var path      = require('path');
import {InstructionManager} from "./instructionManager";
let JsonToCSV = require("../source/jsonToCSV").JsonToCSV;

import {Results} from "./results";
import {Runner} from "./runner";

class Reaper{
    constructor(config){
        this.config = config;
        this.populateReaperInstructions();
        // let logFileName=this.config.logFileName ==undefined? "./reaper.log":this.config.logFileName ;
        let logLevel = this.config.logLevel == undefined? "info":this.config.logLevel;
        this.logger = winston.createLogger({
            level:this.config.logLevel,
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: this.config.logFileName})
            ]
        });
    }

    async run() {
        let state = {};
        this.state = state;
        let results = new Results(this.config,state);
        let context = {forFreeing:[]};
        state.logger = this.logger;
        state.logger.info("starting");
        let runner = new Runner(this.reaperInstructions.instructions,this.config,state,context,results)
        try{
            await runner.run();

            let resultArray = results.saveInArray();
            results.saveToFile();
            this.runRecordHandlers(resultArray);

            if (this.config.saveAsCSV == true){
                this.saveAsCSV(resultArray);
            }
        }catch(err){
            console.log("error!");
            console.log(err);
            console.trace();
            state.logger.info("Exception");
            state.logger.info(err);
            process.exit(-1);
        }

    }

    runRecordHandlers(resultArray) {
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log("in run record handlers");
        let recordHandlers = this.instructionManager.getRecordHandlers();
        console.log(resultArray)
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$");

        for (let row of resultArray) {
            console.log("in loop of resultArray");
            console.log(recordHandlers)
            for (let recordHandler of recordHandlers) {
                console.log("recordhandler");
                console.log(row)
                recordHandler(row)
                console.log("after executing record handler")
                console.log(row)
            }
        }
    }

    saveAsCSV(resultArray){
        let jsonToCSV = new JsonToCSV(this.config,this.state.logger);
        jsonToCSV.saveArrayAsCSVFile(resultArray);
    }

    populateReaperInstructions(){
        this.instructionManager = new InstructionManager(this.config, this.config.reaperFile);
        this.reaperInstructions = this.instructionManager.getInstructions();
    }
}

exports.Reaper = Reaper;