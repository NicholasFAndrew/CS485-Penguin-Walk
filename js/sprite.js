//Parent Sprite Class
class Sprite {
    constructor(sprite_json, x, y, start_state) {
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "TenderBud";

        this.cur_frame = 0;

        this.cur_bk_data = null;

        this.x_v = 0;
        this.y_v = 0;
    }

    update() {

        let futureX = this.x + this.x_v;
        let futureY = this.y + this.y_v;


        if (futureX < 0) {
            this.x = 0; 
            this.bound_hit('W');
        } else if (futureX + this.width() > window.innerWidth) {
            this.x = window.innerWidth - this.width();
            this.bound_hit('E');
        } else {
            this.x = futureX;
        }


        if (futureY < 0) {
            this.y = 0; 
            this.bound_hit('N');
        } else if (futureY + this.height() > window.innerHeight) {
            this.y = window.innerHeight - this.height(); 
            this.bound_hit('S');
        } else {
            this.y = futureY;
        }


        this.cur_frame = (this.cur_frame + 1) % this.sprite_json[this.root_e][this.state].length;
    }

    width() {
        return this.sprite_json[this.root_e][this.state][this.cur_frame]['w'];
    }

    height() {
        return this.sprite_json[this.root_e][this.state][this.cur_frame]['h'];
    }

    draw() {
        var ctx = canvas.getContext('2d');

        if (this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null) {
            console.log("loading");
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = 'Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }

        if (this.cur_bk_data != null) {
            ctx.putImageData(this.cur_bk_data, (this.x - this.x_v), (this.y - this.y_v));
        }

        this.cur_bk_data = ctx.getImageData(this.x, this.y,
            this.sprite_json[this.root_e][this.state][this.cur_frame]['w'],
            this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);


        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y);

        this.cur_frame = this.cur_frame + 1;
        if (this.cur_frame >= this.sprite_json[this.root_e][this.state].length) {
            this.cur_frame = 0;
        }

        if (this.x >= (window.innerWidth - (this.sprite_json[this.root_e][this.state][this.cur_frame]['w'] + 100))) {
            this.bound_hit('E');
        } else if (this.x <= 0) {
            this.bound_hit('W');
        } else if (this.y >= (window.innerHeight - (this.sprite_json[this.root_e][this.state][this.cur_frame]['h'] + 100))) {
            this.bound_hit('S');
        } else if (this.y <= 15) {
            this.bound_hit('N');
        } else {
            this.x = this.x + this.x_v;
            this.y = this.y + this.y_v;
        }

    }

    set_idle_state() {
        this.x_v = 0;
        this.y_v = 0;
        const idle_states = [
            "idle", "idleBackAndForth", "idleBreathing", "idleFall", "idleLayDown",
            "idleLookAround", "idleLookDown", "idleLookLeft", "idleLookRight",
            "idleLookUp", "idleSit", "idleSpin", "idleWave"
        ];

        const randomIndex = Math.floor(Math.random() * idle_states.length);
        const newState = idle_states[randomIndex];
        console.log(`Changing to random idle state: ${newState}`);
        this.changeState(newState);
    }


    bound_hit(direction) {
        this.x_v = 0;
        this.y_v = 0;
        this.set_idle_state();
		switch (direction) {
			case 'N':
				this.y = this.y + 15
				break;
			case 'S':
				this.y = this.y - 15
				break;
			case 'W':
				this.x = this.x + 15
				break;
			case 'E':
				this.x = this.x - 15
				break;
		}
    }

    changeState(newState) {
        if (this.state != newState) {
            this.state = newState;
            this.cur_frame = 0;
        }
    }
} 


document.addEventListener('keydown', function (event) {
    const speed = 15; 
    switch (event.key) {
        case 'ArrowLeft':
            sprites_to_draw[1][0].x_v = -speed; 
            sprites_to_draw[1][0].changeState('walk_W'); 
            break;
        case 'ArrowRight':
            sprites_to_draw[1][0].x_v = speed; 
            sprites_to_draw[1][0].changeState('walk_E'); 
            break;
        case 'ArrowUp':
            sprites_to_draw[1][0].y_v = -speed;
            sprites_to_draw[1][0].changeState('walk_N'); 
            break;
        case 'ArrowDown':
            sprites_to_draw[1][0].y_v = speed;
            sprites_to_draw[1][0].changeState('walk_S');
            break;
    }
});



document.addEventListener('keyup', function (event) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        sprites_to_draw[1][0].x_v = 0;
        sprites_to_draw[1][0].y_v = 0;
        sprites_to_draw[1][0].set_idle_state();
    }
});


