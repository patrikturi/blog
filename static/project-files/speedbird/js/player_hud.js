
function initContactListener( birds ) {

    for( var i=0; i<birds.length; i++) {
        birds[i].numFootContacts = 0;
        birds[i].fixturesUnderfoot = [];
    }

    //Add contact listener for feet sensor
    var contactListener = new b2ContactListener;
    contactListener.BeginContact = function(contact)
   {
      //check if fixture A was the foot sensor
      var fixtureUserData = contact.GetFixtureA().GetUserData();
      for( var i=0; i<birds.length; i++) {
        if ( fixtureUserData === (birds[i].ID+10) ) {
          birds[i].numFootContacts++;
          birds[i].fixturesUnderfoot.push(contact.GetFixtureB());
        }
      }

      //check if fixture B was the foot sensor
      fixtureUserData = contact.GetFixtureB().GetUserData();
      for( var i=0; i<birds.length; i++) {
        if ( fixtureUserData === (birds[i].ID+10) ) {
          birds[i].numFootContacts++;
          birds[i].fixturesUnderfoot.push(contact.GetFixtureA());
          }
      }

   };

    contactListener.EndContact = function(contact)
   {

      //check if fixture A was the foot sensor
      var fixtureUserData = contact.GetFixtureA().GetUserData();
      for( var i=0; i<birds.length; i++) {
        if ( fixtureUserData === (birds[i].ID+10) ) {
            birds[i].numFootContacts--;
            var index = birds[i].fixturesUnderfoot.indexOf(contact.GetFixtureB());
            birds[i].fixturesUnderfoot.splice(index, 1);
        }
      }

      //check if fixture B was the foot sensor
      fixtureUserData = contact.GetFixtureB().GetUserData();
      for( var i=0; i<birds.length; i++) {
        if ( fixtureUserData === (birds[i].ID+10) ) {
            birds[i].numFootContacts--;
            var index = birds[i].fixturesUnderfoot.indexOf(contact.GetFixtureA());
            birds[i].fixturesUnderfoot.splice(index, 1);
        }
      }

   };
    Crafty.box2D.world.SetContactListener(contactListener);
}

function CEnergyBar( bird, player_color) {
    
    var bar_w = 8;
    var bar_h = 34;
    this.bar_y_offset = -3;
    this.bar_height = bar_h;

    this.bar_shadow_e = Crafty.e("2D, Canvas, Color, Tint")
        .attr({ x: bird.x-bird.w/3-bar_w+2, y: bird.y+this.bar_y_offset+2, w: bar_w+2, h: bar_h+4, z: 10})
        .color("#FFFFFF")
        .tint("#222222", 0.15);

    this.bar_entity = Crafty.e("2D, Canvas, Color, Tint")
        .attr({ x: bird.x-bird.w/3-bar_w, y: bird.y+this.bar_y_offset, w: bar_w, h: bar_h, z: 10})
        .color("#FFFFFF")
        .tint("#00FF00", 0.5);

    this.bar_border = Crafty.e("2D, Canvas")
            .attr({ x: this.bar_shadow_e.x, y: this.bar_shadow_e.y, w: this.bar_shadow_e.w, h: this.bar_shadow_e.h})
            .bind("Draw", function(obj) {
                var ctx = obj.ctx;
                var pos = { _x: obj.pos._x+1, _y: obj.pos._y+1, _w: obj.pos._w-2, _h: obj.pos._h-2};
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo( pos._x+1, pos._y+1);
                ctx.lineTo( pos._x, pos._y+pos._h);
                ctx.lineTo( pos._x+pos._w, pos._y+pos._h);
                ctx.lineTo( pos._x+pos._w, pos._y);
                ctx.closePath();
                ctx.stroke();
            });
    this.bar_border.ready = true;

    

    if( bird.primary) {
        var ind_w = 14;
        var ind_h = 10;

        this.ind_offset = 18    //y offset

        this.indicator = Crafty.e("2D, Canvas")
            .attr({ x: bird.x+bird.w/2-ind_w/2, y: bird.y-16, w: ind_w, h: ind_h, z: 10})
            .bind("Draw", function(obj) {
                var c = obj.ctx;
                c.beginPath();
                c.fillStyle = "#666666";
                c.moveTo( this.x, this.y);
                c.lineTo( this.x+this.w, this.y);
                c.lineTo( this.x+this.w/2, this.y+this.h);
                c.closePath();
                c.fill();
                c.beginPath();
                c.fillStyle = this.color;
                c.moveTo( this.x+1, this.y+1);
                c.lineTo( this.x+this.w-1, this.y+1);
                c.lineTo( this.x+this.w/2, this.y+this.h-1);
                c.closePath();
                c.fill();
        });
        this.indicator.ready = true;
        this.indicator.color = player_color;
    }
    
    this.max = 100;
    this.val = 100;
    this.regen = 0.2;
    
    this.jump_cost = 25;

}

CEnergyBar.prototype.bindEvents = function( bird ) {

    var energy_bar = bird.energy_bar;
    var indicator = energy_bar.indicator;
    var ind_shadow = energy_bar.ind_shadow;
    var bar_shadow_e = energy_bar.bar_shadow_e;
    var bar_entity = energy_bar.bar_entity;
    var bar_y_offset = energy_bar.bar_y_offset;
    var bar_border = energy_bar.bar_border;

    //Adjust positions, regeneration, and new energy bar height (value)
    Crafty.bind("AdjustHUD", function() {
        var top_center = bird.body.GetWorldPoint(new b2Vec2( bird.w/2/Crafty.box2D.PTM_RATIO, 0));
        var middle_left = bird.body.GetWorldPoint(new b2Vec2( 0, bird.h/2/Crafty.box2D.PTM_RATIO));
        middle_left.x *= Crafty.box2D.PTM_RATIO;
        top_center.x *= Crafty.box2D.PTM_RATIO;
        top_center.y *= Crafty.box2D.PTM_RATIO;

        if( bird.primary) {
            indicator.x = top_center.x-indicator.w/2;
            indicator.y = top_center.y-bird.energy_bar.ind_offset;
        }
        
        bar_entity.x = middle_left.x-bird.w/3-bar_entity.w;
        bar_shadow_e.x = bar_entity.x-1;
        bar_shadow_e.y = top_center.y+bar_y_offset-2;
        //bar_entity.y = top_center.y+bar_y_offset; //at new height
        bar_border.x = bar_shadow_e.x;
        bar_border.y = bar_shadow_e.y;

        var val_rounded = Math.round(energy_bar.val);
        //Regeneration
        if(energy_bar.val < energy_bar.max && !bird.finished) {
            energy_bar.val += energy_bar.regen;
            if(energy_bar.val > energy_bar.max)
                energy_bar.val = energy_bar.max;
        }
        //Adjust new height
        var new_val_rounded = Math.round(energy_bar.val);
        var new_h = new_val_rounded/bird.energy_bar.max*bird.energy_bar.bar_height;
        //if( val_rounded != new_val_rounded)
            bar_entity.attr( { y: top_center.y+bar_y_offset+(energy_bar.bar_height-new_h), h: new_h} );
    });
        
};

CEnergyBar.prototype.requestJump = function() {
    if( this.val >= this.jump_cost ) {
        this.val -= this.jump_cost;
        return true;
    } else return false;
};

function CInput( MAX_DELAY, entity) {

    this.last_data = null;
    
    this.entity = entity;    

    this.ctrl_cnt = 0;
    this.CTRL_SEND_N = 2;
    
    this.MAX_DELAY = MAX_DELAY;
    this.delay_n = 0;
    this.wait_n = 0;
    this.left = [];
    var i=MAX_DELAY;
    while(i--) this.left.push(0);
    this.right = [];
    i=MAX_DELAY;
    while(i--) this.right.push(0);
    this.jmp = [];
    i=MAX_DELAY;
    while(i--) this.jmp.push(0);
    this.shake = [];
    i=MAX_DELAY;
    while(i--) this.shake.push(0);
    //head/tail of the FIFOs
    this.head = 0;
    this.tail = MAX_DELAY-1;
    
    this.past_n = 0;    //past mode if > 0
    
    this.enabled = false;
}

CInput.prototype.setInterval = function(int) {
    this.CTRL_SEND_N = int;
}

CInput.prototype.enable = function() {
    this.enabled = true;
};

CInput.prototype.disable = function() {
    this.enabled = false;
};

CInput.prototype.setPing = function( ping ) {
    var delay_n;
    if( isHost ) {
        //self: ping/2
        //others: 0
        if( this.entity.primary)
            delay_n = Math.ceil(ping/2/20);
        else
            delay_n = 0;
    } else {    //peer
        //self: ping
        //others: ping/2
        if( this.entity.primary)
            delay_n = Math.ceil(ping/20);
            //delay_n = Math.ceil(ping/2/20);
        else
            delay_n = Math.ceil(ping/2/20);
    }
    this.setDelay(delay_n);
};

//Set desired fake delay in number of frames
CInput.prototype.setDelay = function(delay) {
    delay = Math.round(delay);
    this.wait_n = delay - this.delay_n;
    this.delay_n = delay;
    //TODO: new delay is lower than old one:
    //if wait_n < 0 --> tail += abs(wait_n)
};

CInput.prototype.hold = function() {
    this.left[this.head] = this.left[this.head-1];
    this.right[this.head] = this.right[this.head-1];
    this.jmp[this.head] = this.jmp[this.head-1];
    this.shake[this.head] = this.shake[this.head-1];
    
    this.step();
};


CInput.prototype.setData = function(obj) {
//        this.pcnt++;
    this.last_data = obj;
};

CInput.prototype.updateFromData = function(obj) {

    this.left[this.head] = obj.l;
    this.right[this.head] = obj.r;
    this.jmp[this.head] = obj.j;
    this.shake[this.head] = 0;  //unused
    
    this.step();
};

CInput.prototype.updateFromEntity = function() {

    var controls = this.entity.Controls;

    //Mobile controls
    if(isMobile) {

        if( AndConrols.run_l || AndConrols.run_jmp_l )
            this.left[this.head] = 1;
        else
            this.left[this.head] = 0;

        if( AndConrols.run_r || AndConrols.run_jmp_r )
            this.right[this.head] = 1;
        else
            this.right[this.head] = 0;

        if( AndConrols.jmp_r || AndConrols.jmp_l || AndConrols.run_jmp_l || AndConrols.run_jmp_r )
            this.jmp[this.head] = 1;
        else
            this.jmp[this.head] = 0;
    
    } else {    //Desktop controls -> keyboard
        if( this.entity.isDown(controls.LEFT) )
            this.left[this.head] = 1;
        else
            this.left[this.head] = 0;
        if( this.entity.isDown(controls.RIGHT) )
            this.right[this.head] = 1;
        else
            this.right[this.head] = 0;
        if( this.entity.isDown(controls.JUMP) )
            this.jmp[this.head] = 1;
        else
            this.jmp[this.head] = 0;
        this.shake[this.head] = this.entity.isDown(controls.SHAKE);
        //this.shake[this.head] = 0;
    }

    this.step();
};


CInput.prototype.step = function() {

    if(this.wait_n < 0) {   //Only get
        this.wait_n++;
    } else {
        this.head++;
        if(this.head >= this.MAX_DELAY)
            this.head = 0;
    }
    
    if(this.wait_n>0) {     //Only put
        this.wait_n--;
    }else {
        this.tail++;
        if(this.tail >= this.MAX_DELAY)
            this.tail = 0;
    }
};

CInput.prototype.leftDown = function() {
    if(this.enabled) {
        if(this.past_n) {
            var neg_i = this.tail-this.past_n;
            if(neg_i < 0)
                neg_i += this.MAX_DELAY;
            return this.left[neg_i];
        }
        else
            return this.left[this.tail];
    }
    else
        return 0;
};

CInput.prototype.rightDown = function() {
    if(this.enabled) {
        if(this.past_n ) {
            var neg_i = this.tail-this.past_n;
            if(neg_i < 0)
                neg_i += this.MAX_DELAY;
            return this.right[neg_i];
        }
        else
            return this.right[this.tail];
    }
    else
        return 0;
};

CInput.prototype.jmpDown = function() {
    if(this.enabled) {
        if(this.past_n) {
            var neg_i = this.tail-this.past_n;
            if(neg_i < 0)
                neg_i += this.MAX_DELAY;
            return this.jmp[neg_i];   
        }
        else   
            return this.jmp[this.tail];
    }
    else
        return 0;
};

CInput.prototype.shakeDown = function() {
    if(this.enabled) {
        if(this.past_n) {
            var neg_i = this.tail-this.past_n;
            if(neg_i < 0)
                neg_i += this.MAX_DELAY;
            return this.shake[neg_i];   
        }
        else
            return this.shake[this.tail];
    }
    else
        return 0;
};

CInput.prototype.getObj = function() {
    
    var obj = {
        l: this.left[this.head-1],
        r: this.right[this.head-1],
        j: this.jmp[this.head-1]
    };
    
    return obj;
};


CInput.prototype.update = function() {
    if( this.entity.primary) {
        if( this.ctrl_cnt == 0) {        
            this.updateFromEntity();
            var ctrl = this.getObj();
        } else this.hold();
        this.ctrl_cnt++;
        if( this.ctrl_cnt >= this.CTRL_SEND_N)
            this.ctrl_cnt=0;
    } else {
        if( this.last_data != null)
            this.updateFromData(this.last_data);
        else
            this.hold();
        this.last_data = null;        
    }
};
