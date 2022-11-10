const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path");
const toFile=require('./controller/writeToFile')


//mongodb connection
var connection=mongoose.connect('mongodb://localhost:27017/medicalAid');
mongoose.Promise=global.Promise
const Member=require('./model/Member')(mongoose);
// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//root endpoint
app.get("/",(req,res)=>{
     res.redirect('/members');
});

//entry endpoint
app.get("/members", (req, res) =>{  
    res.sendFile(path.join(__dirname,'/public/report.html'));
})
//add members endpoint
app.get("/register", (req, res) =>{
    res.sendFile(path.join(__dirname,'/public/form.html'));
});

//dependents endpoint
app.get("/dependent", (req, res) =>{
    res.sendFile(path.join(__dirname,'/public/dependent.html'));
});

//get members endpoint
app.post("/members", (req, res) =>{
    try {
        var member=Member.Member
        member.find({}).then(function(doc,err){
            if(!err){
                if(doc!=null){
                   //console.log(toFile.writeToFile);
                   toTextFile(doc)
                    res.send({members:doc})
                   return
                }else{
                    res.json({msg:"no members found"})
                    return

                }
            }else{
                console.log(err)
            }
        });
        res.sendFile(path.join(__dirname,'/public/report.html'));
    } catch (error) {
        console.log(error);
    }
   
 
});
    
//endpoint add member 
app.post('/add',(req,res)=>{
    try {
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
        res.json({msg:"User added succesfully", success:true})
    }else{
        res.json({msg:'Error occured'});
    }
    } catch (error) {
        console.log(error);
    }
   
})


//endpoint add dependents
app.post('/dependent/add',(req,res)=>{
    //if(req.xhr||req.accepts('json,html')==='json'){
            var firstname=req.body.name;
            var surname=req.body.surname;
            var dateOfBirth=new Date(req.body.dob);
            var membershipNumber=req.body.id;

            try {
               message= Member.registerDependent(membershipNumber,firstname,surname,dateOfBirth);
               //res.json({success:true,msg:message})
               res.redirect('/members')
            } catch (error) {
                throw error
            }
        
       
        //validation goes here
       
   // }else{
        //res.json({msg:'Some error occured,xhr no found'});
    //}
   // res.json({msg:'Some error occured'});
})
app.listen(3000, () => console.log(` app listening on http://localhost:3000`));

//function to write file
function toTextFile(users){
    try {
      var headers = "_id,MembershipNumber,Firstname,Surname,DateOfBirth,DateJoined,BenefitDate,PostalAddress,MembershipStatus,Premium\n";
      fd = fs.openSync('principalMembership.csv', 'w');
      fs.writeSync(fd, headers, null, null);
      if (users.length != 0) {
        for (const user of users) {
          let content = `${user._id},${user.membershipNumber},${user.firstname},${user.surname},${user.dateOfBirth},${user.dateJoined},${user.benefitDate},${user.postalAddress},${user.membershipStatus},${user.premium}\n`;
          fs.writeSync(fd, content, null, null);
        }
        console.log('Write complete.');
      } else {
        console.log('users cannot be empty');
      }
    } catch (error) {
      console.log(error.stack);
    }    
}
