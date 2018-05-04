let {Reaper} = require("./index");
let config = require("./config").config;

console.log(config);

new Reaper(config).run().then(()=>{
    console.log("finished");
    process.exit(0);
})
