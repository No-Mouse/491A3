

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game) {
    this.radius = Math.floor((Math.random() * 6) + 1);;
    this.visualRadius = 150;
    this.colors = ["Red", "Gray", "White"];
    this.white();
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
	
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};


Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.pusher = function () {
    this.it = true;
    this.color = 0;
    this.visualRadius = 50;
	this.radius= 10;
};

Circle.prototype.gray = function () {
    this.graycir = true;
    this.color = 1;
    this.visualRadius = 200;
};

Circle.prototype.white = function () {
    this.whitecir = true;
	this.color = 2;
    this.visualRadius = 200;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};
	var socket = io.connect("http://24.16.255.56:8888");
	var saveboolean = false;
	var loadboolean = false;	
	var savedata = [];
	var loaddata = [];
	
Circle.prototype.update = function () {
	

    Entity.prototype.update.call(this);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;
	if(this.game.click){
		if (this.game.click.x > 300 && this.game.click.x < 350 && this.game.click.y > 730 && this.game.click.y < 750){
			saveboolean = true;
			
		}
		if (this.game.click.x > 400 && this.game.click.x < 450 && this.game.click.y > 730 && this.game.click.y < 750){
			loadboolean = true;
		}
	}
	if(saveboolean) {
		for (var i = 1; i < this.game.entities.length; i++) {
			var ent = this.game.entities[i];
			savedata.push(ent.x, ent.y, ent.velocity, ent.radius, ent.velocity.x, ent.velocity.y, this.x, this.y);
		}
		socket.emit("save", { studentname: "Dirk Sexton", statename: "particle state", savedata});
		saveboolean = false;
	}
	if(loadboolean){
		if(loaddata.length == 0){
			socket.emit("load", { studentname: "Dirk Sexton", statename: "particle state"});
		} else {
			var index = 0
			for (var i = 1; i < this.game.entities.length; i++) {
				var ent = this.game.entities[i];
				ent.x = loaddata[index];
				index ++;
				ent.y = loaddata[index];
				index ++;
				ent.velocity = loaddata[index];
				index ++;				
				ent.radius = loaddata[index];
				index ++;
				ent.velocity.x = loaddata[index];
				index ++;	
				ent.velocity.y = loaddata[index];
				index ++;					
				this.x = loaddata[index];
				index ++;
				this.y = loaddata[index];
				index ++;					
			}
			loaddata = [];
			loadboolean = false;
		}
}

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
            if (this.it) {
                //ent.pusher();
				//this.color = 0;
            }
			if(this.graycir) {
				ent.gray();
				//this.whitecir = false; 1 1073 /\/\451554
			} else {
				//ent.white();
				//this.graycir = false;
            }
        }

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            if (this.it && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
            if (ent.it && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
    }
	if (this.it) {
     
		this.color = 0;
    }
	if(this.game.click ) {
		//this.x = this.game.mouse.x;
		//this.y = this.game.mouse.y;

	}

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
	ctx.fillStyle = "red";
	
	ctx.font = "30px Sans-serif";
	ctx.fillText("save", 300, 750);
		
	
	ctx.font = "30px Sans-serif";
	ctx.fillText("load", 400, 750);
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();


	if(this.game.mouse ) {
		//ctx.save;
		//this.x = this.game.mouse.x;
		//this.y = this.game.mouse.y;

		//ctx.moveTo(this.game.mouse.x, this.game.mouse.y);
		
		if(this.it) {
			this.x = this.game.mouse.x;
			this.y = this.game.mouse.y;
		}
	}

};

window.onload = function () {


	socket.on("load", function (data) {
		console.log("load");
		console.log(data);
		loaddata = data.savedata;
	});

	socket.on("save", function (data) {
		console.log("save");
		console.log(data);
	});



};


// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 100;


var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');




    var gameEngine = new GameEngine();
    var circle = new Circle(gameEngine);
    circle.pusher();
	
    gameEngine.addEntity(circle);
	circle = new Circle(gameEngine);
    circle.gray();
	
    gameEngine.addEntity(circle);
    for (var i = 0; i < 5; i++) {
        circle = new Circle(gameEngine);
        gameEngine.addEntity(circle);
    }
    gameEngine.init(ctx);
    gameEngine.start();
});
