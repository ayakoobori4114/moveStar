const BROWSER_WIDTH = window.innerWidth; //width길이 저장
const BROWSER_HEIGHT = window.innerHeight; //height길이 저장
const MAX_STAR = (BROWSER_WIDTH * BROWSER_HEIGHT) / 20000; // 화면에 별의 개수
const FRAME_DELAY = 60; //프레임출력 후 다음프레임 출력까지 delayTime;
const canvas = document.querySelector('.background'); //별이 그려지게 될 canvas 태그 영역
const context = canvas.getContext('2d');
const gradient = null; //별의 효과 저장 (프레임마다 별의 수만큼 변수를 생성하지 않기 위해)
const pixies = new Array(); // 별 한개씩 저장하는 배열

//화면 크기 조정
function setDimensions(e){
    BROWSER_WIDTH = window.innerWidth;
    BROWSER_HEIGHT = window.innerHeight;
    MAX_STAR = (BROWSER_WIDTH * BROWSER_HEIGHT) / 20000;
    canvas.width = BROWSER_WIDTH;
    canvas.height = BROWSER_HEIGHT;
    console.log("Resize to " + BROWSER_WIDTH + "x" + BROWSER_HEIGHT);
}

setDimensions();
window.addEventListener('resize', setDimensions);

function Circle(){
    this.settings = {ttl:8000, xmas:5, ymax:2, rmin:8, rmax:15, drt:1};

    this.reset = function(){
        this.x = BROWSER_WIDTH * Math.random();
        this.y = BROWSER_HEIGHT * Math.random();
        this.r = ((this.settings.rmax - 1) * Math.random()) + 1;
        this.dx = (Math.random() * this.settings.xmas) * (Math.random() < .5? -1 : 1);
        this.dy = (Math.random() * this.settings.ymax) * (Math.random() < .5? -1 : 1);
        this.hl = (this.settings.ttl / FRAME_DELAY) * (this.r/this.settings.rmax);
        this.rt = 0;
        this.settings.drt = Math.random() + 1;
        this.stop = Math.random() * .2 + .4;
    }

    this.fade = function(){
        this.rt += this.settings.drt;

        if(this.rt >= this.hl) {
            this.rt = this.hl;
            this.settings.drt = this.settings.drt * -1;
        } else if (this.rt < 0) {
            this.reset();
        }
    }

    this.draw = function(){
        const newo = (this.rt/this.hl);
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        context.closePath();

        const cr = this.r * newo;
        gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr < this.settings.rmin) ? this.settings.rmin : cr);
        gradient.addColorStop(0.0, 'rgba(255,255,255,'+newo+')');
        gradient.addColorStop(this.stop, 'rgba(77,101,181,' +(newo*.6)+')');
        gradient.addColorStop(1.0,'rgba(77,101,181,0)');
        context.fillStyle = gradient;
        context.fill();
    }
    this.move = function(){
        this.x += (1 - this.rt/this.hl) * this.dx;
        this.y += (1 - this.rt/this.hl) * this.dy;
        if(this.x > BROWSER_WIDTH || this.x < 0) this.dx *= -1;
        if(this.y > BROWSER_HEIGHT || this.y < 0) this.dy *= -1;
    }
}

function draw(){
    context.clearRect(0, 0, BROWSER_WIDTH, BROWSER_HEIGHT);

    for(let i = 0; pixies.length; i < MAX_STAR; i++){
        pixies[i].fade();
        pixies[i].move();
        pixies[i].draw();
    }
}

setInterval(draw, FRAME_DELAY);