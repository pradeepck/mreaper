class Action {
    constructor(){
    }
    execute(instructions, config,state,context,results) {
        this.instructions = instructions;
        this.config = config;
        this.state = state;
        this.context = context;
        this.reaults = results;
        state.logger.info("in run of action")
    return [{}]
    }
    more(instructions,config,state,context,results){
        state.logger.info("in more of " + state.currentInstruction.name);
        return false;
    }
}

exports.Action = Action;