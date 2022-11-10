

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
             
                    alertObj.innerHTML=`<div  class=" alert alert-info">${data.msg}</div>`
               
            },
            error:function(){
                console.log('error occured');
            }
        });
    });
});