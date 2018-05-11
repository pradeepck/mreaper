let chai    = require('chai');
let sinon   = require("sinon");
let winston = require("winston");
let config = require("../source/config").config;
let ImageExtractor = require("../source/actions/imageExtractor").Action;
let imageExtractor = new ImageExtractor();

var assert = chai.assert;
describe('ImageExtractor', function() {
    describe('getFileNameFromImageUrl', function() {
        it('should extract filename from image url', function() {
            let url = '//cdn.shopify.com/s/files/1/1837/8517/files/Schoolbooks.ie_280x@2x.jpg?v=1495796284';
            let fileName = imageExtractor.extractFileNameFromUrl(url);
            assert(fileName == "Schoolbooks.ie_280x@2x.jpg","image name incorrect!");
        });
        it('should extract filename from image url when it does not contain ?', function() {
            let url = '//cdn.shopify.com/s/files/1/1837/8517/files/Schoolbooks.ie_280x@2x.jpg';
            let fileName = imageExtractor.extractFileNameFromUrl(url);
            console.log(url.lastIndexOf('?'));
            assert(fileName == "Schoolbooks.ie_280x@2x.jpg","image name incorrect!");
        });
    });
});