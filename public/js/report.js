

$(document).ready(function(){
        
     var tableContent=document.getElementById('tableContent');


         $.ajax({

             url:'/members',
             type:'POST',
             beforeSend:function() {
                 tableContent.innerText='Loading...'
             },
             
             success:(data)=>{
               data=JSON.parse(data)
                 if(data.members){
                    var m= data.members
                    var totalPremiums=0;
                    var htmlStr="";
                   
                    for (const e of m) {
                         var dob=splitDate(e)
                         totalPremiums+=e.premium
                       htmlStr+=  ` <tr>
                         <td>${e.firstname||"-"}</td>
                         <td>${e.surname||"-"}</td>
                         <td>${splitDate(e.dateOfBirth)||"-"}</td>
                         <td>${splitDate(e.dateJoined)||"-"}</td>
                         <td>${splitDate(e.benefitDate)||"-"}</td>
                         <td>${e.membershipStatus||"-"}</td>
                         <td>${e.premium || 0}</td>
                         <td>
                         <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#dependentModal" data-bs-depId="${e.membershipNumber}">Add dependent</button>                         
                         </td>
                       </tr>
                      
                       `

                    }
                  let prem=document.getElementById('prems')  
                  prem.innerHTML=` <div class=" col-12 ">
                                   <p> Total Premiums: ${totalPremiums}</p>
                                   <p  > Agent fee: ${totalPremiums*0.05}</p>
                              </div>`
                    tableContent.innerHTML=htmlStr;
                 }else{
                   
                    tableContent.innerText=typeof(data)
                 }
              let modal=document.getElementById("dependentModal");
              modal.addEventListener('show.bs.modal',function(e){
                //button that triggered the modal
                let btn=e.relatedTarget;
                //Extract info from data-bs-* attributes
                let id=btn.getAttribute('data-bs-depId');

                //update dependent membershipNumber field
                let dependentNo=document.getElementById('depId')
                dependentNo.value=id
              });
             },
             error:function(){
                 console.log('error occured');
             }
         });
     
 });

 //extract date part and leave out time 
 function splitDate(e){
     try {
          if ('undefined'!=typeof(e)) {
               return  e.split('T')[0]
          }
             
     } catch (error) {
          console.log (error)
     }
    
     return '-'
 }


 