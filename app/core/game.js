import Store from '../Store';
import $u from '../core/utils';
import api from '../core/api';
import config from '../../config';

let game;
let c = {};
let src = 'img2';
const c_default = {
    status: 0,
    t: null,
    tLastSend: null,
    id: null
};
function init(){
    function checkGame() {
        c.tLastSend = $u.unix();
        api({action: 'checkGame', data: c}, data => {
            if (!data.success){
                game.stop();
                Store.$notify({
                    type: 'error',
                    group: 'foo',
                    title: 'Error ' + data.msg,
                    text: data.msg
                });
                return;
            }

            if (data.isWin){
                game.stop();
                Store.$notify({
                    type: 'success',
                    group: 'foo',
                    title: 'WINNER!',
                    text: 'Поздравляем! Вы выиграли ' + data.prise + ' ' + config.coinName
                });
                Store.updateUser();
                return;
            }
            c.t = data.t;
            c.id = data.id;
            setTimeout(()=>{
                if (!game.isGame || data.id !== c.id){
                    return;
                }
                checkGame();
            }, 3000);
        });
    };
    let KOEF;
    var FPS_DEFAULT = 60;
    var FPS = FPS_DEFAULT;
    var MULT_SPEED = 5; // увеличение скорости на
    var MAX_SPEED = 150; // Максимальная скорость
    var STEP_SCORE_SPEED = 500; // Шаг увеличения скорости

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
        this.x = 80 * KOEF;
        this.y = 250 * KOEF;
        this.width = 40 * KOEF * 1.1;
        this.height = 30 * KOEF * 1.1;

        this.alive = true;
        this.gravity = 0;
        this.velocity = 0.3 * KOEF;
        this.jump = -7 * KOEF;

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
        this.width = 50 * KOEF;
        this.height = 40 * KOEF;
        this.speed = 4 * KOEF;

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
        this.bird = {};
        this.score = 0;
        this.canvas = document.querySelector("#flappy");
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.spawnInterval = 90;
        this.interval = 0;
        this.alives = 0;
        this.backgroundSpeed = 0.5;
        this.backgroundx = 0;
        this.maxScore = 0;
    };

    Game.prototype.start = function(data){
        if (this.isGame){
            return;
        }
		Store.updatePublic();
        c = $u.clone(c_default);
        c.t = data.t;
        c.id = data.id;
        checkGame();
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        Store.isGame = true;
        this.isGame = true;
		speed(FPS_DEFAULT);
        this.nextUpSpeed = STEP_SCORE_SPEED;
        this.interval = 0;
        this.score = 0;
        this.pipes = [];
        this.bird = new Bird();
    };
    Game.prototype.stop = function(){
		if(!this.isGame){
			return;
		}
        this.bird.alive = false;
        this.isGame = false;
        Store.isGame = false;
        Store.isGameOver = true;
        Store.updatePublic();
        setTimeout(()=>{
            Store.isGameOver = false;
        }, 3000);
    };

    Game.prototype.update = function(){
        this.backgroundx += this.backgroundSpeed;
        const {bird} = this;
        if (bird.alive && this.isGame){
            bird.update();
            if (bird.isDead(this.height, this.pipes)){
                bird.alive = false;
                this.alives--;
                if (this.isItEnd()){
                    this.stop();
					api({action: 'loseGame', data: c});
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
            var deltaBord = 60 * KOEF;
            var pipeHoll = 140 * KOEF;
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
            c.status++;
            if (c.status >= Store.system.nextWinLine){
                checkGame(); // win!
                this.stop();
            }
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
        if (this.bird.alive){
            return false;
        }
        return true;
    };

    Game.prototype.display = function(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (var i = 0; i < Math.ceil(this.width / images.background.width) + 1; i++){
            this.ctx.drawImage(images.background, i * images.background.width - Math.floor(this.backgroundx % images.background.width), this.height - images.background.height);
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
        const {bird} = this;
        if (bird.alive) {
            this.ctx.save();
            this.ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
            this.ctx.rotate(Math.PI / 2 * bird.gravity / 20);
            this.ctx.drawImage(images.bird, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
            this.ctx.restore();
        }

        this.ctx.fillStyle = 'black';
        this.ctx.font = '21px Oswald, sans-serif';
        this.ctx.fillText('Prise :' + $u.thousandSeparator(Store.system.totalBank / 2) + config.coinName, 10, 25);
        this.ctx.fillText('Score :' + Store.system.nextWinLine, 10, 50);
        this.ctx.font = '20px Oswald, sans-serif';
        this.ctx.fillText('Your score : ' + this.score, 10, 75);
        this.ctx.fillText('Your deposit : ' + $u.thousandSeparator(Store.user.deposit), 10, 100);

        var self = this;
        requestAnimationFrame(function(){
            self.display();
        });
    };


    const width = document.getElementById('main').offsetWidth;
    KOEF = width / 500;
    const height = KOEF * 650;
    // debag({KOEF});
    document.querySelector('#canvas-container').innerHTML = '<canvas id="flappy" width="' + width + '" height="' + height + '"></canvas>';

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
        if (game.bird && game.bird.flap){
            game.bird.flap();
        }
    }
}

export default {
    start(){
        game.start(...arguments);
    },
    init,
    get isGame(){
        return game.isGame;
    }
};
const debagEl = document.getElementById('debag');
window.debag = (str)=>{
    if (typeof str === 'object'){
        str = JSON.stringify(str);
    }
    const el = document.createElement('div');
    el.innerHTML = str;
    debagEl.appendChild(el);
};
