
var viewport_prevx = 0;
var viewport_prevy = 0;

var time_entity;

var Minimap_c;

var LagMeter;


var AndConrols = {
    run_r: false,
    run_jmp_r: false,
    jmp_r: false,
    run_l: false,
    run_jmp_l: false,
    jmp_l: false
};

var AndControlsText = [];

var UI_z = 100;
function createUI( player_color ) {
    
    var elem;
    var UI1_w = 640;
    var UI1_h = 24;
    
    Crafty.sprite( 640, 28, "img/ui.png", {
	UI_panel: [0,0] });
    
    
    elem = Crafty.e("2D, DOM, UI_panel")
            .attr({ x: 0, y: 0, z: UI_z});
            //.color("#5090FF");
    
    var main_panel = elem;
    
    main_panel.attach(loading_bg);
    main_panel.attach(loading_text);
    main_panel.attach(loading_text2);
    
    
    //Mobile controls
    if(isMobile) {
        var panel_w = 200;
        var panel_h = 106;
        var panel_w2 = panel_w/2;
        var panel_h2 = panel_h/2;
        var and_ctrl_z = 90;
        var text_w = 100;
        var text_w2 = text_w/2;
        var text_h = 18;
        var text_h2 = text_h/2;
        var jmp_tr2 = Crafty.e("2D, DOM, Text")
            .textColor("#000000")
            .attr({ x: g_stageW-panel_w2-text_w2+1, y: 2+panel_h2-text_h2+1, w: text_w, h: text_h, z: UI_z })
            .text("Jump")
            .textFont({ size: '18px', family: "Arial"})
            .css( "text-align", "center");
        var run_jmp_tr2 = Crafty.e("2D, DOM, Text")
            .textColor("#000000")
            .attr({ x: g_stageW-panel_w2-text_w2+1, y: 2+panel_h2+panel_h-text_h+1, w: text_w, h: text_h, z: UI_z })
            .text("Run and Jump")
            .textFont({ size: '18px', family: "Arial"})
            .css( "text-align", "center");
        var run_tr2 = Crafty.e("2D, DOM, Text")
            .textColor("#000000")
            .attr({ x: g_stageW-panel_w2-text_w2+1, y: 2+panel_h2+2*panel_h-text_h2+1, w: text_w, h: text_h, z: UI_z })
            .text("Run")
            .textFont({ size: '18px', family: "Arial"})
            .css( "text-align", "center");
    
        var jmp_tr = Crafty.e("2D, DOM, Text")
            .textColor("#FF0000")
            .attr({ x: g_stageW-panel_w2-text_w2, y: 2+panel_h2-text_h2, w: text_w, h: text_h, z: UI_z })
            .text("Jump")
            .textFont({ size: '18px', family: "Arial"})
            .css( "text-align", "center");
        var run_jmp_tr = Crafty.e("2D, DOM, Text")
            .textColor("#FF0000")
            .attr({ x: g_stageW-panel_w2-text_w2, y: 2+panel_h2+panel_h-text_h, w: text_w, h: text_h, z: UI_z })
            .text("Run and Jump")
            .textFont({ size: '18px', family: "Arial"})
            .css( "text-align", "center");
        var run_tr = Crafty.e("2D, DOM, Text")
            .textColor("#FF0000")
            .attr({ x: g_stageW-panel_w2-text_w2, y: 2+panel_h2+2*panel_h-text_h2, w: text_w, h: text_h, z: UI_z })
            .text("Run")
            .textFont({ size: '18px', family: "Arial"})
            .css( "text-align", "center");
    
        var run_tl2 = Crafty.e("2D, DOM, Text")
            .textColor("#000000")
            .attr({ x: panel_w2-text_w2+1, y: g_stageH-38-text_h+1, w: text_w, h: text_h, z: UI_z })
            .text("Run backwards")
            .textFont({ size: '18px', family: "Arial"})
            .css( "text-align", "center");
    
        var run_tl = Crafty.e("2D, DOM, Text")
            .textColor("#FF0000")
            .attr({ x: panel_w2-text_w2, y: g_stageH-38-text_h, w: text_w, h: text_h, z: UI_z })
            .text("Run backwards")
            .textFont({ size: '18px', family: "Arial"})
            .css( "text-align", "center");

            main_panel.attach(run_tr2);
            main_panel.attach(jmp_tr2);
            main_panel.attach(run_jmp_tr2);
            main_panel.attach(run_tr);
            main_panel.attach(jmp_tr);
            main_panel.attach(run_jmp_tr);
            main_panel.attach(run_tl);
            main_panel.attach(run_tl2);

            AndControlsText.push(run_tr2);
            AndControlsText.push(run_tr);
            AndControlsText.push(jmp_tr2);
            AndControlsText.push(jmp_tr);
            AndControlsText.push(run_jmp_tr2);
            AndControlsText.push(run_jmp_tr);
            AndControlsText.push(run_tl2);
            AndControlsText.push(run_tl);
            
        //Jmp Right
        elem = Crafty.e("2D, DOM, Mouse, touch_off")
            .attr({ x: g_stageW-panel_w, y: 2, w: panel_w, h: 106, z: and_ctrl_z})
            .bind("MouseDown", function(mouseEvent) {
                this.sprite( 0, 0);
                AndConrols.jmp_r = true;
            })
            .bind("MouseUp", function(mouseEvent) {
                this.sprite( 0, 1);
                AndConrols.jmp_r = false;
            })
            .bind("MouseOver", function(mouseEvent) {
                this.sprite( 0, 0);
                AndConrols.jmp_r = true;
            })
            .bind("MouseOut", function(mouseEvent) {
                this.sprite( 0, 1);
                AndConrols.jmp_r = false;
            });
        main_panel.attach(elem);

        //Run Jmp Right
        elem = Crafty.e("2D, DOM, Mouse, touch_off")
            .attr({ x: g_stageW-panel_w, y: 108, w: panel_w, h: 106, z: and_ctrl_z})
            .bind("MouseDown", function(mouseEvent) {
                this.sprite( 0, 0);
                AndConrols.run_jmp_r = true;
            })
            .bind("MouseUp", function(mouseEvent) {
                this.sprite( 0, 1);
                AndConrols.run_jmp_r = false;
            })
            .bind("MouseOver", function(mouseEvent) {
                this.sprite( 0, 0);
                AndConrols.run_jmp_r = true;
            })
            .bind("MouseOut", function(mouseEvent) {
                this.sprite( 0, 1);
                AndConrols.run_jmp_r = false;
            });
        main_panel.attach(elem);

        //Run Right
        elem = Crafty.e("2D, DOM, Mouse, touch_off")
            .attr({ x: g_stageW-panel_w, y: 214, w: panel_w, h: 106, z: and_ctrl_z})
            .bind("MouseDown", function(mouseEvent) {
                this.sprite( 0, 0);
                AndConrols.run_r = true;
            })
            .bind("MouseUp", function(mouseEvent) {
                this.sprite( 0, 1);
                AndConrols.run_r = false;
            })
            .bind("MouseOver", function(mouseEvent) {
                this.sprite( 0, 0);
                AndConrols.run_r = true;
            })
            .bind("MouseOut", function(mouseEvent) {
                this.sprite( 0, 1);
                AndConrols.run_r = false;
            });
        main_panel.attach(elem);

        //Jmp Left
        elem = Crafty.e("2D, DOM, Mouse")
            .attr({ x: 0, y: 2, w: panel_w, h: 106, z: and_ctrl_z})
            .bind("MouseDown", function(mouseEvent) {
                //this.sprite( 0, 0);
                AndConrols.jmp_l = true;
            })
            .bind("MouseUp", function(mouseEvent) {
                //this.sprite( 0, 1);
                AndConrols.jmp_l = false;
            })
            .bind("MouseOver", function(mouseEvent) {
                //this.sprite( 0, 0);
                AndConrols.jmp_l = true;
            })
            .bind("MouseOut", function(mouseEvent) {
                //this.sprite( 0, 1);
                AndConrols.jmp_l = false;
            });
        main_panel.attach(elem);

        //Run Jmp Left
        elem = Crafty.e("2D, DOM, Mouse")
            .attr({ x: 0, y: 108, w: panel_w, h: 106, z: and_ctrl_z})
            .bind("MouseDown", function(mouseEvent) {
                //this.sprite( 0, 0);
                AndConrols.run_jmp_l = true;
            })
            .bind("MouseUp", function(mouseEvent) {
                //this.sprite( 0, 1);
                AndConrols.run_jmp_l = false;
            })
            .bind("MouseOver", function(mouseEvent) {
                //this.sprite( 0, 0);
                AndConrols.run_jmp_l = true;
            })
            .bind("MouseOut", function(mouseEvent) {
                //this.sprite( 0, 1);
                AndConrols.run_jmp_l = false;
            });
        main_panel.attach(elem);

        //Run Left
        elem = Crafty.e("2D, DOM, Mouse")
            .attr({ x: 0, y: 214, w: panel_w, h: 106, z: and_ctrl_z})
            .bind("MouseDown", function(mouseEvent) {
                //this.sprite( 0, 0);
                AndConrols.run_l = true;
            })
            .bind("MouseUp", function(mouseEvent) {
                //this.sprite( 0, 1);
                AndConrols.run_l = false;
            })
            .bind("MouseOver", function(mouseEvent) {
                //this.sprite( 0, 0);
                AndConrols.run_l = true;
            })
            .bind("MouseOut", function(mouseEvent) {
                //this.sprite( 0, 1);
                AndConrols.run_l = false;
            });
        main_panel.attach(elem);
            
        //Run Left(Backwards) Decoration Top
        elem = Crafty.e("2D, DOM, Mouse, touch_off_top")
            .attr({ x: 0, y: g_stageH-70, w: panel_w, h: 53, z: and_ctrl_z});
        main_panel.attach(elem);
        AndControlsText.push(elem);
        
        //Run Left(Backwards) Decoration Bottom
        elem = Crafty.e("2D, DOM, Mouse, touch_off_bottom")
            .attr({ x: 0, y: 214+53, w: panel_w, h: 53, z: and_ctrl_z});
        main_panel.attach(elem);
        AndControlsText.push(elem);
    
   }   //End of if( isMobile)
    
    

    time_entity = Crafty.e("2D, DOM, Text")
        .attr({ x: 16, y: 3, w: 200, h: UI1_h, z: UI_z })
        .textColor("#eeeeee")
        .textFont({ size: '14px', weight: 'bold', family: "Lato"}) 
        .text( GameTimer.getString() );
    main_panel.attach(time_entity);

    elem = Crafty.e("2D, DOM, Color")
            .attr({ x: g_stageW*0.17+2, y: 0, w: 8, h: UI1_h, z: UI_z })
            .color("#222222");
    main_panel.attach(elem);

    elem = Crafty.e("2D, DOM, Color")
            .attr({ x: g_stageW*0.17, y: 0, w: 8, h: UI1_h, z: UI_z })
            .color(player_color);
    main_panel.attach(elem);

    elem = Crafty.e("2D, DOM, Text")
        .attr({ x: g_stageW*0.2+1, y: 1+1, w: 200, h: UI1_h, z: UI_z })
        .textColor("#222222")
        .textFont({ size: '16px', weight: 'bold', family: "Lato"}) 
        //.textFont({ size: '14px', weight: 'bold' })
        .text(username.substring(0, 15));
    main_panel.attach(elem);
  
    elem = Crafty.e("2D, DOM, Text")
        .attr({ x: g_stageW*0.2, y: 1, w: 200, h: UI1_h, z: UI_z })
        .textColor(player_color)
        .textFont({ size: '16px', weight: 'bold', family: "Lato"}) 
        //.textFont({ size: '14px', weight: 'bold' })
        .text(username.substring(0, 15));
    main_panel.attach(elem);

    
    if( isHost) {
        pause_text = Crafty.e("2D, DOM, Text")
            .attr({ x: g_stageW/2-175, y: 45, w: 350, h: 35, z: UI_z, alpha: 0.0})
            .textColor("#FF0000")
            .text("Game paused due to lagg.")
            .textFont({ size: '20px', family: "Arial"})
            .css( "text-align", "center");
        main_panel.attach(pause_text);
    }

    Minimap_c = Crafty.e("Minimap");
    Minimap_c.attr({ x: g_stageW*0.46, y: 3, w: g_stageW*0.5, h: 16, z: UI_z });
    main_panel.attach(Minimap_c);

    Crafty.bind("AdjustUI", function() {
        if( main_panel.x != -Crafty.viewport.x )
            main_panel.x = -Crafty.viewport.x;
    });
    
    return main_panel;
}


    var cnt1=0;
    var cnt2=0;
    var fps_text;
function showFPS() {

    Crafty.bind("EnterFrame", function() {
	cnt1++;
    });
    
    Crafty.bind("RenderScene", function () {
        cnt2++;
    });
    
    fps_text = Crafty.e("2D, DOM, Text")
        .attr({ x: 5, y: g_stageH-16, w: 150, h: 20 })
        .textColor("#FFFFFF")
        .textFont({ size: '10px', weight: 'bold' });
    if(DEBUG)
        fps_text.text("Frame: __" + " |Draw: __");

    UI_panel.attach(fps_text);
        
    Crafty.e("Delay").delay(function() {
        if(DEBUG)
            fps_text.text("Frame: " + cnt1 + " |Draw: " + cnt2);
        cnt1=0;
        cnt2=0;
    }, 1000, -1);
}


function CStopwatch() {
    this.start_t = null;
    this.stop_t = null;
    this.running = false;

    this.max_t = 990 + 59*1000 + 99*60*1000;
}

CStopwatch.prototype.start = function() {
    this.start_t = new Date();
    this.running = true;
}

CStopwatch.prototype.stop = function() {
    this.stop_t = new Date();
    this.running = false;
}

CStopwatch.prototype.getTime = function() {
    if(this.start_t == null)
        return 0.0;
    else {
        if(this.running == true) {
            var cur_t = new Date();
            var diff_t = cur_t - this.start_t;
            return diff_t;
        } else {
            if( this.stop_t != null) {
                var diff_t = this.stop_t-this.start_t;
                return diff_t;
            } else return 0.0;
        }
    }
        
}

CStopwatch.prototype.getString = function() {
    var cur_t = this.getTime();
    
    if( cur_t > this.max_t )
        cur_t = this.max_t;

    var msec = Math.floor((cur_t/10)%100);
    var sec = Math.floor((cur_t/1000)%60);
    var min = Math.floor(cur_t/60000);
    
    if(msec < 10)
        msec = "0" + msec;
    if(sec < 10)
        sec = "0" + sec;
    if(min < 10)
        min = "0" + min;

    return ""+min+":"+sec+":"+msec;
}

Crafty.c("Minimap", {
   init: function() {
       this.addComponent("2D, DOM, Color");
       //this.alpha = 0.5;
       this.color("#B2CFFF");
       //this.color("#FFFFFF");
       this.css({
            "border-style" : "solid",
            "border-color" : "#000000",
            "border-width" : "1px"
       });
       
       this.units = [];
       var e;
       for( var i=0; i<players.length; i++) {
           e = Crafty.e("2D, DOM, Color")
                    .attr({ w: 3, h: 3, z: UI_z}) //alpha: 0.8
                    //.attr({ w: 1, h: 15, alpha: 0.75})
                   .color(players[i].color);
                    /*
                    .css({
                        "border-style" : "solid",
                        "border-color" : "#FFFFFF",
                        "border-width" : "1px"
                    });
                    */
           this.units.push(e);
       }
   },
   update: function() {
       var w = this.units[0].w/2;
       for( var i=0; i<players.length && i<this.units.length; i++) {
           //set positions
           var _x = (players[i].x/Track.finish_x)*this.w;
           if( _x < w ) _x = w;
           if( _x > this.w-w ) _x = this.w-w;
           _x += this.x;
           
           var _y = (players[i].y/g_stageH)*this.h;
           
           if( _y > this.h-w ) _y = this.h-w;
           if( _y < w) _y = w;
           _y += this.y;
               
           this.units[i].attr({ x: _x, y: _y});   //this.y+1
       }
   }
});
