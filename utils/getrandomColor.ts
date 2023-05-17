const  getrandomColor = ()=>{
let options = ["primary","secondary","accent","success","warning","info","error"];
var item = options[Math.floor(Math.random()*options.length)];
return item ||"primary";
}


export {getrandomColor};