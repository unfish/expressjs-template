function ajaxError( jqXHR, textStatus, errorThrown ) {
    alert( "服务器连接失败，"+errorThrown.message );
}

function SubmitForm(url, form, btn, callback) {
    var btnTitle = $(btn).html();
    $(btn).html('请稍候...').attr('disabled','disabled');
    $('#'+form+' span.error-block').hide();
    $('#'+form+' div.input-group').removeClass('has-error');
    $.post(url, $('#'+form).serialize(), function (json) {
    	if(json.success){
            callback(json.data);
    	}else{
    		for(var k in json.data){
    		    if (k=='error') {
    		        $(btn).next().html(json.data[k]).show();
    		    }else{
        		    $('#'+k).addClass('has-error');
        		    if (json.data[k].hasOwnProperty('message')) {
        		        $('#'+k).next().html(json.data[k]['message']).show();
        		    }else{
        		        $('#'+k).next().html(json.data[k]).show();
        		    }
    		    }
    		}
    	}
    }, 'json')
    .fail(ajaxError)
    .always(function() {
        $(btn).html(btnTitle).removeAttr('disabled');
    });
}

function AjaxPost(url, param, btn, callback) {
    var btnTitle = $(btn).html();
    $(btn).html('请稍候...').attr('disabled','disabled');
    $.post(url, param, function (json) {
    	if(json.success){
            callback(json.data);
    	}else{
    		alert(json.data.error);
    	}
    }, 'json')
    .fail(ajaxError)
    .always(function() {
        $(btn).html(btnTitle).removeAttr('disabled');
    });
}