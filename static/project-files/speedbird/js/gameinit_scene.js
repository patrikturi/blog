var loading_bg;
var loading_text;
var loading_text2;
var temp_text;

var assets_ready = false;

var loading = true;

function loadingScreen() {
    loading_bg = Crafty.e("2D, DOM")
            .attr({ x: 0, y: 0, z: 1000, w: g_stageW, h: g_stageH})
            .css( 'background', 'repeating-linear-gradient( 45deg, #F4FA58, #F4FA58 10px, #848484 10px, #848484 20px)');
    
    var text_w = 500;
    var text_h = 30;
    loading_text2 = Crafty.e("2D, DOM, Text").attr({w: text_w, h: text_h, z: 1001, x: g_stageW/2-text_w/2+1, y: g_stageH/2-text_h/2+1})
            .text("Initializing game...")
            .textColor("#FFFFFF")
            .textFont({ size: '22px', weight: 'bold', family: 'Open Sans' })
            .css({"text-align": "center"})
            .unselectable();

    loading_text = Crafty.e("2D, DOM, Text").attr({w: text_w, h: text_h, z: 1001, x: g_stageW/2-text_w/2, y: g_stageH/2-text_h/2})
            .text("Initializing game...")
            .textColor("#000000")
            .textFont({ size: '22px', weight: 'bold', family: 'Open Sans' })
            .css({"text-align": "center"})
            .unselectable();
    
    temp_text = Crafty.e("2D, DOM, Text")
        .attr({ x: 0, y: 0, w: 200, h: 50, alpha: 0.0 })
        .textFont({ size: '14px', weight: 'bold', family: "Lato"}) 
        .text( 'Pre' );
}

function removeLoadingScreen() {
    loading_text.destroy();
    loading_text2.destroy();
    loading_bg.destroy();
    temp_text.destroy();
}

var cur_task_init = 0;
function nextTaskGameInit() {
    setTimeout( function() {
        if(cur_task_init == 0) {
            Track = new CTrack(90);
            Track.genData();
        } else if(cur_task_init==1) {
            Obj = new CObstacles(Track.finish_x);
            Obj.genData();
            avg_ping = 80;
        }

        if(cur_task_init==2) {
            netState = "Loading";
        } else {
            cur_task_init++;
            nextTaskGameInit();
        }
        
    }, 50);
}

Crafty.scene("GameInit", function() {
    
    loadingScreen();
    
    if(isHost)
        debug_msg("I'm the HOST.");
    else
        debug_msg("I'm a PEER.");
    
    Crafty.load([
        "img/bg0.png", 
        "img/sprites0.png", 
        "img/ui.png",
        "img/touch.png"
    ],
        function() {
            //when loaded
            assets_ready = true;
            debug_msg("Assets read");
        },
        function(e) {
        },
        function(e) {
            debug_msg("Error loading assets.");
        }
    );

    netState="wait";
    Crafty.trigger("RenderScene");
    
    nextTaskGameInit();
    
    var check_rdy = Crafty.e("Delay");
    check_rdy.delay( function() {
            if(assets_ready && netState == "Loading") {
                check_rdy.destroy();
                Crafty.scene("Game");
            }
    }, 100, -1);
    
    },
    function() {
        removeLoadingScreen();
});
