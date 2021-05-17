/*
* Control Time Loop & FPSCounter
* Author: Piyapan K
* Date: 12/07/2020
* */

class MyLoop
{
    constructor(canvasObj)
    {
        this.canvas       = canvasObj;
        this.ctx          = canvasObj.getContext();
        this.loop         = -1;
        this.flag         = 0;
        this.counter      = 0;
        this.previousTime = Date.now();
        this.elapsedTime  = 0;

        this.fpsCounter   = -1;
        this.drawables    = [];
    }

    setDrawables(drawables)
    {
        this.drawables = drawables;
    }

    getLoopStatus()
    {
        return this.loop;
    }

    getCounter()
    {
        return this.counter;
    }

    init()
    {
        // Prepare Resources //
        //this.fpsCounter = new FPSCounter();
    }

    update()
    {
        let currentTime   = Date.now();
        let previousTime  = this.previousTime;
        this.elapsedTime  = currentTime - previousTime;
        //this.fpsCounter.update(this.elapsedTime);
        for(let i = 0; i <= this.drawables.length - 1; i++) {
            if(this.drawables[i] !== null)
                this.drawables[i].update(this.elapsedTime);
        }
        this.previousTime = currentTime;
    }

    run()
    {
        // Start the loop timer //
        if(this.flag === 1) {
            this.loop = window.setTimeout(this.run.bind(this), 0);
            this.canvas.render();
            this.update();
        }
    }

    start()
    {
        if(this.flag === 0) {
            this.flag = 1;
            this.run();
        }
        else
            console.log("Loop has already started.");
    }

    stop()
    {
        // Stop the loop timer //
        clearInterval(this.loop);
        this.counter = 0;
        this.loop = 0;
        this.flag = 0;
    }
}

class FPSCounter
{
    constructor()
    {
        this.fps     = 0;
        this.time    = 0;
        this.counter = 0;
        this.draws   = 0;
    }

    getFPS()
    {
        return this.fps;
    }

    update(elapsedTime)
    {
        this.time += elapsedTime;
        this.writeCounter(this.counter);
        if(this.time > 1000)
        {
            this.fps = Math.round(this.draws * 1000 / this.time);
            this.writeFPS(this.fps);
            this.time = 0;
            this.draws = 0;
            this.counter++;
        }
    }

    draw()
    {
        this.draws++;
    }

    writeFPS(fps)
    {
        document.getElementById("txt_fps").innerHTML = fps;
    }

    writeCounter(counter)
    {
        document.getElementById("txt_counter").innerHTML = counter;
    }
}