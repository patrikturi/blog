var   b2Vec2 = Box2D.Common.Math.b2Vec2
         	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
         	,	b2Body = Box2D.Dynamics.b2Body
         	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
         	,	b2Fixture = Box2D.Dynamics.b2Fixture
         	,	b2World = Box2D.Dynamics.b2World
         	,	b2MassData = Box2D.Collision.Shapes.b2MassData
         	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
         	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
         	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
			,	b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
			,	b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef
			,	b2ContactListener = Box2D.Dynamics.b2ContactListener
			,	b2FilterData = Box2D.Dynamics.b2FilterData
			,	b2Color = Box2D.Common.b2Color
            ;

/**@
* #Box2D
* @category Box2D
* Component that adds the Box2D physics engine capabilities to the entities.
*/
Crafty.c("Box2D", {
	/**@
	* #.body
	* The 'b2Body' element of the entity.
	*/
	body : null,

	/**@
	* #.fixtures
	* Array than contains the b2Fixtures of the entity.
	*/
	fixtures : null,

	init: function () {
		this.requires("2D");
                
		if (!Crafty.box2D.world) {
			Crafty.box2D.init(0, 10, 55, true);
		}
	},
	/**@
	* #.box2d
	* @comp Box2D
	* @sign public void .box2d(Object obj)
	* @param obj - Object with the bodyType(dynamic, static, kinematic) and fixture data to make
	* the fist fixture of the body.
	*
	* Create the b2Body and link to the crafty entity, it only need the bodyType
	* ie: .box2d({bodyType: 'solid'})
	* this will create a b2Body and make a fixture with the default, the other params of the object,
	* are the same of the method .addFixture
	* 
	* You can pass also a custom b2BodyDef using the argument .bodyDef
	* ie:
	* var customDef = new b2BodyDef;
	* customDef.type = "dynamic";
	* customDef.position.Set(X, Y);
	* customDef.angle = ANGLE_IN_RADIANS;
	* ...
	* .box2d(bodyDef : customDef);
	*
	*/
	box2d: function(obj) {
		var world = Crafty.box2D.world;
		var PTM_RATIO =	Crafty.box2D.PTM_RATIO;
		var fixDef;
		var BodyDef;
		var vertexCount = 0;
		this.fixtures = [];		
		
		if(obj.bodyDef){
		
			var BodyDef = obj.bodyDef;
			
		}else{
			var BodyDef = new b2BodyDef;

			if(obj.bodyType === "dynamic"){
				BodyDef.type = b2Body.b2_dynamicBody;
			}else if (obj.bodyType === "static"){
				BodyDef.type = b2Body.b2_staticBody;
			}else{
				BodyDef.type = b2Body.b2_kinematicBody;
			}

                        if(this.h == 0)
                            BodyDef.position.Set(this._x/PTM_RATIO, (this._y-3)/PTM_RATIO);
                        else
                            BodyDef.position.Set(this._x/PTM_RATIO, this._y/PTM_RATIO);
		}
		
                if(obj.fixedRotation)
                    BodyDef.fixedRotation = true;
		BodyDef.userData = this;
		this.body = world.CreateBody(BodyDef);

		this.addFixture(obj);
                
                if( obj.linearDamping )
                    this.body.SetLinearDamping(obj.linearDamping);
                if( obj.angularDamping)
                    this.body.SetAngularDamping(obj.angularDamping);

		return this;
	},
	/**@
	* #.addFixture
	* @comp Box2D
	* @sign public void .addFixture(Object fixture)
	* @param fixture - Object with the B2FixtureDef or the propierties to make
	*	a B2Fixture (Density, Friction, Restitution, Shape, etc)
	*
	* Add a fixture to te body of the entity, you can pass a complete B2FixtureDef for more control
	* ie: .addFixture({fixDef: B2FixtureDef}) or pass the propierties what you want
    * ie: .addFixture(
	*				  {
	*					density: Number,
	*					friction: Number,
	*					restitution: Number,
	*					shape: Array with the shape or String with the shape you want('circle', 'box')
    *				  })
	*
	* If you pass a empty obj, the metod will create a fixture with default values, when the
	* fixture is made, it's attached to the body and add to the fixtures Array
	*/
	addFixture : function(setup) {

		var fixDef = {};

		// Custom fixture
		if (setup.fixDef) {

			fixDef = setup.fixDef;

			fixDef.shape = this._addShapeToFixture(fixDef.shape);

		// Preconfigured fixture
		} else {

			fixDef = new b2FixtureDef();
			fixDef.density = (!isNaN(setup.density)) ? setup.density : 1;
			fixDef.friction = (!isNaN(setup.friction)) ? setup.friction : 0.5;
			fixDef.restitution = (!isNaN(setup.restitution)) ? setup.restitution : 0.2;
      fixDef.isSensor = Boolean(setup.isSensor);

			// Add some filter stuff
			fixDef.filter = this._addFilterToFixture(setup);

			// Enrich the fixture with a shape
			fixDef.shape = this._addShapeToFixture( setup.shape, setup.color, setup.fill);
		}

		// Fixture was built
		if (Object.keys(fixDef).length) {

			this.fixtures.push(this.body.CreateFixture(fixDef));
		}

		return this;
	},

	/**
	 * Add filter stuff to the fixDef
	 * @param {[type]} setup  [description]
	 */
	_addFilterToFixture: function(setup) {

		var filter = new b2FilterData();

		filter.categoryBits = (!isNaN(setup.categoryBits)) ? setup.categoryBits : 0x0001;
		filter.maskBits = (!isNaN(setup.maskBits)) ? setup.maskBits : 0xffff;
		filter.groupIndex = (!isNaN(setup.groupIndex)) ? setup.groupIndex : 0;

		return filter;
	},

	_addShapeToFixture: function( shapeSetup, shape_color, fill) {

		var shape;

		var PTM_RATIO = Crafty.box2D.PTM_RATIO;

		// ShapeSetup is a string! A circle!
		if (typeof shapeSetup === "string" && shapeSetup === "circle") {

			shape = new b2CircleShape(
				this._w / PTM_RATIO / 2
			);

			shape.SetLocalPosition(new b2Vec2(
				this._w / PTM_RATIO / 2,
				this._h / PTM_RATIO / 2
			));

		// Shape is an array, hopefully..
		}
		//Positive or negative slope edge
		else if( shapeSetup === "edge_pl" || shapeSetup === "edge_mi" ) {
                    
                    var h_line = false;
                    var w_line = false;
                    if( this.h == 0) {
                        this.attr({ y: this.y-1, h: 3});
                        h_line = true;
                    } else if( this.w == 0) {
                        this.attr({ x: this.x-1, w: 3});
                        w_line = true;
                    }
                    
			shape = new b2PolygonShape();
			var posX, posY;
                        if( h_line == true) {
				posX = new b2Vec2( 0, 2 / PTM_RATIO);
				posY = new b2Vec2( this._w / PTM_RATIO, 2 / PTM_RATIO);
                        } else if( w_line == true ) {
				posX = new b2Vec2( 1 / PTM_RATIO, 0);
				posY = new b2Vec2( 1 / PTM_RATIO, this._h / PTM_RATIO);
                        }
			else if( shapeSetup === "edge_pl" ) {
				posX = new b2Vec2( 0, this._h / PTM_RATIO);
				posY = new b2Vec2( this._w / PTM_RATIO, 0);
			} else {
				posX = new b2Vec2( 0, 0);
				posY = new b2Vec2( this._w / PTM_RATIO, this._h / PTM_RATIO);
			}
                    
                    shape.SetAsEdge( posX, posY );
                    
			
			if( shape_color ) {
                            
                        this.draw_h = this._h; 
                           
				this.bind("Draw", function(obj) {
                    var ctx = obj.ctx;
                    var pos = obj.pos;
                    ctx.strokeStyle = "#000000";//"#7D939E";//shape_color;
                    ctx.lineWidth = 2;
                    ctx.fillStyle = shape_color;
                    
                    var to_bottom_y = g_stageH-pos._y;

                    if( fill != false && w_line != true) {
                        ctx.beginPath();

                        if( h_line == true ) {
                            ctx.moveTo( pos._x, pos._y+1);
                
                            ctx.lineTo( pos._x, pos._y+to_bottom_y);
                            ctx.lineTo( pos._x+pos._w, pos._y+to_bottom_y);
                            ctx.lineTo( pos._x+pos._w, pos._y+1);
                        } else if( shapeSetup === "edge_pl" ) {
                            ctx.moveTo( pos._x, pos._y+this.draw_h);
                
                            ctx.lineTo( pos._x, pos._y+to_bottom_y);
                            ctx.lineTo( pos._x+pos._w, pos._y+to_bottom_y);

                            ctx.lineTo( pos._x+pos._w, pos._y+this.draw_h);
                            ctx.lineTo( pos._x+pos._w, pos._y);
                        } else {
                            ctx.moveTo( pos._x, pos._y);
                            ctx.lineTo( pos._x, pos._y+this.draw_h);

                            ctx.lineTo( pos._x, pos._y+to_bottom_y);
                            ctx.lineTo( pos._x+pos._w, pos._y+to_bottom_y);

                            ctx.lineTo( pos._x+pos._w, pos._y+this.draw_h);
                        }

                        ctx.closePath();
                
                        ctx.fill();
                    }

                    ctx.beginPath();
                    if( h_line == true) {
                        ctx.moveTo( pos._x, pos._y+1);
                        ctx.lineTo( pos._x+pos._w, pos._y+1);
                    } else if( w_line == true) {
                        ctx.moveTo( pos._x+1, pos._y);
                        ctx.lineTo( pos._x+1, pos._y+pos._h);
                    } else {
                        if( shapeSetup === "edge_pl" ) {
                            ctx.moveTo( pos._x, pos._y+this.draw_h);
                            ctx.lineTo( pos._x+pos._w, pos._y);
                        }
                        else {
                            ctx.moveTo( pos._x, pos._y);
                            ctx.lineTo( pos._x+pos._w, pos._y+this.draw_h);
                        }
                    }

                    ctx.stroke();

/*
					var fixture = this.body.GetFixtureList();
					var shape = fixture.GetShape();
                    custom_draw.DrawShape( shape, this.body.GetTransform(), shape_color );
*/
				});
                                
                            this.attr( { h: g_stageH-this._y });
			}
			
		}
		else if (Object.prototype.toString.call( shapeSetup ) === '[object Array]') {

			shape = new b2PolygonShape();
			var vertexCount = shapeSetup.length;
			var shapeArray = [];

			for (var i = 0; i < vertexCount; i++) {
				var vector = shapeSetup[i];
				shapeArray.push(new b2Vec2(vector[0] / PTM_RATIO, vector[1] / PTM_RATIO));
			}

			shape.SetAsArray(shapeArray, vertexCount);
		// No, it's a box! (maybe a shape wasn't defined!)
		} else {

			shape = new b2PolygonShape();
			shape.SetAsOrientedBox(
				(this.w / 2) / PTM_RATIO, (this.h / 2) / PTM_RATIO,
				new b2Vec2(
					(this.w / 2) / PTM_RATIO, (this.h / 2) / PTM_RATIO
				)
			);
		}

		return shape || null;
	}
});

/**@
* #Crafty.box2D
* @category Box2D
* Collection of methods to init Box2D World.
*/
Crafty.extend({
	box2D: {
		ShowBox2DDebug : false,
		contacts : null,
	/**@
		* #Crafty.box2D.world
		* @comp Crafty.box2D
		* This will return the b2World element.
		*/
		world : null,

	/**@
		* #Crafty.box2D.PTM_RATIO
		* @comp Crafty.box2D
		* This will return the pixel-to-meter ratio used to draw the b2World.
		*/
		PTM_RATIO : null,

		/**@
		* #Crafty.box2D.init
		* @comp Crafty.box2D
		* @sign public void Crafty.box2D.init(Number gx, Number gy, Number ptm_ratio, Boolean doSleep)
		* @param gx - gravity force of the x-axis
		* @param gy - gravity force of the y-axis
		* @param ptm_ratio - pixel-to-meter ratio
		* @param doSleep permit the Box2D world sleep
		* Creates a b2World element and bind the Box2D 'step' to Crafty EnterFrame funct
		* Must be called before any entities with the Box2D component can be drawn.
		*
		* This method will automatically be called if no `Crafty.canvas.b2World` is
		* found.
		*/
		init: function (gx, gy, ptm_ratio, doSleep) {
			var _world = new b2World(
							   new b2Vec2(gx, gy)    //gravity
							,  doSleep                 //allow sleep
						 );

			var _PTM_RATIO = ptm_ratio;

			var _contacts = [];

			
			Crafty.bind("StepWorld", function() {
				_world.Step(
					   1.0 / 50.0   //frame-rate
					,  8       //velocity iterations
					,  3       //position iterations
				 );

                                var b;
				for(var k=0; k<dyn_bodies.length; k++) {
                                    b = dyn_bodies[k];
                                    if( b.IsAwake() ) {
                                        var sprite = b.GetUserData();
					if (sprite) {
						sprite.attr(
									{
										x: b.GetPosition().x * _PTM_RATIO,
										y:b.GetPosition().y * _PTM_RATIO
									}
							);
						sprite.rotation = Crafty.math.radToDeg(b.GetAngle());
					}
                                    }
				}

				if(Crafty.box2D.ShowBox2DDebug){
					_world.DrawDebugData();
				}
				_world.ClearForces();

			});

			Crafty.box2D.world = _world;
			Crafty.box2D.PTM_RATIO = _PTM_RATIO;
			Crafty.box2D.contacts = _contacts;
		},
                
                initDrawing: function() {
                    var _world = Crafty.box2D.world;
                    var _PTM_RATIO = Crafty.box2D.PTM_RATIO;

                    var debugDraw = new b2DebugDraw();
                    debugDraw.SetSprite(Crafty.canvas.context);
                    debugDraw.SetDrawScale(_PTM_RATIO);
                    debugDraw.SetFillAlpha(1.0);
                    debugDraw.SetLineThickness(1.0);
                    _world.SetDebugDraw(debugDraw);
                    Crafty.box2D.ShowBox2DDebug = false;
                },

		initDebugDraw : function(){
			var _world = Crafty.box2D.world;
			var _PTM_RATIO = Crafty.box2D.PTM_RATIO;

			if (Crafty.support.canvas) {
				var c = document.createElement("canvas");
				c.id = "Box2DCanvasDebug";
				c.width = Crafty.viewport.width;
				c.height = Crafty.viewport.height;
				c.style.position = 'absolute';
				c.style.left = "0px";
				c.style.top = "0px";

				Crafty.stage.elem.appendChild(c);

				var debugDraw = new b2DebugDraw();
				debugDraw.SetSprite(c.getContext('2d'));
				debugDraw.SetDrawScale(_PTM_RATIO);
				debugDraw.SetFillAlpha(0.7);
				debugDraw.SetLineThickness(1.0);
				debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
				_world.SetDebugDraw(debugDraw);
				Crafty.box2D.ShowBox2DDebug = true;
			}else{
				Crafty.box2D.ShowBox2DDebug = false;
			}
		}
	}
});
