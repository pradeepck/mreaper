let chai = require('chai');
let JsonToCSV = require("../source/jsonToCSV").JsonToCSV;
let Results = require("../source/results").Results;
let config = require("../source/config").config;
let winston = require("winston");
var fs = require('fs');

var assert = chai.assert;

describe('JsonToCSV', function() {
    describe('convertArrayToCSV', function() {
        it('should return a string with comma separated values', function() {
            let results = new Results(config);
            results.add({name:"Test","publisher":"Edco"});
            results.add({name:"Test1","publisher":"Gill Education"});
            let logger = winston.createLogger({
                level:config.logLevel,
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.File({ filename: config.logFileName})
                ]
            });

            let jsonToCSV= new JsonToCSV(config,logger);
            let resultArray = []
            resultArray = results.saveInArray();
            let csv = jsonToCSV.convertArrayToCSV(resultArray);
            assert(csv=="name,publisher\r\n\"Test\",\"Edco\"\r\n\"Test1\",\"Gill Education\"","after converting results to CSV, csv with header should be returned");
        });
    });
    describe('saveAsCSV', function() {
        it('should return a string with comma separated values', function() {
            let results = new Results(config);
            results.add({name:"Test","publisher":"Edco"});
            results.add({name:"Test1","publisher":"Gill Education"});
            let logger = winston.createLogger({
                level:config.logLevel,
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.File({ filename: config.logFileName})
                ]
            });

            let jsonToCSV= new JsonToCSV(config,logger);
            let resultArray = []
            jsonToCSV.saveAsCSVFile(results);
            let csv = fs.readFileSync(config.csvFile);
            assert(csv=="name,publisher\r\n\"Test\",\"Edco\"\r\n\"Test1\",\"Gill Education\"","after saving to csv and readig from file, it should return given string");
        });
    });

});