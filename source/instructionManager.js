var fs = require('fs');
var path      = require('path');
import traverseObjects from "./traverseObject";
class InstructionManager {
    constructor(config,instructionFile){

        this.config         = config;
        this.actions        = this.loadActions();
        this.cleansers      = this.loadCleansers();
        this.recordHandlers = this.loadRecordHandlers();
        this.instructions   = JSON.parse(fs.readFileSync(instructionFile, 'utf8'));

        this.replaceTextNamesWithObjects();

    }
    loadActions(){
        let baseName  = __dirname+"/actions";
        let actions = {};

        fs
            .readdirSync(baseName)
            .filter(function(file) {
                return (file.indexOf('.') !== 0) && (file !== baseName);
            })
            .forEach(function(file) {
                var action = require(path.join(baseName, file)).Action;
                actions[action.name]=action;
            });

        return actions;
    }

    loadCleansers(){
        let baseName  = __dirname+"/"+this.config.cleansersDirName;
        let cleansers = {};
console.log("%%%%%%%%%%%%%%%%%%%%%%%%%");
        console.log(__dirname);
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%");
        fs
            .readdirSync(baseName)
            .filter(function(file) {
                return (file.indexOf('.') !== 0) && (file !== baseName);
            })
            .forEach(function(file) {
                var cleanser = require(path.join(baseName, file));
                cleansers[file.slice(0,-3)]=cleanser.cleanse;
            });

        return cleansers;
    }

    loadRecordHandlers(){
        let baseName  = __dirname+"/"+this.config.recordHandlerDirName;
        let recordHandlers = [];

        fs
            .readdirSync(baseName)
            .filter(function(file) {
                return (file.indexOf('.') !== 0) && (file !== baseName);
            })
            .forEach(function(file) {
                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
                console.log(file)
                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
                var recordHandler = require(path.join(baseName, file));
                recordHandlers.push(recordHandler.recordHandler);
            });

        return recordHandlers;
    }

    replaceTextNamesWithObjects() {
        traverseObjects(this.instructions, this.filterAction, this.replaceActions.bind(this))
        traverseObjects(this.instructions, this.filterInstruction, this.replaceInstructions.bind(this))
        traverseObjects(this.instructions, this.filterNextInstruction, this.replaceInstructions.bind(this))
        traverseObjects(this.instructions, this.filterCleanser, this.replaceCleansers.bind(this))

    }


    filterAction(key){
        if(key=="action") return true;
    }

    filterCleanser(key){
        if(key=="cleanser") return true;
    }

    replaceActions(object, key){
        if (object[key] in this.actions)
            object[key] = this.actions[object[key]];
        else
            throw "action " + object[key] + " not found!";
    }

    replaceCleansers(object, key){
        if (object[key] in this.cleansers)
            object[key] = this.cleansers[object[key]];
        else
            throw "cleanser " + object[key] + " not found!";
    }

    filterInstruction(key){
        if(key=="instruction") return true;
    }

    replaceInstructions(object, key){
        if (object[key] =="") return;
        if (object[key] in this.instructions){
            object[key] = this.instructions[object[key]];

        }
        else
            throw "instruction" + object[key] + " not found!";
    }

    filterNextInstruction(key){
        if(key=="nextInstruction" ) return true;
    }

    getInstructions(){
        return this.instructions;
    }

    getRecordHandlers(){
        return this.recordHandlers;
    }

    getCleansers(){
        return this.cleansers;
    }

}

exports.InstructionManager = InstructionManager;