
const express=require("express");
const app=express();
const PORT=process.env.PORT||3000;
app.use(express.static("public"));

let history=[];
let currentResult=null;

function IST(){
  return new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Kolkata"}));
}

function getBaseDate(){
  const now=IST();
  const d=new Date(now);
  if(now.getHours()<5||(now.getHours()===5&&now.getMinutes()<30)){
    d.setDate(d.getDate()-1);
  }
  d.setHours(5,30,0,0);
  return d;
}

function getPeriod(){
  const base=getBaseDate();
  const now=IST();
  const minutes=Math.floor((now-base)/60000)+1;
  const ymd=base.toISOString().slice(0,10).replace(/-/g,'');
  return ymd+"100010000"+String(minutes).padStart(4,'0');
}

setInterval(()=>{
  const sec=IST().getSeconds();
  if(sec===30){
    currentResult=Math.floor(Math.random()*10);
  }
  if(sec===0&&currentResult!==null){
    history.unshift({period:getPeriod(),result:currentResult});
    history=history.slice(0,10);
  }
},1000);

app.get("/data",(req,res)=>{
  res.json({period:getPeriod(),result:currentResult,history});
});

app.listen(PORT);
