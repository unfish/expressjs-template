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
    	    if(json.data.hasOwnProperty('errors')){
        		for(var k in json.data.errors){
            		    $('#'+k).addClass('has-error');
            		    $('#'+k).next().html(json.data.errors[k]['message']).show();
        		}
    	    }else if (json.data.hasOwnProperty('error')||json.data.hasOwnProperty('message')) {
    	        $(btn).next().html(json.data.error||json.data.message).show();
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
    	    if (json.data.hasOwnProperty('error')) {
    	        alert(json.data.error);
    	    }else if(json.data.hasOwnProperty('message')){
    		    alert(json.data.message);
    		}else{
    		    alert(json.data);
    		}
    	}
    }, 'json')
    .fail(ajaxError)
    .always(function() {
        $(btn).html(btnTitle).removeAttr('disabled');
    });
}

function SetupPLUploadJS(field, value, name) {
    $('#'+field+' input').replaceWith('<input type="text" class="form-control" style="width:86%" name="'+field+'" id="'+field+'Field" value="'+value+'" readonly="readonly"/><a id="'+field+'Btn" class="btn btn-primary" href="#" style="display:inline-block;">上传文件</a>');
    $('#'+field).next().after('<img id="'+field+'Image" style="width:200px;height:auto;margin-top:2px"'+(value?' src="/file/'+value+'/'+name+'"':'')+'/>');
    
    var uploader = new plupload.Uploader({        runtimes : 'html5,flash',        browse_button : field+'Btn',        container : 'thumb',        max_file_size : '2mb',        url: '/file',        flash_swf_url : '/javascripts/plupload/Moxie.swf',        filters : [            { title: "图片文件", extensions: "jpg,gif,png" }        ]    });    uploader.init();    uploader.bind('FilesAdded', function(up, files) {        $.each(files, function(i, file) {            $('#'+field+'Field').val(file.name + ' (' + plupload.formatSize(file.size) + ')').show();        });        up.refresh();        uploader.start();    });    uploader.bind('UploadProgress', function(up, file) {        $('#'+field+'Field').val(file.name + ' (' + plupload.formatSize(file.size) + ') '+file.percent + "%");    });        uploader.bind('Error', function(up, err) {        $('#'+field+'Field').html("错误: " + err.code + ", 内容: " + err.message + (err.file ? ", 文件: " + err.file.name : ""));        up.refresh();    });        uploader.bind('FileUploaded', function(up, file, resp) {        $('#'+field+'Field').val(resp.response);        $('#'+field+'Image').attr('src','/file/'+resp.response+'/'+file.name).show();    });
}