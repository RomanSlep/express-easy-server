import Store from '../Store';
import $u from '../core/utils';

var game;
var FPS_DEFAULT = 60;
var FPS = FPS_DEFAULT;
var MULT_SPEED = 10; // увеличение скорости на
var MAX_SPEED = 150; // Максимальная скорость
var STEP_SCORE_SPEED = 200; // Шаг увеличения скорости
let status = 0;

var images = {};

var speed = function(fps){
    FPS = parseInt(fps);
};

var loadImages = function(sources, callback){
    var nb = 0;
    var loaded = 0;
    var imgs = {};
    for (var i in sources){
        nb++;
        imgs[i] = new Image();
        imgs[i].src = sources[i];
        imgs[i].onload = function(){
            loaded++;
            if (loaded === nb){
                callback(imgs);
            }
        };
    }
};

var Bird = function(json){
    this.x = 80;
    this.y = 250;
    this.width = 40;
    this.height = 30;

    this.alive = true;
    this.gravity = 0;
    this.velocity = 0.3;
    this.jump = -6;

    this.init(json);
};

Bird.prototype.init = function(json){
    for (var i in json){
        this[i] = json[i];
    }
};

Bird.prototype.flap = function(){
    this.gravity = this.jump;
};

Bird.prototype.update = function(){
    this.gravity += this.velocity;
    this.y += this.gravity;
};

Bird.prototype.isDead = function(height, pipes){
    if (this.y >= height || this.y + this.height <= 0){
        return true;
    }
    for (var i in pipes){
        if (!(
            this.x > pipes[i].x + pipes[i].width ||
			this.x + this.width < pipes[i].x ||
			this.y > pipes[i].y + pipes[i].height ||
			this.y + this.height < pipes[i].y
        )){
            return true;
        }
    }
};

var Pipe = function(json){
    this.x = 0;
    this.y = 0;
    this.width = 50;
    this.height = 40;
    this.speed = 3;

    this.init(json);
};

Pipe.prototype.init = function(json){
    for (var i in json){
        this[i] = json[i];
    }
};

Pipe.prototype.update = function(){
    this.x -= this.speed;
};

Pipe.prototype.isOut = function(){
    if (this.x + this.width < 0){
        return true;
    }
};

var Game = function(){
    this.isGame = false;
    this.pipes = [];
    this.birds = [];
    this.score = 0;
    this.canvas = document.querySelector("#flappy");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.style.width = '100%';
    this.width = this.canvas.width;
    this.height = this.canvas.offsetWidth;
    this.spawnInterval = 90;
    this.interval = 0;
    this.alives = 0;
    this.backgroundSpeed = 0.5;
    this.backgroundx = 0;
    this.maxScore = 0;
    status = 0;
};

Game.prototype.start = function(){
    if (this.isGame){
        return;
    }
    Store.isGame = true;
    speed(FPS_DEFAULT);
    this.isGame = true;
    this.nextUpSpeed = STEP_SCORE_SPEED;
    this.interval = 0;
    this.score = 0;
    this.pipes = [];
    this.birds = [new Bird()];
};
Game.prototype.stop = function(){
    this.isGame = false;
    Store.isGame = false;
    Store.isGameOver = true;
    setTimeout(()=>{
        Store.isGameOver = false;
    }, 3000);
};
Game.prototype.update = function(){
    this.backgroundx += this.backgroundSpeed;
    for (var i in this.birds){
        if (this.birds[i].alive){
            this.birds[i].update();
            if (this.birds[i].isDead(this.height, this.pipes)){
                this.birds[i].alive = false;
                this.alives--;
                if (this.isItEnd()){
                    this.stop();
                }
            }
        }
    }

    for (var i = 0; i < this.pipes.length; i++){
        this.pipes[i].update();
        if (this.pipes[i].isOut()){
            this.pipes.splice(i, 1);
            i--;
        }
    }

    if (this.interval === 0){
        var deltaBord = 50;
        var pipeHoll = 120;
        var hollPosition = Math.round(Math.random() * (this.height - deltaBord * 2 - pipeHoll)) + deltaBord;
        this.pipes.push(new Pipe({x: this.width, y: 0, height: hollPosition}));
        this.pipes.push(new Pipe({x: this.width, y: hollPosition + pipeHoll, height: this.height}));
    }

    this.interval++;
    if (this.interval === this.spawnInterval){
        this.interval = 0;
    }
    if (this.isGame) {
        this.score++;
        status++;
        this.maxScore = (this.score > this.maxScore) ? this.score : this.maxScore;
        if (this.nextUpSpeed <= this.score){
            this.nextUpSpeed += STEP_SCORE_SPEED;
            if (FPS < MAX_SPEED){
                speed(FPS + MULT_SPEED);
            }
        }
    }
    var self = this;

    if (FPS === 0){
        self.update();
    } else {
        setTimeout(function(){
            self.update();
        }, 1000 / FPS);
    }
};


Game.prototype.isItEnd = function(){
    for (var i in this.birds){
        if (this.birds[i].alive){
            return false;
        }
    }
    return true;
};

Game.prototype.display = function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (var i = 0; i < Math.ceil(this.width / images.background.width) + 1; i++){
        this.ctx.drawImage(images.background, i * images.background.width - Math.floor(this.backgroundx % images.background.width), 0);
    }

    for (var i in this.pipes){
        if (i % 2 === 0){
            this.ctx.drawImage(images.pipetop, this.pipes[i].x, this.pipes[i].y + this.pipes[i].height - images.pipetop.height, this.pipes[i].width, images.pipetop.height);
        } else {
            this.ctx.drawImage(images.pipebottom, this.pipes[i].x, this.pipes[i].y, this.pipes[i].width, images.pipetop.height);
        }
    }

    this.ctx.fillStyle = "#FFC600";
    this.ctx.strokeStyle = "#CE9E00";
    for (var i in this.birds){
        if (this.birds[i].alive){
            this.ctx.save();
            this.ctx.translate(this.birds[i].x + this.birds[i].width / 2, this.birds[i].y + this.birds[i].height / 2);
            this.ctx.rotate(Math.PI / 2 * this.birds[i].gravity / 20);
            this.ctx.drawImage(images.bird, -this.birds[i].width / 2, -this.birds[i].height / 2, this.birds[i].width, this.birds[i].height);
            this.ctx.restore();
        }
    }

    this.ctx.fillStyle = "black";
    this.ctx.font = "20px Oswald, sans-serif";
    this.ctx.fillText("Score : " + this.score, 10, 25);
    this.ctx.fillText("Prise Score : 2000", 10, 50);
    this.ctx.fillText("Your deposit : " + $u.thousandSeparator(Store.user.deposit), 10, 75);

    var self = this;
    requestAnimationFrame(function(){
        self.display();
    });
};

let src = 'img2';
window.onload = function(){
    var sprites = {
        bird: 'assets/' + src + '/bird.png',
        background: 'assets/' + src + '/background.png',
        pipetop: 'assets/' + src + '/pipetop.png',
        pipebottom: 'assets/' + src + '/pipebottom.png'
    };

    var start = function(){
        game = new Game();
        game.update();
        game.display();
        game.canvas.addEventListener('mousedown', ()=>{
            flap();
        });
    };
    loadImages(sprites, function(imgs){
        images = imgs;
        start();
    });
};
function flap(){
    if (game.birds[0]){
        game.birds[0].flap();
    }
}
export default {
    start(){
        game.start();
    },
    stop(){
        game.stop();
    },
    status(){
        return status;
    },
    get isGame(){
        return game.isGame;
    }
};
