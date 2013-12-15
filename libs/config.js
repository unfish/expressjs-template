module.exports = function() {
    return {
        Site:{Title:"Unfish's CRM"
            ,Keywords:"CRM,模板,Node.js,Express,Jade,Mongoose"
            ,Description:"这是一个简单的CRM系统模板"
            ,Author:"Unfish"
        }
        ,DB:{DataDB:'mongodb://localhost/DataDB'
            ,FileDB:'mongodb://localhost/FileDB'
            ,LogDB:'mongodb://localhost/LogDB'
        }
    };
}();