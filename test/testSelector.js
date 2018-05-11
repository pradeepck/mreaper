let chai    = require('chai');
let Selector = require("../source/actions/selector").Action;
console.log(selector);
let sinon   = require("sinon");
let winston = require("winston");
let config = require("../source/config").config;

let selector = new Selector();

var assert = chai.assert;
describe('Selector', function() {
    describe('remove Head', function() {
        it('should return all elements after first', function() {
            let testArray = [1,2,3,4,5];
            selector.removeFirst(testArray);
            assert(testArray[0] == 2);
        });
    });
    describe('removeAfterFirst', function() {
        it('should remove all elements after first', function() {
            let testArray = [1,2,3,4,5];
            selector.removeAfterFirst(testArray);
            assert(testArray.length == 1 && testArray[0] == 1);
        });
    });
    describe('removeHead and removeAfterFirst', function() {
        it('should remove first element and then all elements after new first element', function() {
            let testArray = [1,2,3,4,5];
            selector.removeFirst(testArray);
            selector.removeAfterFirst(testArray);
            assert(testArray.length == 1 && testArray[0] == 2);
        });

    });

});