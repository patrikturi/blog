
Crafty.c("Player", {
    RUN_SPEED: 5,
    init: function() {
        this.addComponent("2D, Canvas, Box2D, Keyboard, SpriteAnimation, player_right");
        
        this.reel("run_right", 500, 0, 0, 4);
        this.reel("run_left", 500, 0, 1, 4);
        this.reel("jump_right", 800, [[4,0], [5,0], [6,0], [5,0]]);
        this.reel("jump_left", 800, [[4,1], [5,1], [6,1], [5,1]]);
    },
    addForceUp: function() {
        var target_ang = 0;
        var cur_ang = this.body.GetAngle();
        var diff_ang = cur_ang-target_ang;
        var sign;
        if( diff_ang < 0)
            sign = 1;
        else sign = -1;
        this.body.ApplyTorque( sign*(diff_ang*3)*(diff_ang*3)*175 );
    },
    stopRollingBack: function() {
        var ang = this.body.GetAngle();
        if( !this.Input.leftDown() && !this.Input.rightDown() && Math.abs(ang) < 0.025 &&
            this.body.GetLinearVelocity().Length() < 2 ) {
            //var ang_vel = this.body.GetAngularVelocity();
            this.body.SetAngularVelocity(0);
            this.body.SetAngle(0);
        }
    },
    addForceRun: function() {
        //Run force
        var vel = this.body.GetLinearVelocity();
        var desired_vel;
        if( this.Input.leftDown() )
            desired_vel = -this.RUN_SPEED;
        else if( this.Input.rightDown() )
            desired_vel = this.RUN_SPEED;           
        else
            desired_vel = 0;
        
        if( desired_vel != 0 && this.numFootContacts > 0) {
            var vel_change = desired_vel-vel.x;
            var force = this.body.GetMass() * vel_change / (1/50.0);
            force *= 0.3;
            this.body.ApplyForce( new b2Vec2(force, 0), this.body.GetWorldCenter() );
        }
    },
    animateJump: function() {
        if( this.facing_dir == this.Controls.RIGHT)
            this.animate("jump_right");
        else if( this.facing_dir == this.Controls.LEFT)
            this.animate("jump_left");
        this.bind("AnimationEnd", function() {
            if( this.facing_dir == this.Controls.RIGHT)
                this.sprite(3,0,1,1);
            else if( this.facing_dir == this.Controls.LEFT)
                this.sprite(3,1,1,1);
        });
    },
    checkJump: function() {
        if( this.jump_timeout > 0) {
            this.jump_timeout--;
        }
        
        var vel = this.body.GetLinearVelocity();
        
        //isHost &&
        if( isHost &&
            (this.jump_timeout === 0) && (this.numFootContacts > 0) && this.Input.jmpDown() && vel.y < 2.0 && this.energy_bar.requestJump() ) {
            
            if(isHost) {
                var array = [];
                array.push({ i: this.ID-1, e: this.energy_bar.val });
            }

            //Push player upwards
            var jmp_strength = 125;
            var jump_x_base = 10;
            var jump_x_boost = 30;
            //If facing the same direction
            if( (vel.x >= 0.0 && this.facing_dir == this.Controls.RIGHT) ||
                (vel.x <= 0.0 && this.facing_dir == this.Controls.LEFT) ) {
                jump_x_boost = jump_x_boost * (Math.abs(vel.x)/this.RUN_SPEED) + jump_x_base;
            }
            else {
                //i = m*dv
                var stop_impulse = this.body.GetMass() * Math.abs(vel.x);
                jump_x_boost = stop_impulse + jump_x_base;
            }
            if( this.facing_dir == this.Controls.LEFT )
                jump_x_boost *= -1;
            //dir
            var jump_vect = new b2Vec2( jump_x_boost, -jmp_strength);
            this.body.ApplyImpulse( jump_vect, this.body.GetWorldCenter() );

            //Push ground down
            jump_vect.x = -jump_vect.x;
            jump_vect.y = -jump_vect.y;
            var react_force_point = new b2Vec2( 16/Crafty.box2D.PTM_RATIO, 32/Crafty.box2D.PTM_RATIO);
            react_force_point = this.body.GetWorldPoint(react_force_point);

            for( var i=0; i<this.fixturesUnderfoot.length; i++ ) {
                this.fixturesUnderfoot[i].GetBody().ApplyImpulse( jump_vect, react_force_point );
            }

            this.jump_timeout = 10; //cooldown
            this.animateJump();
        }
    },
    checkShake: function() {
        var vel = this.body.GetLinearVelocity();
        if( this.numFootContacts < 1 && vel.x == 0 && vel.y == 0 && !this.auto_shake )
            this.auto_shake = 10;

        // Shake prevents getting stuck
        if( this.auto_shake ) {
            //Start
            if( this.shake_on == false ) {
                this.shake_on = true;
                this.body.ApplyImpulse( new b2Vec2( this.shake_strength/2*this.shake_dir, 0 ), this.body.GetWorldCenter() );
                this.shake_dir *= -1;
            }

            //Step
            this.shake_num--;
            if(this.auto_shake > 0)
                this.auto_shake--;
            //Impulse + change direction
            if(this.shake_num <= 0) {
                this.body.ApplyImpulse( new b2Vec2( this.shake_strength*this.shake_dir, 0 ), this.body.GetWorldCenter() );
                this.shake_num = this.shake_num_init;
                this.shake_dir *= -1;
            }

        //End
        } else if( this.shake_on ) {
            this.shake_on = false;
            this.body.ApplyImpulse( new b2Vec2( this.shake_strength/2*this.shake_dir, 0 ), this.body.GetWorldCenter() );
            this.shake_dir *= -1;
            this.shake_num = this.shake_num_init/2;
        }
    },
    updateDirection: function() {
        //Controls
        //facing_dir: left/right
        if( this.Input.leftDown() ) {
            this.facing_dir = this.Controls.LEFT;
        }
        else if( this.Input.rightDown() ) {
            this.facing_dir = this.Controls.RIGHT;
        }
    },
    setAnimation: function() {
        //Animation/sprite
        if( this.numFootContacts < 1) { //Animation In air
            //Just left the ground
            if( this.inAir == false && this.isPlaying("run_left")) {
                this.pauseAnimation();
                this.sprite(3,1,1,1);
            } else if( this.inAir == false && this.isPlaying("run_right")) {
                this.pauseAnimation();
                this.sprite(3,0,1,1);                    
            }
            this.inAir = true;

            if( !this.isPlaying("jump_right") && !this.isPlaying("jump_left")) {
                if( this.Input.leftDown() ) {
                    this.sprite(3,1,1,1);
                } else if( this.Input.rightDown() ) {
                    this.sprite(3,0,1,1);
                }
            }

        } else {    //Animation On the ground
            
            //Animate run left
            if( this.Input.leftDown() ) {
                if( this.prev_run_dir != this.Controls.LEFT || 
                    this.inAir && this.prev_run_dir == this.Controls.LEFT )
                    this.animate("run_left", -1);
            }
            else if( this.Input.rightDown() ) {    //Run right
                if( this.prev_run_dir != this.Controls.RIGHT ||
                    this.inAir && this.prev_run_dir == this.Controls.RIGHT )
                    this.animate("run_right", -1);                
            }
            else {  //Not running
                if(!this.isPlaying("jump_right") && !this.isPlaying("jump_left")) {
                    if( this.facing_dir == this.Controls.LEFT) {
                        if(this.isPlaying())
                            this.pauseAnimation();
                        this.sprite(3,1,1,1);
                    } else if(this.facing_dir == this.Controls.RIGHT) {
                        if(this.isPlaying())
                            this.pauseAnimation();
                        this.sprite(3,0,1,1);
                    }
                }
            }
            this.inAir = false;
        }
        
        //Update running direction (used only for animation)
        if( this.Input.leftDown() )
            this.prev_run_dir = this.Controls.LEFT;
        else if( this.Input.rightDown() )
            this.prev_run_dir = this.Controls.RIGHT;
        else
            this.prev_run_dir = 0;
    },
    param: function( startx, starty, player_id, player_color, primary, Controls) {
        this.attr( { x: startx, y: starty, w: 28, h: 28});
        this.box2d( {
            bodyType: 'dynamic',
            density : 40,
            friction : 0.1,
            restitution : 0.1,
            shape: 'circle',
            linearDamping: 0.2,
            angularDamping: 5
         }
        );

        this.ID = player_id;
        this.primary = primary; //primary is the character controlled by the player
        this.color = player_color;
        
        this.Controls = Controls;
        
        this.shake_on = false;
        this.auto_shake = 0;
        this.shake_dir = 1;
        this.shake_strength = 120;
        this.shake_num_init = 10;
        this.shake_num = this.shake_num_init/2;
        
        this.prev_run_dir=0;
        this.facing_dir = this.Controls.RIGHT;
        this.jump_timeout = 0;
        
        //If passed finish line
        this.finished = false;
        this.controls_on = false;
        
        this.energy_bar = new CEnergyBar( this, player_color);
        this.energy_bar.bindEvents(this);

        
        //If it's a past to present update from network pos/vel packet
        //then don't update animation and controls
        this.update_past = false;   
        
        this.Input = new CInput(75, this);
        this.Input.setDelay(0);
        if( isHost && this.primary)
            this.Input.setInterval(3);
        this.Input.disable();
        
        //Create Foot Sensor fixture
        var polygonShape = new b2PolygonShape ;
        polygonShape.SetAsOrientedBox( 9/Crafty.box2D.PTM_RATIO, 2/Crafty.box2D.PTM_RATIO,
            new b2Vec2( this.w/2/Crafty.box2D.PTM_RATIO, this.h/Crafty.box2D.PTM_RATIO), 0);
        var myFixtureDef = new b2FixtureDef;
        myFixtureDef.shape = polygonShape;
        myFixtureDef.isSensor = true;
        var footSensorFixture = this.body.CreateFixture(myFixtureDef);
        footSensorFixture.SetUserData( this.ID+10 );

        this.bind("Step", function() {
            
            if(!this.update_past) {
                if(!this.controls_on) {
                    this.Input.disable();
                }
                else {
                    this.Input.enable();
                }
                this.Input.update();
            }
            
            //debug_msg(this.numFootContacts);
    
            if(!this.update_past)
                this.setAnimation();

            this.updateDirection();

            this.addForceRun();

            //Force standing up
            this.addForceUp();

            //Don't roll backwards, stop
            this.stopRollingBack();

            this.checkJump();

            if(!this.update_past)
                this.checkShake();

        });  //End of bind "Step"

        return this;
    }   //End of function param(...)
});     //End of entity
