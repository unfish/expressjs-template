module.exports =  {
        Resp:function (result, err) {
        	if(err){
        		return {success:false,  code:-1, error:err};
        	}else{
        		return {success:true,  code:0, result:result};
        	}
        }
    };