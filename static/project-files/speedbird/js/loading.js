
var g_stageW = 640;
var g_stageH = 320;

var GAME_VERSION = "1.01s";
var DEBUG = false;
var AUTOCONNECT = false;
var fakeLagg = 0;
var fakeLoss = 0;

var isMobile = false;

var g_stageW = 640;
var g_stageH = 320;

var done_cnt = 0;
    
function debug_msg(m) {
    if(DEBUG) {
        console.log(m);
    }
}

var SCRIPTS = [
    "js/lib/crafty-min0.6.2.js",
    "js/lib/Box2dWeb-2.1.a.3.js",
    "js/lib/box2d.js",
    "js/dyn_html.js",
    "js/custom_draw.js",
    "js/player_hud.js",
    "js/player_c.js",
    "js/user_interface.js",
    "js/track.js",
    "js/game_scene.js",
    "js/gameinit_scene.js"
];

window.onload = function () {

    $.ajaxSetup({ cache: true });   //reload from cache true
    
    getNext();
};

function getNext() {
    debug_msg("get: "+SCRIPTS[done_cnt]);
    $.ajaxSetup({
        cache: false
    });
    $.getScript( SCRIPTS[done_cnt] )
      .done(function( script, textStatus ) {
        //debug_msg( textStatus );
        done_cnt++;
        if(done_cnt >= SCRIPTS.length) {    //Loaded all scripts
            progress( done_cnt/(SCRIPTS.length+IMAGES.length)*100, $('#progressBar'));
            loadingFinished();
        }
        else {  
            progress( done_cnt/(SCRIPTS.length+IMAGES.length)*100, $('#progressBar'));
            getNext();
        }
      })
      .fail(function( jqxhr, settings, exception ) {
        done_cnt++;
        if(done_cnt >= SCRIPTS.length)
            loadingFinished();
        else
            getNext();
        debug_msg( "Triggered ajaxError handler." );
    });    
}

function progress(percent, $element) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').css( "width", progressBarWidth+"px" );
            //.html("<span style='color: black;'>"+ percent + "</span>%&nbsp;");
}


var img_done_cnt = 0;
var IMAGES = [
    "img/sprites0.png",
    "img/bg0.png",
    "img/ui.png",
    "img/touch.png"
];

function getNextImg() {
        debug_msg("get_img: "+IMAGES[img_done_cnt]);
    $('<img></img>').attr('src', IMAGES[img_done_cnt])
        .load(function( response, status, xhr ) {
            if ( status == "error" )
                debug_msg("Error loading image: "+img_done_cnt);
            img_done_cnt++;
            progress( (done_cnt+img_done_cnt)/(SCRIPTS.length+IMAGES.length)*100, $('#progressBar'));
            if( img_done_cnt >= IMAGES.length)
                setTimeout( loadingFinishedImg, 250);
            else
                getNextImg();
        });
}

function loadingFinished() {
    getNextImg();
}

function loadingFinishedImg() {

    removeLoadingHtml();

    username = "Player";
    isHost = true;

    gameInit();

}

var Background;

function gameInit() {
    
    createGameHtml();

    setTimeout(
       function() {
            if( Crafty.mobile ) {
                isMobile = true;
                Crafty.mobile = false;  //prevents fullscreen on mobile
            }
            Crafty.init(g_stageW, g_stageH);
            Background = new CBackground();
            Crafty.canvas.init();
            var gx=0;
            var gy=9.8;
            var ptm_ratio=32;
            var doSleep=true;
            Crafty.box2D.init(gx, gy, ptm_ratio, doSleep);
            //Crafty.background("#eee");

            Crafty.scene("GameInit");  
    }, 10);
    
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}
