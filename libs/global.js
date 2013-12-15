module.exports = function() {
    return {
        Func:{UseUEditor:function(txtId) {
            return "\
            <script type='text/javascript' src='/javascripts/ueditor/ueditor.config.js'></script>\
            <script type='text/javascript' src='/javascripts/ueditor/ueditor.all.min.js'></script>\
            <script type='text/javascript'>\
                $(function(){\
                    var editor = new UE.ui.Editor();\
                    editor.render('"+txtId+"');\
                    editor.addListener('contentchange',function(){\
                        this.sync('"+txtId+"');\
                    });\
                });\
            </script>";}
            ,UsePLUpload:function(fieldName, defaultValue) {
                return "\
                <script type='text/javascript' src='/javascripts/plupload/plupload.full.min.js'></script>\
                <script type='text/javascript'>\
                    $(function(){\
                        SetupPLUploadJS('"+fieldName+"','"+(defaultValue||'')+"');\
                    });\
                </script>";
            }}
    };
}();