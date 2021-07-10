import React, { useEffect } from "react";
import PlayIcon from './PlayIcon.js';
import './globals';
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from '../audio/donuts-no-3.ogg'
import cueSet1 from "./cueSet1.js";

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

        p5.cueSet1Completed = [];
        
        p5.circleSize = 0;

        p5.circleSizeDivider = 1;

        p5.hueIncrementor = 5;

        p5.hueIncrementorValues = [0, 5, 10, 15, 15, 10, 5];

        p5.preload = () => {
            p5.song = p5.loadSound(audio);
        }

        p5.setup = () => {
            p5.frameRate(30);
            p5.colorMode(p5.HSB, 360, 100, 100, 100);
            p5.canvas = p5.createCanvas(p5.canvasWidth, p5.canvasHeight); 
            p5.circleSize = p5.width / 16;
            p5.smooth();

            //p5.canvas = p5.createCanvas(600, 600);
            p5.noFill();
            p5.strokeWeight(2);

            for (let i = 0; i < cueSet1.length; i++) {
                let vars = {
                    currentCue: i + 1,
                    duration: cueSet1[i].duration,
                    midi: cueSet1[i].midi,
                    time: cueSet1[i].time,
                };
                p5.song.addCue(cueSet1[i].time, p5.executeCueSet1, vars);
            }

        };

        p5.executeCueSet1 = (vars) => {
            const currentCue = vars.currentCue;
            if (!p5.cueSet1Completed.includes(currentCue)) {
                p5.cueSet1Completed.push(currentCue);
                p5.hueIncrementor = p5.hueIncrementorValues[currentCue];
                p5.circleSizeDivider = currentCue > 3 ? p5.circleSizeDivider / 2 : p5.circleSizeDivider * 2;
                p5.clear();
            }
        };

        p5.draw = () => {
            let currentBeat = p5.getSongBeat();
            if (p5.song.isPlaying()) {
                p5.background(10, 1); // translucent background (creates trails)
                let hue = 0;

                // make a x and y grid of ellipses
                for (let x = 0; x <= p5.canvasWidth; x = x + p5.circleSize) {
                    for (let y = 0; y <= p5.canvasHeight; y = y + p5.circleSize) {
                        hue = hue > 360 ? 0 : hue + p5.hueIncrementor;

                        p5.stroke(hue, 100, 100, 50);
                        // starting point of each circle depends on mouse position
                        const xAngle = p5.map(p5.canvasWidth, 0, p5.canvasWidth, -4 * p5.PI, 4 * p5.PI, true);

                        const yAngle = p5.map(p5.canvasHeight, 0, p5.canvasHeight, -4 * p5.PI, 4 * p5.PI, true);
                        // // and also varies based on the particle's location
                        const angle = xAngle * (x / p5.canvasWidth) + yAngle * (y / p5.canvasHeight);

                        // // each particle moves in a circle
                        const myX = x + 20 * p5.cos(2 * p5.PI * p5.time + angle);
                        const myY = y + 20 * p5.sin(2 * p5.PI * p5.time + angle);
                        p5.ellipse(myX, myY, p5.circleSize / p5.circleSizeDivider); // draw particle
                    }
                }

                if (currentBeat !== p5.previousBeat){
                    p5.previousBeat = currentBeat;
                    p5.time = p5.time + (0.225 / 8); // update time
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
