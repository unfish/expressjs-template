var cheerio = require("cheerio");
var sleep = require('sleep');
var async = require('async');
var cheerio = require('cheerio');
var sleep = require('sleep');

var Topic = require('../../models/topic').Topic;
var page = 0;
var finishCallBack;

var startUrl = "http://www.cnbeta.com/more.htm?jsoncallback=jQuery18009726221987511963_1387093008314&type=all&page=1";

module.exports.RunCatch = function(_finishCallBack) {
    finishCallBack = _finishCallBack;
    StartDownload(startUrl);
}
function StartDownload(url) {
    Topic.Download({url:url,headers:{'Referer':'http://www.cnbeta.com/','User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9) AppleWebKit/537.71 (KHTML, like Gecko) Version/7.0 Safari/537.71','X-Requested-With':'XMLHttpRequest'}}, function(err, resp, body) {
        if (!err && body) { ProcessListPage(body); }
        else{finishCallBack();}
    });
}
function ProcessListPage(data) {
//    console.log(data);
    var json = eval(data);
    async.series([
        function(cb) {
            //找到列表，从中取出每一条标题和链接
            async.eachSeries(json.result.list,function(li, callback) {
              var href = 'http://www.cnbeta.com'+li.url_show;
              var title = li.title_show;
              var logo = li.logo;
              var summary = li.hometext_show_short;
              var date = Date.parse(li.time);
              console.log("["+title+"]("+href+")");
              if (href.indexOf('http:')==0) {
                  //检查链接是否抓过，并保存新页面信息
                  Topic.CreateTopic({pattern:'cnbeta_com',source:href,title:title,summary:summary,created_at:date}, function(err, article) {
                              if (article && !article.Content) {
                                  File.findOne({remoteurl:logo}, function(err, file) {
                                    if (file) {
                                        article.thumb = file.id;
                                    }else{
                                        var pos = logo.lastIndexOf('/')+1;
                                        file = new File({filename:logo.substr(pos, logo.length-pos), remoteurl:logo, nolocal:true, user:article.author});
                                        file.save(function(err) {
                                            if(!err) article.thumb = file.id;
                                        });
                                    }
                                  });
                                  //抓取页面的内容
                                  Topic.Download(article.source, function (err, resp, html) {
                                      if(!err && html){
                                          article.FullHtml = html;
                                          ProcessArticle(article, callback);
                                      }else{
                                          console.log(err);
                                          callback();
                                      }
                                  });
                              }else{
                                  console.log(err);
                                  callback();
                              }
                      });
              }else{
                  console.log('Not support: '+href);
                  callback();
              }
            },function (err) {
                cb();
            });
        },function(cb) {
            page ++;
            console.log('Page '+page+' Finished!');
            //取下一页
            if(page>10){ //找不到下一页，跳出队列
                cb();
            }else{
                //找到下一页，递归抓取
                var next = 'http://www.cnbeta.com/more.htm?jsoncallback=jQuery18009726221987511963_1387093008314&type=all&page='+page;
                StartDownload(next);
            }
        }
    ],function(err, results){
        //前一个函数已经结束（运行了某个cb()），退出本进程
        console.log('All Done!');
        finishCallBack();
    });
}

function jQuery18009726221987511963_1387093008314(obj) {
    return obj;
}
//处理单个页面的内容解析
function ProcessArticle(art, callback) {
    if (art.FullHtml) {
        var $ = cheerio.load(art.FullHtml);
        art.content = $.html($('div.introduction p'))+$('div.content').html();
        //分拆各个字段
    }
    art.save();
    //有必要的话，每个页面间隔几秒再抓下一页
    sleep.sleep(1);
    console.log('Finished: '+art.source);
    callback(); //通知进程抓下一条
}
