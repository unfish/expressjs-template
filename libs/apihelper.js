module.exports =  {
        Resp:function (result, err) {
        	if(err){
        	    if(err.name === 'ValidationError'){
        	        var e = {};
        	        for(var k in err.errors){
        	            e[k] = err.errors[k].message;
        	        }
        	        return {success:false,  code:-1, error:e};
        	    }else{
        		    return {success:false,  code:-1, error:err};
        		}
        	}else{
        		return {success:true,  code:0, result:result};
        	}
        }
    };