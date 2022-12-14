

$(document).ready(function(){
    $('.ajaxForm').on('submit',(e)=>{
        e.preventDefault();
        var form=$('.ajaxForm')
        var action = form.attr('action');
        var alertObj=document.getElementById('alert');
        var btn=document.getElementById('send');
        //check this out
        var formdata=form.serialize()
        console.log(formdata);
        $.ajax({
            url:action,
            type:'POST',
            data:formdata,
            beforeSend:function() {
                btn.innerText='Loading...'
            },
            complete:function() {
                btn.innerText='Register'
            },
            success:(data)=>{
                if(!data.success){
                    alertObj.innerHTML=`<div id="alert" class=" alert alert-danger">${data.msg}</div>`
                }else{
                    alertObj.innerHTML=`<div id="alert" class=" alert alert-success">${data.msg}</div>`

                 //redirecting from here
                 //window.location.href='/members'
                }
               
            },
            error:function(){
                alertObj.innerHTML=`<div id="alert" class=" alert alert-danger">Error occured</div>`
                console.log('error occured');
            }
        });
    });
});