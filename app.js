const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path");
//import Member


//connect to mongodb
var connection=mongoose.connect('mongodb://localhost:27017/medicalAid');
mongoose.Promise=global.Promise
const Member=require('./model/Member')(mongoose);
// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//entry endpoint
app.get("/home", (req, res) =>{
    res.sendFile(path.join(__dirname,'/public/form.html'));
});

//entry endpoint
app.get("/dependent", (req, res) =>{
    res.sendFile(path.join(__dirname,'/public/dependent.html'));
});
//entry endpoint
app.get("/report", (req, res) =>{
    res.sendFile(path.join(__dirname,'/public/report.html'));
});
//view member endpoint 
app.get("/members", (req, res) =>{
  
    res.sendFile(path.join(__dirname,'/public/report.html'));

})

//get members endpoint
app.post("/members", (req, res) =>{
   var member=Member.Member
        member.find({},function(err,doc){
            if(!err){
                if(doc!=null){
                   res.send({members:doc})
                   return
                }else{
                    res.json({msg:"no members found"})
                    return

                }
            }else{
                console.log(err)
            }
        })
    res.sendFile(path.join(__dirname,'/public/report.html'));
 
});
    
//endpoint add member 
app.post('/add',(req,res)=>{
    if(req.xhr||req.accepts('json,html')==='json'){
            var firstname=req.body.name;
            var surname=req.body.surname;
            var dateOfBirth=new Date(req.body.dob);
            var postalAddress=req.body.address;
           
            try {
                Member.register(firstname,surname,dateOfBirth,postalAddress);
            } catch (error) {
                throw error
            }
        
       
        //validation goes here
        res.json({success:true})
    }else{
        res.json({doem:'fail'});
    }
})


//endpoint add dependents
app.post('/dependent/add',(req,res)=>{
    if(req.xhr||req.accepts('json,html')==='json'){
            var firstname=req.body.name;
            var surname=req.body.surname;
            var dateOfBirth=new Date(req.body.dob);
            var id=req.body.id;
            try {
               message= Member.registerDependent(id,firstname,surname,dateOfBirth);
               res.json({success:true,msg:message})
            } catch (error) {
                throw error
            }
        
       
        //validation goes here
       
    }else{
        res.json({msg:'Some error occured'});
    }
   // res.json({msg:'Some error occured'});
})
app.listen(3000, () => console.log(` app listening on http://localhost:3000`));
