// set some other properties

import { Calculator, type ICalculatorOptions } from './calculator';
import type { IFormula } from './formula';

export interface ICantOptions {
    background: string;
    formule: IFormula;
    levels: number;
    maxIterations: number;
    maxOverflow: number;
    minOverflow: number;
    edgeBehavior: 'transparent' | 'opaque' | 'reflect';
    initPoints: 'random' | 'regular';
    initNumber: number;
    stopOn10: boolean;
    scrolling: boolean;
    paletteImage?: OffscreenCanvasRenderingContext2D;
}

export type TColorChip = {
    index: number;
    color: string;
};

export class Canticle {
    private destBitmap!: CanvasRenderingContext2D;
    private osCanvas!: OffscreenCanvas;
    private osBitmap!: OffscreenCanvasRenderingContext2D;
    private width!: number;
    private pointsCount!: number;
    private height!: number;
    private points!: number[];
    private colors!: TColorChip[];
    private line = 0;
    private iterations = 0;
    private paused = false;
    private frameRef!: number;
    private iterationCallback?: (iterations: number) => void;
    private pausedCallback?: (state: boolean) => void;

    private calculator!: Calculator;
    constructor(
        private options: ICantOptions,
        canvas?: HTMLCanvasElement,
    ) {
        const dest = canvas?.getContext('2d');
        if (canvas && dest) {
            this.width = canvas.width;

            this.height = canvas.height;
            const oscv = new OffscreenCanvas(this.width, this.height);
            const osCtx = oscv.getContext('2d');
            if (oscv && osCtx) {
                this.osCanvas = oscv;
                this.osBitmap = osCtx;
                this.destBitmap = dest;
                this.pointsCount = this.options.initNumber;
                this.points = [];
                // initialise display colors
                this.initColors(this.options.background ?? '#000', this.options.levels);
            }
        }
    }

    drawCanticle = () => {
        const calcOpts: ICalculatorOptions = {
            width: this.width,
            levels: this.options.levels,
            maxOverflow: this.options.maxOverflow,
            minOverflow: this.options.minOverflow,
            pointsCount: this.options.initNumber,
            initPoints: this.options.initPoints,
            edge: this.options.edgeBehavior,
        };
        this.calculator = new Calculator();
        this.calculator.setupCALine(calcOpts);

        // blank the offscreen bitmap with CAColors[0] (the background color)
        this.osBitmap.fillStyle = this.colors[0].color;
        this.osBitmap.fillRect(0, 0, this.width, this.height);
        // copy this to the destination image as well
        this.destBitmap.drawImage(this.osCanvas, 0, 0);
        this.line = 0;
        this.drawStep();
    };

    drawStep = () => {
        this.points = this.calculator.newCALine(this.options.formule);
        this.drawCALine();
        // blit the offscreen bitmap to the canvas
        this.destBitmap?.drawImage(this.osCanvas, 0, 0);
        // check for image full
        if (this.line < this.height - 1) {
            this.line++;
        } else {
            // image full
            // if scrolling is on then scroll the current image up
            if (this.options.scrolling) {
                // blit full image to screen
                this.destBitmap.drawImage(this.osCanvas, 0, 0);
                // shift offscreen image up
                this.osBitmap.drawImage(this.osCanvas, 0, 1, this.width, this.height - 1, 0, 0, this.width, this.height - 1);
            } else {
                this.line = 0;
            }
        }
        if (this.iterationCallback) {
            this.iterationCallback(this.iterations);
        }
        this.paused =
            this.paused ||
            (this.options.stopOn10 && Math.max(...this.points) < 2) ||
            (this.options.maxIterations > 0 && this.iterations >= this.options.maxIterations);
        if (this.pausedCallback) {
            this.pausedCallback(this.paused);
        }
        if (!this.paused) {
            this.frameRef = requestAnimationFrame(this.drawStep);
        }
        this.iterations++;
    };

    cleanUp = () => {
        cancelAnimationFrame(this.frameRef);
        this.paused = true;
        this.iterationCallback = undefined;
        this.pausedCallback = undefined;
    };

    pauseResume = () => {
        this.paused = !this.paused;
        if (!this.paused) {
            this.drawStep();
        }
    };

    getPoints = () => this.points;

    getColors = (): TColorChip[] => this.colors;

    getIterations = (callback: (iterations: number) => void): void => {
        this.iterationCallback = callback;
    };

    getPausedState = (callback: (state: boolean) => void): void => {
        this.pausedCallback = callback;
    };

    /**
     * draw a line to the offscreen bitmap
     * @param lineNumber The line to draw
     */
    drawCALine = () => {
        //
        // draw a line in the backgroundcolor, so we can skip those pixels later on
        this.osBitmap.fillStyle = this.colors[0].color;
        this.osBitmap.fillRect(0, this.line, this.width, 1);

        // write the current line buffer (thePoints) to the offscreen bitmap
        this.points.forEach((p, i) => {
            // draw the pixel only if it's not in the background color
            if (p > 0) {
                const theColor = this.colors[p];
                this.osBitmap.fillStyle = theColor.color;
                this.osBitmap.fillRect(i, this.line, 1, 1);
            }
        });
    };

    initColors = (CABackColor: string, num: number) => {
        const CAColors: string[] = [];
        let canWidth = 256;
        if (this.options.paletteImage) {
            const ctx = this.options.paletteImage;
            // create color palette with 1 color per pixel
            canWidth = ctx.canvas.width;
            for (let i = 0; i < canWidth; i++) {
                const pixel = ctx.getImageData(i, 0, 1, 1);
                const data = pixel.data;
                const rgbColor = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
                CAColors.push(rgbColor);
            }
        } else {
            // create 256 color palette
            for (let i = 0; i < 255; i++) {
                CAColors.push(`rgb(${i}, ${Math.round(i * 0.8)}, ${Math.round(i * 0.4)})`);
            }
        }
        // map the entire palette to the user selected number of colors
        this.colors = [{ index: 0, color: CABackColor }];
        for (let index = 1; index < num; index++) {
            this.colors.push({ index, color: CAColors[Math.round((index * canWidth) / num)] });
        }
    };
}
