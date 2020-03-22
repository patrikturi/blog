
function CBackground() {
    this.canv = document.createElement("canvas");
    this.ctx = this.canv.getContext("2d");
    var c = this.canv;
	c.id = "bgCanvas";
	c.width = Crafty.viewport.width;
	c.height = Crafty.viewport.height;
	c.style.position = 'absolute';
	c.style.left = "0px";
	c.style.top = "0px";
	Crafty.stage.elem.appendChild(c);

    $('#bgCanvas').css('background-color', '#a3ceed');

    this.bg_img = new Image();
    this.bg_img.src = "img/bg0.png";
    this.bg_width = 1796;

    //last rendered x
    this.last_x = -1;
}

CBackground.prototype.draw = function() {

    var draw_w = 640;
    var new_x = Math.floor(-(Crafty.viewport.x-60)/6);
    if( new_x < 0) new_x = 0;

    new_x = new_x % this.bg_width;

    if( this.last_x != new_x )
        this.last_x = new_x;
    else
        return;
    
    if( new_x > this.bg_width-640) {
        draw_w = this.bg_width - new_x;
        this.ctx.drawImage( this.bg_img, new_x, 0, draw_w, 164, 0, 24, draw_w, 164);
        this.ctx.drawImage( this.bg_img, 0, 0, 640-draw_w, 164, draw_w, 24, 640-draw_w, 164);
    } else  //sourcex, sourcey, sw, sh, dx, dy, dw, dh);  
        this.ctx.drawImage( this.bg_img, new_x, 0, 640, 164, 0, 24, 640, 164);
    

}

