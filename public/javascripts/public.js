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

function SetupPLUploadJS(field, value) {
    $('#'+field+' input').replaceWith('<span id="'+field+'Span" style="display:none;"></span><input type="hidden" name="'+field+'" id="'+field+'Field" value="'+value+'"/><img id="'+field+'Image" style="width:200px;height:auto;"'+(value?' src="/file/'+value+'"':'')+'/><a id="'+field+'Btn" class="btn btn-primary" href="#" style="display:inline-block;">上传文件</a>');
    
    var uploader = new plupload.Uploader({        runtimes : 'html5,flash',        browse_button : field+'Btn',        container : 'thumb',        max_file_size : '2mb',        url: '/file',        flash_swf_url : '/javascripts/plupload/Moxie.swf',        filters : [            { title: "图片文件", extensions: "jpg,gif,png" }        ]    });    uploader.init();    uploader.bind('FilesAdded', function(up, files) {        $.each(files, function(i, file) {            $('#'+field+'Span').html(file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>').show();        });        up.refresh();        uploader.start();    });    uploader.bind('UploadProgress', function(up, file) {        $('#'+field+'Span b').html(file.percent + "%");    });        uploader.bind('Error', function(up, err) {        $('#'+field+'Span').html("错误: " + err.code + ", 内容: " + err.message + (err.file ? ", 文件: " + err.file.name : ""));        up.refresh();    });        uploader.bind('FileUploaded', function(up, file, resp) {        $('#'+field+'Span').hide();            
        $('#'+field+'Field').val(resp.response);        $('#'+field+'Image').attr('src','/file/'+resp.response).show();    });
}