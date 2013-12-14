$(function(){
    $('.timeSpan').each(function(){$(this).html(moment($(this).html()).format('YYYY-MM-DD HH:mm'));});
    $('.bs-sidenav>li>a').on('click',function(){
        $(this).next().slideToggle('fast');
    });
});