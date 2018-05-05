
class Runner {
    constructor(instructions,config,state,context,results){
        this.instructions = instructions;
        this.config = config;
        this.state = state;
        this.context = context;
        this.results = results;
    }
    async run (){
        this.state.logger.info("in run");
        //console.log(JSON.stringify(this.instructions));
        for(let instruction of this.instructions) {
            this.state.logger.info("executing instruction")
            this.state.logger.info(instruction.name);

            if (instruction.addResultNode != undefined) {
                this.state.logger.info("adding node to results node");
                let resultNode = {};
                this.results.add(resultNode);
            }
            this.state.currentInstruction = instruction;

            let action = new instruction.action();
            do {
                let nextElements = null;
                try{
                    console.log("executing action...");
                    console.log(action);
                    nextElements = await action.execute(this.instructions, this.config, this.state, this.context, this.results);
                }catch(e){
                    console.log("got an exception, it is"+ e)
                    this.state.logger.info("exception " + e);
                    console.log(e.stack);
                    process.exit(-1);
                }
                if (instruction.andThen!= null && instruction.andThen != undefined && typeof instruction.andThen == "object") {
                    console.log("andThen!");
                    for (let nextElement of nextElements) {
                        console.log("in loop!");
                        let context = {forFreeing: []}
                        let instructions = this.instructions;
                        let newInstructions = {...instructions};
                        let state = {...this.state}
                        state.currentElement = nextElement;
                        console.log("about to execute recursively");
                        let runner = new Runner(instruction.andThen, this.config, state, context, this.results);
                        await runner.run();
                        this.state.logger.info("about to free dustbins " + instruction.name);
                        if (context.forFreeing != undefined) {
                            for (let itemToFree of context.forFreeing) {
                                await itemToFree.free();
                            }
                        }


                    }
                } else {
                    this.state.logger.info("instruction undefined!");
                }


            } while (await action.more(this.instructions, this.config, this.state, this.context, this.results) == true)
            console.log("finished instruction " + instruction.name)
            if (instruction.popAfter== true){
                console.log("##$$$$$$$$$$%%%%%%%%%%%%%%%%popping^&&&&&&&&&&&&&&&&&&*^^*&*^%*^**")
                if ( this.results.pop() == null){
                    this.state.logger.info("popped too much!")
                };
            }else{
                console.log("popAfter is not true")
            }
        }
    }
}

exports.Runner = Runner;
