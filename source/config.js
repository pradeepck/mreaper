exports.config = {
    headless:true,
    testMode: true,
    reaperFile:"test.json",
    resultsFile:"./results.json",
    numberOfRecordsToSaveAfter:25,
    logFileName:"reaper.log",
    logLevel:"info",
    saveAsCSV: true,
    csvFileName: "./results.csv",
    recordHandlerDirName:__dirname+"/recordHandlers",
    cleansersDirName:__dirname+"/cleansers",
    filesPath:"."
}
