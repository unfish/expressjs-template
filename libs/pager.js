var Pager = function() {}
Pager.GetPager = function (urlbase, res) {
    var items = [];
    items.push('<ul class="pagination pagination-sm pull-right">');
    if(res.prev){
        items.push('<li><a href="'+urlbase.replace('{}',res.prev)+'">&laquo;</a></li>');
    }else{
        items.push('<li class="disabled"><a href="javascript:;">&laquo;</a></li>');
    }
    for(var i in res.pages){
        var p = res.pages[i];
        if(p==res.current){
            items.push('<li class="active"><a href="javascript:;">'+p+'</a></li>');
        }else{
            items.push('<li><a href="'+urlbase.replace('{}',p)+'">'+p+'</a></li>');
        }
    }
    if(res.next){
        items.push('<li><a href="'+urlbase.replace('{}',res.next)+'">&raquo;</a></li>');
    }else{
        items.push('<li class="disabled"><a href="javascript:;">&raquo;</a></li>');
    }
    items.push('</ul>');
    return items.join('');
};

module.exports = Pager;