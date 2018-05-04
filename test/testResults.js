let chai    = require('chai');
let Results = require("../source/results").Results;
let sinon   = require("sinon");
let winston = require("winston");
let config = require("../source/config").config;

var assert = chai.assert;
describe('Results', function() {
    describe('create Results should return an object', function() {
        it('should return a results object', function() {
            let results = new Results(config);
            assert(results instanceof Object);
        });
    });
    describe('add', function() {
        it('after adding, it should return the same object', function() {
            let results = new Results(config);
            results.add({name:"Test"});
            let node = results.get();
            assert(node.name == "Test");
        });
    });
    describe('pop', function() {
        let results = new Results(config);
        results.add({name:"Test"});

        it('after popping, it should return the same object', function() {
            let node = results.pop();

            assert(node.name == "Test");
        });
        it('after popping, twice it should return undefined', function() {
            let node = undefined;
            try{
                node = results.get();
            }catch(error){
                console.log("Error");
            }
            assert(node == undefined,"node should be undefined, but it is not");
        });

    });

    describe('saveToFile', function() {
        let config = require("../source/config").config;
        let results = new Results(config);
        sinon.spy(results,"saveToFile")
        for(let i=0;i<=config.numberOfRecordsToSaveAfter;i++){
            results.add({name:"Test"});
        }

        it('calling add after configured number of times, it should save it to file', function() {
            assert(results.saveToFile.calledOnce,"saveToFile was not called once")
        });

    });


    describe('asJson', function() {
        let config = require("../source/config").config;
        let results = new Results(config);
        results.add({name:"Test"});
        results.add({name:"Test1"});

        it('after adding one item to results, asJson should return proper results', function() {
            assert(JSON.stringify(results.asJson()) == "{\"name\":\"Test\",\"children\":[{\"name\":\"Test1\",\"children\":[]}]}","asJSON not working fine")
        });

    });

    describe('saveInArray single object', function() {
        it('should return an array with one row when result has one root node', function() {
            let results = new Results(config);
            results.add({name:"Test"});
            let logger = winston.createLogger({
                level:config.logLevel,
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.File({ filename: config.logFileName})
                ]
            });

            let resultArray = [];
            resultArray = results.saveInArray();
            assert(resultArray.length==1,"after saving results with one item, array length should be 1");
        });
    });
    describe('saveInArray 2 objects', function() {
        it('should return an array with two rows when result has two nodes', function() {
            let results = new Results(config);
            results.add({name:"Test"});
            results.add({name:"Test1"});
            let logger = winston.createLogger({
                level:config.logLevel,
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.File({ filename: config.logFileName})
                ]
            });

            let resultArray = []
            resultArray = results.saveInArray();
            assert(resultArray.length==2,"after saving results with one item, array length should be 2");
        });
    });

});