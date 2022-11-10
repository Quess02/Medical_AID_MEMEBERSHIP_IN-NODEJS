/**
 * Model a Membership object
 */
 
module.exports=(mongoose)=>{
    const Schema=mongoose.Schema;
   
    var memberSchema=new Schema({
        membershipNumber:{type:String},
        firstname:{type:String,required:true},
        surname:{type:String,required:true},
        dateOfBirth:{type:Date,required:true},
        postalAddress:{type:String,required:true},
        dateJoined:{type:Date},
        benefitDate:{type:Date},
        membershipStatus:{ type:String,default:'NEW'},
        premium:{type:Number,default:0},
    });

    // Middleware runs everytime before a principal member is saved to the collection
    memberSchema.pre('save',function(next){
        //generate a unique membership number from default MongoDB ObjectId
        this.membershipNumber=JSON.stringify(this._id).substring(17,25).toUpperCase();
        console.log("Saved "+ this.firstname);
       next()
    })
    Member=mongoose.model('Member',memberSchema);

    //Dependent Schema
    var dependentSchema=new Schema({
        membershipNumber:{type:String},
        firstname:{type:String,required:true},
        surname:{type:String,required:true},
        dateOfBirth:{type:Date,required:true},
        principal:{type:String,ref:"Member",required:true}

    });
    dependentSchema.pre('save',function(next){
        this.membershipNumber=JSON.stringify(this._id).substring(17,25).toUpperCase();
        console.log("Saving "+this.membershipNumber);
        next()
    })
    dependentSchema.post('save',function(doc){
        console.log("Saved... ");
        //SET total premiums for principal member
        premium()
        setStatus()
        
    })
    Dependent=mongoose.model('Dependent',dependentSchema);
    
   //generate random date
    function randomDate(start,end){
        return new Date(start.getTime()+Math.random()*(end.getTime()-start.getTime()));
    }
    //Adds new principal member to the database
    var register=(firstname,surname,dateOfBirth,postalAddress)=>{
        try {
            let rand=randomDate(new Date(dateOfBirth),new Date())
          
            let benDate=new Date(rand.getTime()+(1000*60*60*24*90))//add 90 days(millseconds) to join date
                user=new Member({
                    firstname:firstname,
                    surname:surname,
                    dateOfBirth:new Date(dateOfBirth),
                    dateJoined:rand,
                    benefitDate:benDate,
                    postalAddress:postalAddress
                })
                user.save();
        } catch (error) {
            console.log(error)
        }
      
    }


    //Adds new dependent member to the database
    var registerDependent=(principal,firstname,surname,dateOfBirth)=>{
        try {
            let msg="Some error ";
            Member.find({membershipNumber:principal}).then(function(doc,err){
                if(doc!=null && doc.length!=0){
                    user=new Dependent({
                        firstname:firstname,
                        surname:surname,
                        dateOfBirth:new Date(dateOfBirth),
                        principal:principal
                    })

                    user.save()
                    msg='Succesfully added!'
                    console.log(msg)
                }else{ 
                    msg='Principal user does not exist!'
                    console.log(msg);
                }
            });
            return msg
        } catch (error) {
            console.log(error);
        }
        
    }



    //calculate premium
    function premium() {
        try {
            Member.find({}).then(function (doc, err) {
                for (const m of doc) {
                    Dependent.find({ principal: m.membershipNumber }).then((dep, error) => {
                        Member.find({membershipNumber: m.membershipNumber}).then((user,error)=>{
                            let upDoc=user[0]
                            let tPrems=0
                                //has 0 dependents
                            if (dep.length < 1) {
                                tPrems=100
                                upDoc.premium=tPrems
                                upDoc.save()
                                
                            } //has 2 or less dependents
                            else if (dep.length < 3) {
                                tPrems = 100 + (dep.length * 75);
                                upDoc.premium=tPrems
                                upDoc.save()
                            }
                            else {
                                tPrems = 100 + (dep.length * 50);
                                upDoc.premium=tPrems
                                upDoc.save()
                            }
    
                        })
                       
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
       

    }

    //updates membership status
    var setStatus=()=>{
        try {
            Member.find({premium:{$lt:200}}).then(function(doc,error){
                for (const obj of doc) {
                    obj.membershipStatus="ACTIVE"
                    obj.save()
                }
            })
            Member.find({premium:{$gte:200}}).then(function(doc,error){
                for (const obj of doc) {
                    obj.membershipStatus="PENDING"
                    obj.save()
                }
            })
        } catch (error) {
            console.log(error);
        }
        
       
    }
   

    //get all members
    var getMembers=()=>{
        //exclude dependent object & postal address
        var response=Member.find({});
        return {response};
    }
   
    return{
        Dependent:Dependent,
        Member: Member,
        getMembers:getMembers,
        premium:premium,
        register:register,
        registerDependent:registerDependent
        
    }
}