let fs = require("fs");

class JsonToCSV {

    constructor(config,logger){
        this.config =config;
        this.logger = logger;
    }

    convertArrayToCSV(rows){
        if (rows== undefined || rows.length == 0){
            return "";
        }
        let fields = Object.keys(rows[0]);
        let csv = rows.map(function(row){
            return fields.map(function(fieldName){
                if (row[fieldName] instanceof Array){
                    let value = "";
                    for (let item of row[fieldName]){
                        value = value + " " + item;
                    }
                    return value;
                }else
                    return JSON.stringify(row[fieldName], replacer)
            }).join(',')
        })
        csv.unshift(fields.join(',')); // add header column
        return csv.join('\r\n');

    }

    saveAsCSVFile(results){
        this.logger.info("saving CSV to file " + this.config.csvFileName);
        let resultArray =null;
        resultArray = results.saveInArray();
        let csv = this.convertArrayToCSV(resultArray);
        fs.writeFileSync(this.config.csvFileName, csv, function(err) {
            if(err) {
                console.log("Error occurred during saving csv file! " + err)
                return ;
            }
            console.log("The file was saved!");
        });
    }

    saveArrayAsCSVFile(resultArray){
        this.logger.info("saving CSV to file " + this.config.csvFileName);
        let csv = this.convertArrayToCSV(resultArray);
        fs.writeFileSync(this.config.csvFileName, csv, function(err) {
            if(err) {
                console.log("Error occurred during saving csv file! " + err)
                return ;
            }
            console.log("The file was saved!");
        });
    }


}

var replacer = function(key, value) {
    if( value === null){
        return '';
    }
    let type = typeof value;
    if (type == "string" ){
        return value.replace(/,/g,'','');

    }
    else return value;
}

exports.JsonToCSV = JsonToCSV;