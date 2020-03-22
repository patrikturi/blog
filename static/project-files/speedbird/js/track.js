
function CObstacles( finish_x) {
    this.x_max = finish_x;
}

CObstacles.prototype.genData = function() {
    
    var new_obj_data = [];
    
    //avg. distance
    var dist = 50;
    //max +/- variance in distance
    var dist_var = 50;
    //current position
    var pos = 325;
    
    //Box param
    var box_size_min = 6;
    var box_size_max = 34;
    
    var box_size;
    
    while(pos < this.x_max) {
        if(Math.random() < 0.5)
            pos += dist - Math.floor((Math.random() * dist_var) + 1);
        else
            pos += dist + Math.floor((Math.random() * dist_var) + 1);
        
        box_size = box_size_min + Math.floor((Math.random() * (box_size_max-box_size_min)) + 1);
        
        new_obj_data.push(pos);
        new_obj_data.push(box_size);
    }
    
    this.obj_data = new_obj_data;
};

CObstacles.prototype.create = function() {
    
    var obj = this.obj_data;
    var pos, box_size;
    
    /*
    var box = Crafty.e("2D, Canvas, Color, Box2D")
        .attr({ x: 125-28, y: 50, w: 40, h: 40})
        .color("brown")
        .box2d({
           bodyType: 'dynamic',
           density : 120,
           friction : 2.5,
           restitution : 0.01
    });
    var box = Crafty.e("2D, Canvas, Color, Box2D")
        .attr({ x: 125+40, y: 50, w: 40, h: 40})
        .color("brown")
        .box2d({
           bodyType: 'dynamic',
           density : 120,
           friction : 2.5,
           restitution : 0.01
    });
    */
    
    var cur_ID = 21;
    for( var i=0; i <  obj.length; i+=2) {
        
        pos = obj[i];
        box_size = obj[i+1];
       // debug_msg("pos "+pos +" size "+box_size);
        
        var box = Crafty.e("2D, Canvas, Box2D")
            .attr({ x: pos, y: 50, w: box_size, h: box_size})
            //.color("black")
            .box2d({
               bodyType: 'dynamic',
               density : 120,
               friction : 2.5,
               restitution : 0.01
            })
            .bind("Draw", function(obj) {
                var ctx = obj.ctx;
                var pos = obj.pos;
                ctx.fillStyle = "#a52a2a";
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo( pos._x+1, pos._y+1);
                ctx.lineTo( pos._x+1, pos._y+pos._h-1);
                ctx.lineTo( pos._x+pos._w-1, pos._y+pos._h-1);
                ctx.lineTo( pos._x+pos._w-1, pos._y+1);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            });
        box.ready = true;
        box.ID = cur_ID;
        
        dyn_bodies.push(box.body);
        /*
        var inner_box = Crafty.e("2D, Canvas, Color")
            .attr({ x: pos+2, y: 50+2, w: box_size-4, h: box_size-4})
            .color("brown");
        
        box.attach(inner_box);
        */
        cur_ID++;
    }

    //Place these to test getting stuck/shaking
    /*
        Crafty.e("2D, Canvas, Color, Box2D")
            .attr({ x: 100, y: 150, w: 32, h: 32})
            .color("brown")
            .box2d({
               bodyType: 'dynamic',
               density : 80,
               friction : 12,
               restitution : 0.01
        });
        
        Crafty.e("2D, Canvas, Color, Box2D")
            .attr({ x: 158, y: 150, w: 32, h: 32})
            .color("brown")
            .box2d({
               bodyType: 'dynamic',
               density : 80,
               friction : 12,
               restitution : 0.01
        });
    */
    
};

function CTrack(length) {
    
    this.length = length;
    
    //Parameters
    this.start_x = 200;     //start of the jump hill
    this.base_x = 300;      //x start pos of random part
    this.base_y = 250;      //y start of the random part
    this.maxy = this.base_y+50;   //min/max height (absolute)
    this.mindy = this.base_y-100;
    this.step_minx = 15;     //step size = min + rand(var)
    this.step_varx = 75;
    this.step_mindy = 0;      //step dy = min +/- rand(vary)
    this.step_vary = 50;
    
}



CTrack.prototype.genData = function() {

    var vertices_n = this.length;
    
    var index, neg, dx, dy;
    var x = this.base_x;
    var new_map_data = [];
    for( index=0; index<vertices_n; index++) {
        dx = this.step_minx + Math.floor((Math.random() * this.step_varx) + 1);
        if( Math.random() < 0.5 )
            neg = -1;
        else
            neg = 1;
        dy = (this.step_mindy + Math.floor((Math.random() * this.step_vary) + 1));
        
        x += dx;
        
        new_map_data.push(dx);
        new_map_data.push(dy);
        new_map_data.push(neg);
    }
    
    x += this.base_x/2;
    this.finish_x = x;
    
    this.map_data = new_map_data;
};

CTrack.prototype.setData = function(data) {
    if( data == null || typeof data == "undefined")
        return;
    this.length = data/3;
    this.map_data = data;
    
    var x = this.base_x;
    for( index=0; index<this.map_data.length; index+=3) {
        x += this.map_data[index];
    }
    
    x += this.base_x/2;
    
    this.finish_x = x;
};


CTrack.prototype.create = function() {

    var max_n = this.map_data.length;
    var map_data = this.map_data;
    
    var track_friction = 1.5;

    var track_color = "#6a7881";//"#757285";
    
    //Left wall
    Crafty.e("2D, Canvas, Box2D")
        .attr({ x: 0, y: 50, w: 0, h: 200})
        .box2d({
           bodyType: 'static',
           density : 10,
           friction : track_friction,
           restitution : 0.1,
           shape: 'edge_pl',
           color: track_color
    }).ready = true;
    
    //Upper start platform
    Crafty.e("2D, Canvas, Box2D")
        .attr({ x: 0, y: 200, w: this.start_x, h: 0})
        .box2d({
           bodyType: 'static',
           density : 10,
           friction : track_friction,
           restitution : 0.1,
           shape: 'edge_pl',
           color: track_color,
           fill: false
    }).ready = true;
    
    //Lower start platform
    Crafty.e("2D, Canvas, Box2D")
        .attr({ x: 0, y: 250, w: this.start_x, h: 0})
        .box2d({
           bodyType: 'static',
           density : 10,
           friction : track_friction,
           restitution : 0.1,
           shape: 'edge_pl',
           color: track_color
    }).ready = true;
    
    //Jump hill up
    Crafty.e("2D, Canvas, Box2D")
        .attr({ x: this.start_x, y: this.base_y-40, w: 50, h: 40})
        .box2d({
           bodyType: 'static',
           density : 10,
           friction : track_friction,
           restitution : 0.1,
           shape: 'edge_pl',
           color: track_color
    }).ready = true;
    
    //Jump hill down
    Crafty.e("2D, Canvas, Box2D")
        .attr({ x: this.start_x+50, y: this.base_y-40, w: 50, h: 40})
        .box2d({
           bodyType: 'static',
           density : 10,
           friction : track_friction,
           restitution : 0.1,
           shape: 'edge_mi',
           color: track_color
    }).ready = true;    
    
    //Generate random part
    var x = this.base_x, y = this.base_y, index, neg, dx, dy;
    var sy, shape;
    for( index=0; index<max_n; index+=3) {
        /*
        dx = this.step_minx + Math.floor((Math.random() * this.step_varx) + 1);
        if( Math.random() < 0.5 )
            neg = -1;
        else
            neg = 1;
        dy = (this.step_mindy + Math.floor((Math.random() * this.step_vary) + 1));
        */
       
        dx = map_data[index];
        dy = map_data[index+1];
        neg = map_data[index+2];
       
        if( neg==1 ) {
            shape = 'edge_pl';
            //min
            if( y+(-1)*neg*dy < this.mindy ) {
                dy = y-this.mindy;
                sy = y-dy;
            } else
                sy = y-dy;
        } else {
            sy = y;
            shape = 'edge_mi';
            //max
            if( y+(-1)*neg*dy > this.maxy )
                dy = this.maxy-y;
        }
         
        if( dy == 0)
            dy = 1;
         
        Crafty.e("2D, Canvas, Box2D")
            .attr({ x: x, y: sy, w: dx, h: dy})
            .box2d({
               bodyType: 'static',
               density : 10,
               friction : track_friction,
               restitution : 0.1,
               shape: shape,
               color: track_color
        }).ready = true;
        
        x += dx;
        y += (-1)*neg*dy;
    }
    
    //Finish platform
    Crafty.e("2D, Canvas, Box2D")
    .attr({ x: x, y: y, w: this.base_x+150, h: 0})
    .box2d({
       bodyType: 'static',
       density : 10,
       friction : track_friction,
       restitution : 0.1,
       shape: 'edge_pl',
       color: track_color
    }).ready = true;
    
    //Finish line
    Crafty.e("2D, Canvas, finish_line")
        .attr({ x: x+this.base_x/2, y: y-140, w: 28, h: 140});
    
    //var finish_x = x+this.base_x/2;
    
    //Delete data not needed anymore
    this.map_data = null;    

    //jump to end for testing
    //p1.body.SetPosition( new b2Vec2( x/Crafty.box2D.PTM_RATIO, (y-100)/Crafty.box2D.PTM_RATIO ));
    
};
