export class Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;

    constructor(initialX: number, initialY: number, vx: number, vy:number ) {
        this.x = initialX;
        this.y = initialY;
        this.vx = vx;
        this.vy = vy;
    }

}