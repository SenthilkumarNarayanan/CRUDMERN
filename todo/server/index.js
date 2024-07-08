const express= require("express");
const app= express();
const port=8000;
const users=require("./sample.json");
const cors=require('cors')
const fs=require('fs');
app.use(express.json());
//Display all users: 
app.use(cors(
    { origin: "http://localhost:5173",
    method:['GET','POST','PATCH','DELETE']}
));

app.get("/users",(req,res)=>{
return res.json(users);
});
//Delete user
app.delete("/users/:id",(req,res)=>{
    let id=Number(req.params.id);
    let filteredUser=users.filter((user)=>user.id !== id);
    fs.writeFile("./sample.json",JSON.stringify(filteredUser),(err,data)=>
    { return res.json(filteredUser)} )
})
//Add new userSelect: 
app.post("/users",(req,res)=>{
    let {name,age,city,state}=req.body;
    if(!name || !age || !city|| !state){
        console.log(res)
        res.status(400).send({message:"Required all fields"});
    }
    let id= Date.now();
    users.push({id,name,age,city,state});

    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>
    { return res.json({message:"User details added successfully"})} )})

    app.patch("/users/:id",(req,res)=>{
        let id=Number(req.params.id);
        let {name,age,city,state}=req.body;
        if(!name || !age || !city || !state){
            console.log(res)
            res.status(400).send({message:"Required all fields"});
        }
let index=users.findIndex((user)=>user.id == id) ;
users.splice(index,1,{...req.body});

        fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>
        { return res.json({message:"User details added successfully"})} )})
    

app.listen(port, (err)=>{
    console.log(`app is running in ${port}`);
});