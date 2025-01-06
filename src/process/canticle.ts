// set some other properties

export interface ICantOptions {
    background: string;
    formule: number;
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
    private options!: ICantOptions;
    private line = 0;
    private iterations = 0;
    private paused = false;
    private frameRef!: number;
    private iterationCallback?: (iterations: number) => void;
    private pausedCallback?: (state: boolean) => void;

    constructor(ca_options: ICantOptions, canvas?: HTMLCanvasElement) {
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
                this.options = ca_options;
                this.pointsCount = this.options.initNumber;
                this.points = [];
                // initialise display colors
                this.initColors(this.options.background ?? '#000', this.options.levels);
            }
        }
    }

    drawCanticle = () => {
        // initialise line buffer
        for (let i = 0; i < this.width; i++) {
            this.points[i] = 0;
        }

        // set up initial points
        const randomDist = this.options.initPoints === 'random';
        for (let i = 0; i < this.pointsCount; i++) {
            const hoei = Math.floor(randomDist ? Math.random() * (this.width + 2) : (i + 1) * (this.width / (this.pointsCount + 1)));
            this.points[hoei] = this.colors.length - 1;
        }

        // blank the offscreen bitmap with CAColors[0] (the background color)
        this.osBitmap.fillStyle = this.colors[0].color;
        this.osBitmap.fillRect(0, 0, this.width, this.height);
        // copy this to the destination image as well
        this.destBitmap.drawImage(this.osCanvas, 0, 0);
        this.line = 0;
        this.drawStep();
    };

    drawStep = () => {
        this.points = this.newCALine(this.options.formule, this.colors.length, this.options.edgeBehavior);
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
        this.iterations++;
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

    newCALine = (formule: number, numColors: number, edge: 'transparent' | 'opaque' | 'reflect'): number[] => {
        //   this calculates a new line from the values in points
        return this.points.map((pt, i) => {
            let newPt = 0;
            //  use the selected formula
            switch (formule) {
                case 1:
                    // /* Basis formule */
                    newPt = pt - 1 + 2 * Math.abs(this.getOldPoint(i - 1, edge) - this.getOldPoint(i + 1, edge));
                    break;
                case 2:
                    // /* lijkt op amiga programma */
                    newPt = Math.abs(pt - 1) * (1 + 2 * Math.abs(this.getOldPoint(i - 1, edge) - this.getOldPoint(i + 1, edge)));
                    break;
                case 3:
                    // /* ook wel aardig */
                    newPt = Math.abs(pt - this.getOldPoint(i - 1, edge) - 1) * Math.abs(pt - this.getOldPoint(i + 1, edge) - 1);
                    break;
                case 4:
                    // /* wel aardig */
                    newPt = pt - 1 + this.getOldPoint(i - 1, edge) + this.getOldPoint(i + 1, edge);
                    break;
                case 5:
                    // /* heel mooi */
                    newPt = Math.abs(pt - 1) + 2 * (this.getOldPoint(i - 1, edge) * this.getOldPoint(i + 1, edge));
                    break;
                case 6:
                    //
                    newPt = Math.abs(pt - 1) + 3 * (this.getOldPoint(i - 1, edge) + this.getOldPoint(i + 1, edge));
                    break;
                case 7:
                    newPt = Math.abs(pt - 1) + 2 * (this.getOldPoint(i - 1, edge) + this.getOldPoint(i + 1, edge));
                    break;
                case 8:
                    // /* kerstboom met kaarsjes */
                    newPt = 1 - pt + 2 * (this.getOldPoint(i - 1, edge) + this.getOldPoint(i + 1, edge));
                    break;
                case 9:
                    // /* wel aardig */
                    newPt = (pt + this.getOldPoint(i - 1, edge) + this.getOldPoint(i + 1, edge)) / 3;
                    break;
            }

            // bounds checking and appropriate action on over- or underflow
            if (newPt > numColors - 1) {
                switch (this.options.maxOverflow) {
                    case 1:
                        newPt = 0;
                        break;
                    case 2:
                        newPt -= numColors;
                        break;
                    case 3:
                        newPt = pt;
                        break;
                    case 4:
                        newPt = numColors - 1;
                        break;
                    case 5:
                        newPt = numColors - (newPt - numColors);
                        break;
                }
            } else if (newPt < 0) {
                switch (this.options.minOverflow) {
                    case 1:
                        newPt = 0;
                        break;
                    case 2:
                        newPt += numColors;
                        break;
                    case 3:
                        newPt = pt;
                        break;
                    case 4:
                        newPt = numColors - 1;
                        break;
                    case 5:
                        newPt = Math.abs(newPt);
                        break;
                }
            }
            return newPt;
        });
    };

    getOldPoint = (index: number, edge: 'transparent' | 'opaque' | 'reflect' = 'reflect') => {
        // this function is used by newCALine, it returns the oldPoint[index],
        // unless index is out of bounds: index > the number of points or index < 0
        // the value returned then is determined by the uncommented lines below
        if (index < 0) {
            switch (edge) {
                case 'transparent':
                    return 0;
                case 'opaque':
                    return this.points[0];
                case 'reflect':
                    return this.points[1];
            }
        } else if (index > this.points.length - 1) {
            switch (edge) {
                case 'transparent':
                    return 0;
                case 'opaque':
                    return this.points[this.width];
                case 'reflect':
                    return this.points[this.width - 1]; // reflective
            }
        }
        return this.points[index];
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
