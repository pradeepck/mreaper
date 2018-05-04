export default function traverseObject(someObject,filter,action){
    for(let key of Object.keys(someObject)){
        if (typeof someObject[key]== "object"){
            traverseObject(someObject[key],filter, action)
        }else{
            if (filter(key))
                action(someObject,key);
        }
    }
}