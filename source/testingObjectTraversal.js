let testingObject = {
    key1: "value1",
    key2: "value2",
    key3 :{
        "action": "Testing"
    }
}

function traverseObject(someObject,filter,action){
    for(let key of Object.keys(someObject)){
        console.log("found a key, it is");
        console.log(key);
        console.log("corresponding value");
        console.log(someObject[key])
        if (typeof someObject[key]== "object"){
            console.log("object found");
            traverseObject(someObject[key],filter, action)
        }else{
            if (filter(key))
                action(someObject,key);
        }
    }
}

function changeValue(object,key){
    let curValue = object[key];
    object[key] = curValue+ " testing";
}
let filter = function(key){
    if (key=="action"){
        return true;
    }
}
traverseObject(testingObject,filter,changeValue);
console.log(testingObject);