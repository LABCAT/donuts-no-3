import React, { useEffect } from "react";
import PlayIcon from './PlayIcon.js';
import './globals';
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from '../audio/waves-no-1.mp3'

const P5Sketch = () => {

    const Sketch = p5 => {

        p5.canvas = null;

        p5.framesPerSecond = 24;

        p5.canvasWidth = window.innerWidth;

        p5.canvasHeight = window.innerHeight;

        p5.song = null;

        p5.tempo = 97;

        p5.time = 0;

        p5.previousBeat = 0;

        p5.createParticle = false;

        p5.particlesArray = [];

        p5.setup = () => {
            p5.song = p5.loadSound(audio);
            p5.colorMode(p5.HSB, 360, 100, 100, 100);
            p5.canvas = p5.createCanvas(p5.canvasWidth, p5.canvasHeight); 
            //p5.background(0,0,94);
            p5.smooth();

            //p5.canvas = p5.createCanvas(600, 600);
            p5.noFill();
            p5.strokeWeight(2);

        };

        p5.draw = () => {
            let currentBeat = p5.getSongBeat();
            // if (p5.song._lastPos > 0 && currentBar >= 0 && p5.song.isPlaying()) {


            // }
            if (p5.song.isPlaying()) {
                p5.background(10, 1); // translucent background (creates trails)
                let hue = 0;
                let circleSize = 180 - (p5.time * 10);
                circleSize = circleSize > 30 ? circleSize : 30;
                circleSize = 45 + p5.time;

                // make a x and y grid of ellipses
                for (let x = 0; x <= p5.canvasWidth; x = x + circleSize) {
                    for (let y = 0; y <= p5.canvasHeight; y = y + circleSize) {
                        hue = (y % 24) * 15;
                        p5.stroke(hue, 100, 100, 50);
                        // starting point of each circle depends on mouse position
                        const xAngle = p5.map(p5.canvasWidth, 0, p5.canvasWidth, -4 * p5.PI, 4 * p5.PI, true);

                        const yAngle = p5.map(p5.canvasHeight, 0, p5.canvasHeight, -4 * p5.PI, 4 * p5.PI, true);
                        // // and also varies based on the particle's location
                        const angle = xAngle * (x / p5.canvasWidth) + yAngle * (y / p5.canvasHeight);

                        // // each particle moves in a circle
                        const myX = x + 20 * p5.cos(2 * p5.PI * p5.time + angle);
                        const myY = y + 20 * p5.sin(2 * p5.PI * p5.time + angle);
                        p5.ellipse(myX, myY, circleSize/3); // draw particle
                    }
                }

                if (currentBeat != p5.previousBeat){
                    p5.previousBeat = currentBeat;
                    p5.time = p5.time + (0.225 / 8); // update time
                    console.log('// update time', p5.time);
                    console.log('// lsast', p5.song._lastPos);
                }
                
            }
        };

        p5.beatPerBar = 4;

        p5.getSongBeat = () => {
            if (p5.song && p5.song.buffer) {
                const barAsBufferLength = (p5.song.buffer.sampleRate * 60 / p5.tempo) / 8;
                return Math.floor(p5.song._lastPos / barAsBufferLength) + 1;
            }
            return -1;
        }


        p5.getSongBar = () => {
            if (p5.song && p5.song.buffer) {
                const barAsBufferLength = (p5.song.buffer.sampleRate * 60 / p5.tempo) * p5.beatPerBar;
                return Math.floor(p5.song._lastPos / barAsBufferLength) + 1;
            }
            return -1;
        }

        p5.mousePressed = () => {
            if (p5.song.isPlaying()) {
                p5.song.pause();
            } else {
                document.getElementById("play-icon").classList.add("fade-out");
                p5.canvas.addClass('fade-in');
                p5.song.play();
            }
            p5.createParticle = true;
        };

        p5.mouseReleased = () => {
            p5.createParticle = false;
        };

        p5.updateCanvasDimensions = () => {
            p5.canvasWidth = window.innerWidth;
            p5.canvasHeight = window.innerHeight;
            p5.createCanvas(p5.canvasWidth, p5.canvasHeight);
            p5.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p5.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p5.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <PlayIcon />
        </>
    );
};

export default P5Sketch;
