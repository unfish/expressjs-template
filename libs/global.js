var randomWords = [
    "Stop being who you were and become who you are."
    ,"Victory is won not in miles but in inches. Win a little now, hold your ground, and later, win a little more."
    ,"Victory is won not in miles but in inches. Win a little now, hold your ground, and later, win a little more."
    ,"Chance favors the prepared mind."
    ,"In the battle of existence, talent is the punch; tact is the clever footwork."
    ,"Change is not merely necessary to life – it is life."
    ,"Be not forward, but friendly and courteous; the first to salute, hear and answer; and be not pensive when it is time to converse."
    ,"So many of our dreams at first seem impossible, then they seem improbable, and then, when we summon the will, they soon become inevitable."
    ,"The first step to getting the things you want out of life is this: Decide what you want."
    ,"Achievement is largely the product of steadily raising one’s level of aspiration and expectation."
    ,"One-half of life is luck; the other half is discipline – and that’s the important half, for without discipline you wouldn’t know what to do with luck."
    ,"Everything comes to him who hustles while he waits."
    ,"Failure is the condiment that gives success its flavor."
    ,"It is a characteristic of wisdom not to do desperate things."
    ,"He who lives without discipline dies without honor."
    ,"Hope never abandons you, you abandon it."
    ,"You can’t be brave if you’ve only had wonderful things happen to you."
    ,"Don’t tell me how hard you work. Tell me how much you get done."
    ,"A mind, like a home, is furnished by its owner, so if one’s life is cold and bare, he can blame none but himself."
    ,"You may be disappointed if you fail, but you are doomed if you don’t try."
    ,"Celebrate what you’ve accomplished, but raise the bar a little higher each time you succeed."
    ,"It matters not what you are thought to be, but what you are."
    ,"There are no regrets in life, just lessons"
    ,"Life is a series of commas, not periods."
    ,"Change, like sunshine, can be a friend or a foe, a blessing or a curse, a dawn or a dusk."
    ,"We can do no great things, only small things with great love."
    ,"If I have seen farther than others, it is because I was standing on the shoulder of giants."
    ,"Life is too short to waste. Dreams are fulfilled only through action, not through endless planning to take action."
    ,"The harder you fall, the higher you bounce."
    ,"Complaining is poverty. Instead of complaining about what’s wrong, be grateful for what’s right."
    ,"People seldom do what they believe in. They do what is convenient, then repent."
    ,"Some people regard discipline as a chore. For me, it is a kind of order that sets me free to fly."
    ,"They always say time changes things, but you actually have to change them yourself."
    ];

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
            ,UsePLUpload:function(fieldName, id, name) {
                return "\
                <script type='text/javascript' src='/javascripts/plupload/plupload.full.min.js'></script>\
                <script type='text/javascript'>\
                    $(function(){\
                        SetupPLUploadJS('"+fieldName+"','"+(id||'')+"','"+(name||'')+"');\
                    });\
                </script>";}
            ,GetRandomWords:function() {
                var vNum = Math.random();
                vNum = Math.round(vNum*randomWords.length)
                return randomWords[vNum];
            }
        }
    };
}();
