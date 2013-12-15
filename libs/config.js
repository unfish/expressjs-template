module.exports = function() {
    return {
        Site:{Title:"Unfish's Demo Site"
            ,Keywords:"CRM,模板,Template,Node.js,Express,Jade,Mongoose"
            ,Description:"这是一个简单的CRM系统模板，基于Nodejs+Express+Mongoose，你可以在此基础上方便的开发出自己的网站系统"
            ,Author:"Unfish"
        }
        ,DB:{DataDB:'mongodb://localhost/DataDB'
            ,FileDB:'mongodb://localhost/FileDB'
            ,LogDB:'mongodb://localhost/LogDB'
        }
    };
}();