let chai = require('chai');
let InstructionManager = require("../source/instructionManager").InstructionManager;
let config = require("../source/config").config;
let winston = require("winston");
var assert = chai.assert;

describe('Instruction Manager', function() {
    describe('loadCleanser', function () {
        it('should load a cleanser and execute it', function () {
            let instructionManager = new InstructionManager(config,config.reaperFile);
            let cleansers = instructionManager.getCleansers();

            let logger = winston.createLogger({
                level: config.logLevel,
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.File({filename: config.logFileName})
                ]
            });
            let cleanser = cleansers["testCleanser"];
            let results = cleanser("test");
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
            console.log(results);
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")

            assert(results == "TEST", "cleanse is not executed properly");
        });
    });
    describe('loadRecordHandler', function () {
        it('should load a record handler and execute it', function () {
            let instructionManager = new InstructionManager(config,config.reaperFile);
            let recordHandlers = instructionManager.getRecordHandlers();

            let logger = winston.createLogger({
                level: config.logLevel,
                transports: [
                    new winston.transports.Console(),
                    new winston.transports.File({filename: config.logFileName})
                ]
            });
            let firstRecordHandler = recordHandlers[0];
            let record = {"test":"Test"};
            firstRecordHandler(record);

            assert(record.test=="Test", "recordHandler failed to load or execute");
        });
    });
});