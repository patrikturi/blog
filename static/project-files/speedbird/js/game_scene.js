
var controls_p1 = {
    LEFT: Crafty.keys.A,
    RIGHT: Crafty.keys.D,
    JUMP: Crafty.keys.W,
    SHAKE: Crafty.keys.F
};

var controls_p2 = {
    LEFT: Crafty.keys.LEFT_ARROW,
    RIGHT: Crafty.keys.RIGHT_ARROW,
    JUMP: Crafty.keys.UP_ARROW,
    SHAKE: Crafty.keys.NUMPAD_0
};

var WAIT_AT_START = 0;

var Game;
var custom_draw;
var game_draw = false;
var player_won = null;
var UI_panel;
var p1;
var p2;
var primary_player;
var players = [];

var dyn_bodies = [];

var Track;
var Obj;

var GameTimer = new CStopwatch();

var Keyboard;
//debug toggle cooldown
var toggle_cooldown = true;

//This is the playable minigame
Crafty.scene("Game", function() {
    
    Game = new CGame();
    
    loadingScreen();

    Crafty.background("#eee");
    
    Keyboard = Crafty.e("Keyboard");

    //setup custom drawing
    //custom_draw = new CustomDraw( Crafty.canvas.context, Crafty.box2D.PTM_RATIO);

    //var DEBUG_DRAW = true;

    //if(!DEBUG_DRAW)
     //   Crafty.box2D.initDrawing();
    //else
     //   Crafty.box2D.initDebugDraw();
    
    //Add crafty sprites
    Crafty.sprite( 28, "img/sprites0.png", {
	player_right: [3,0],
        player_left: [3,1],
        finish_line: [8,0,1,5]
    });
    
    Crafty.sprite( 200, 106, "img/touch.png", {
	touch_on: [0,0],
        touch_off: [0,1]
    });
    
    Crafty.sprite( 200, 53, "img/touch.png", {
        touch_on_top: [0,0],
        touch_on_bottom: [0,1],
        touch_off_top: [0,2],
        touch_off_bottom: [0,3]
    });
    
    //Menu blue: 008FD5
    var color1 = "#FF0000";
    var color2 = "#FAED00";
    var p1_color;
    var p2_color;
    
    //Make host always be color1


    p1_color = color1;  //host
    
    //Set up players
    var p1_primary = false;
    var p2_primary = false;

    p1_primary = true;

    var player1 = Crafty.e("Player").param( 50, 200-28, 1, p1_color, p1_primary, controls_p1);

    primary_player = player1;

    p1 = player1;

    players.push(player1);

    dyn_bodies.push(player1.body);

    initContactListener(players);
    

    UI_panel = createUI(p1_color);
    
    var finish_x = Track.finish_x;
    Track.create();
    Obj.create();

    showFPS();
    
    if(isHost) {
        setInterval( function() {
            var obj = [];
            var e;
            for(var i=0; i<players.length; i++) {
                e = { i: i, e: players[i].energy_bar.val };
                obj.push(e);
            }
        }, 500 );
    }
    
    Crafty.bind("RenderScene", function() {
       time_entity.text( GameTimer.getString() );

        Background.draw();
    });
       

    var xbound_max = 260;
    var xbound_min = 100;
    var viewportx;
    
    Crafty.box2D.world.viewportx = 0;
    Crafty.box2D.world.viewporty = 0;
    
    //Adjust viewports and UI position
    Crafty.bind("AdjustViewport", function() {
        
        var player_x = Math.round(primary_player.x);
        
       if( player_x >= 0 ) {
           viewportx = (-1)*Crafty.viewport.x;
           if( viewportx < player_x-xbound_max )
               Crafty.viewport.x = -(player_x-xbound_max);
           if( viewportx > player_x-xbound_min )
               Crafty.viewport.x = -(player_x-xbound_min);
       } else {

       }
       
    }); //End of bind "EnterFrame"


    setCountdownData( 50+50, 200-25, players);

    nextTask();
    
}); //End of Crafty.scene

function bindEnterframe() {
    Crafty.bind("EnterFrame", function() {
        
        Game.step();

        for( var j=0; j<players.length; j++)
            players[j].trigger("Step");
        Crafty.trigger("StepWorld");
        
        //Watch finish line for winner
        for( var i=0; i<players.length; i++) {
            if( players[i].x >= Track.finish_x-players[i].w ) {
                if( players[i].finished === false) {
                    //If the game is still running
                    //For host only -> determine winner
                    if( isHost && player_won === null && game_draw === false) {
                        //check for draw
                        for(var k=0; k<players[i].length; k++) {
                            if( players[k].x >= Track.finish_x-players[i].w && k != i ) {
                                gameDraw(players[i]);
                                continue;
                            }
                        }
                        if(game_draw === false)
                        gameWin(players[i]);
                    }
                    //For host and peer too:
                    //disable controls
                    if(players[i].primary)
                        GameTimer.stop();
                    players[i].finished = true;
                    players[i].controls_on = false; //disable controls
                }
            }
        }

        Crafty.trigger("AdjustViewport");
        Crafty.trigger("AdjustUI");
        
        Crafty.trigger("AdjustHUD");
        
        Minimap_c.update();

        if( toggle_cooldown && Keyboard.isDown(Crafty.keys.B && Crafty.keys.N && Crafty.keys.M) ) {
            DEBUG = !DEBUG;
            toggle_cooldown = false;
            setTimeout( function() { toggle_cooldown = true; }, 1000);
        }

    }); //End of bind "EnterFrame"
}

var cur_task = 0;
function nextTask() {
    setTimeout( function() {
        if(cur_task == 0) {
            //Step the world until boxes fall down
            for( var i=0; i<100; i++) {
                Crafty.box2D.world.Step(
                        1.0 / 50.0   //frame-rate
                     ,  8       //velocity iterations
                     ,  3       //position iterations
                );        
            }
        } else if(cur_task==1) {
            for( var i=0; i<100; i++) {
                Crafty.box2D.world.Step(
                        1.0 / 50.0   //frame-rate
                     ,  8       //velocity iterations
                     ,  3       //position iterations
                );        
            }
        } else if(cur_task==2) {
            for( var i=0; i<100; i++) {
                Crafty.box2D.world.Step(
                        1.0 / 50.0   //frame-rate
                     ,  8       //velocity iterations
                     ,  3       //position iterations
                );        
            }
        }

        if(cur_task==3) {
            var b;
            for(var k=0; k<dyn_bodies.length; k++) {
                b = dyn_bodies[k];
                var sprite = b.GetUserData();
                if (sprite) {
                    sprite.attr(
                        {
                            x: b.GetPosition().x * Crafty.box2D.PTM_RATIO,
                            y: b.GetPosition().y * Crafty.box2D.PTM_RATIO
                        } );
                    sprite.rotation = Crafty.math.radToDeg(b.GetAngle());
                }        
            }
            var next_state = Crafty.e("Delay").delay( function() {
                subState = "done";
                bindEnterframe();
                removeLoadingScreen();

                showCover();

            }, 100, 0);
        } else {
            cur_task++;
            nextTask();
        }
        
    }, 50);
}

function showCover() {

    var tw = 500;
    var th = 100;
    var text = "Click to play";
    var text_shadow = Crafty.e("2D, DOM, Text")
    .text(text)
    .textColor("#FFFFFF")
    .textFont({ size: '30px', weight: 'bold', family: "Lato" })
    .attr({ x: g_stageW/2-tw/2+(-1)*Crafty.viewport.x+1 -50, y: 55+(-1)*Crafty.viewport.y+1, w: tw, h: th, z: 1001})
    .css( "text-align", "center");
    var text_component = Crafty.e("2D, DOM, Text")
    .text(text)
    .textColor("#000000")
    .textFont({ size: '30px', weight: 'bold', family: "Lato" })
    .attr({ x: g_stageW/2-tw/2+(-1)*Crafty.viewport.x -50, y: 55+(-1)*Crafty.viewport.y, w: tw, h: th, z:1002})
    .css( "text-align", "center");
    var StartCover = Crafty.e("2D, DOM, Color, Mouse")
    .attr({ x: -50, y: 0, z: 1000, w: g_stageW, h: g_stageH})
    .color('#F0E68CBB');
    StartCover.bind('Click', function(MouseEvent){
        text_component.destroy();
        text_shadow.destroy();
        StartCover.destroy();
        startCountdown(WAIT_AT_START);
    });
}

function showWinText(win_text) {
    var tw = 500;
    var th = 100;
    var text_s = Crafty.e("2D, DOM, Text")
            .text(win_text)
            .textColor("#000000")
            .textFont({ size: '30px', weight: 'bold', family: "Lato" })
            .attr({ x: g_stageW/2-tw/2+(-1)*Crafty.viewport.x+1, y: 55+(-1)*Crafty.viewport.y+1, w: tw, h: th})
            .css( "text-align", "center");
    
    var text = Crafty.e("2D, DOM, Text")
            .text(win_text)
            .textColor("#00ff00")
            .textFont({ size: '30px', weight: 'bold', family: "Lato" })
            .attr({ x: g_stageW/2-tw/2+(-1)*Crafty.viewport.x, y: 55+(-1)*Crafty.viewport.y, w: tw, h: th})
            .css( "text-align", "center");
    
    UI_panel.attach(text_s);
    UI_panel.attach(text);
}

function gameWin(player) {
    var win_text;
    if(player.primary) {
        win_text = "Reload to play again";
    } else {
        win_text = "You lost!";
    }
    
    showWinText(win_text);
    player_won = player;
}

function gameDraw(player) {
    game_draw = true;
    var win_text = "The game has ended in a draw!";
    
    showWinText(win_text);
}


function floatText( posx, posy, text, delay_t) {
    var hnd = setTimeout(function() {
        Crafty.e("2D, DOM, Text, Tween")
            .attr({ x: posx+2, y: posy+2, w: 50, h:30, alpha: 1.0})
            .textColor("#FFFFFF")
            .textFont({ size: '20px', weight: 'bold', family: "Arial" })
            .text(text)
            .tween({ alpha: 0.0, y: posy-125+2}, 2000)
            .bind("TweenEnd", function() {
                this.destroy();
            });
        Crafty.e("2D, DOM, Text, Tween")
            .attr({ x: posx, y: posy, w: 50, h:30, alpha: 1.0})
            .textColor("#000000")
            .textFont({ size: '20px', weight: 'bold', family: "Arial" })
            .text(text)
            .tween({ alpha: 0.0, y: posy-125}, 2000)
            .bind("TweenEnd", function() {
                this.destroy();
            });
    }, delay_t);
    
    return hnd;
}

var cd_posx, cd_posy, cd_players;
var cd_handlers = [];
function setCountdownData( posx, posy, players) {
    cd_posx = posx;
    cd_posy = posy;
    cd_players = players;
}
function startCountdown( delay_t ) {
    
    var h;
    h = floatText( cd_posx, cd_posy, "3", delay_t);
    cd_handlers.push(h);
    h = floatText( cd_posx, cd_posy, "2", delay_t+1000);
    h = cd_handlers.push(h);
    h = floatText( cd_posx, cd_posy, "1", delay_t+2000);
    cd_handlers.push(h);
    h = floatText( cd_posx, cd_posy, "Go!", delay_t+3000);
    cd_handlers.push(h);
    h = setTimeout( function() {
        for( var i=0; i<cd_players.length; i++)
            cd_players[i].controls_on = true;
        GameTimer.start();
        subState = "started";
        //remove labels
        if(isMobile) {
            for( var i=0; i< AndControlsText.length; i++) {
                AndControlsText[i].destroy();
            }
            AndControlsText = [];
        }
    }, delay_t+3000);
    cd_handlers.push(h);
}
function clearCountdown() {
    for( var i=0; i<cd_handlers.length; i++)
        clearTimeout(cd_handlers[i]);
}

function CGame() {
    this.ticks = 0;
}

CGame.prototype.step = function() {
    this.ticks++;
}

CGame.prototype.getTicks = function() {
    return (this.ticks%1000);
}
