// set some other properties

export interface ICantOptions {
    formule: number;
    updateInterval: number;
    maxOverflow: number;
    minOverflow: number;
    edgeBehavior: 'transparent' | 'opaque' | 'reflect';
    initPoints: 'random' | 'regular';
    initNumber: number;
    scrolling: boolean;
}

export const Formula = new Map<string, number>([
    ['zeer faksinerend!!', 1],
    ['nog dichter bij amiga programma!', 2],
    ['ook wel aardig', 3],
    ['wel aardig', 4],
    ['heel mooi', 5],
    ['formule 6', 6],
    ['formule 7', 7],
    ['kerstboom met kaarsjes', 8],
    ['wel aardig 3', 9],
]);

export class Canticle {
    private destImg!: CanvasRenderingContext2D;
    private osCanvas!: OffscreenCanvas;
    private osBitmap!: OffscreenCanvasRenderingContext2D;
    private theWidth!: number;
    private numberOfPts!: number;
    private theHeight!: number;
    private thePoints!: number[];
    private oldPoints!: number[];
    private CAColors!: string[];
    private options!: ICantOptions;
    private line = 0;
    private myUpdate = 0;

    constructor(canvas: HTMLCanvasElement, ca_options: ICantOptions) {
        const dest = canvas.getContext('2d');
        if (dest) {
            // some other props, to be exposed in dialog later
            this.theWidth = canvas.width;
            this.theHeight = canvas.height;
            const osbm = new OffscreenCanvas(this.theWidth, this.theHeight);
            const osCtx = osbm.getContext('2d');
            if (osbm && osCtx) {
                this.osCanvas = osbm;
                this.osBitmap = osCtx;
                this.destImg = dest;
                this.options = ca_options;
                this.numberOfPts = this.options.initNumber;
                this.thePoints = [];
                // initialise display colors
                this.CAColors = this.initColors('#000', 32);
            }
        }
    }

    drawCanticle = () => {
        // initialise line buffer
        for (let i = 0; i < this.theWidth; i++) {
            this.thePoints[i] = 0;
        }

        // set up initial points
        const randomDist = this.options.initPoints === 'random';
        for (let i = 0; i < this.numberOfPts; i++) {
            const hoei = Math.round(randomDist ? Math.random() * (this.theWidth + 2) : (i * this.theWidth) / (this.numberOfPts + 1));
            this.thePoints[hoei] = this.CAColors.length - 1;
        }

        this.myUpdate = 1;

        // blank the offscreen bitmap with CAColors[1] (the background color)
        this.osBitmap.fillRect(0, 0, this.theWidth, this.theHeight);
        // copy this to the destination image as well
        this.destImg.drawImage(this.osCanvas, 0, 0);
        this.oldPoints = this.thePoints.slice(0);
        this.line = 0;
        requestAnimationFrame(this.drawStep);
    };

    drawStep = () => {
        this.thePoints = this.newCALine(this.options.formule, this.CAColors.length, this.options.edgeBehavior);
        this.drawCALine();
        this.oldPoints = this.thePoints.slice(0);
        // blit the offscreen bitmap to stage if specified chunk size has been rendered
        // further optimisation is possible here
        if (this.options.updateInterval <= this.myUpdate) {
            this.destImg?.drawImage(this.osCanvas, 0, 0);
            this.myUpdate = 0;
        }
        this.myUpdate++;
        // check for image full
        if (this.line < this.theHeight - 1) {
            this.line++;
        } else {
            // image full
            // if scrolling is on then scroll the current image up the current chunk size in pixels
            if (this.options.scrolling) {
                // blit full image to screen
                this.destImg.drawImage(this.osCanvas, 0, 0);
                // shift offscreen image up
                this.osBitmap.drawImage(
                    this.osCanvas,
                    0,
                    this.options.updateInterval,
                    this.theWidth,
                    this.theHeight - this.options.updateInterval,
                    0,
                    0,
                    this.theWidth,
                    this.theHeight - this.options.updateInterval,
                );
                // set the next line to draw
                this.line = this.line - this.options.updateInterval + 1;
                // set myUpdate = 0, so no update comes before the screen is full again
                this.myUpdate = 0;
            } else {
                this.line = 0;
            }
        }
        requestAnimationFrame(this.drawStep);
    };

    newCALine = (formule: number, numColors: number, edge: 'transparent' | 'opaque' | 'reflect'): number[] => {
        //   this calculates a new line from the values in points
        //   the new values are returned, will be drawn by drawCALine
        return this.thePoints.map((pt, i) => {
            let newPt = 0;
            //  use the selected formula
            switch (formule) {
                case 1:
                    // /* zeer faksinerend!!*/
                    newPt = pt - 1 + 2 * Math.abs(this.getOldPoint(i - 1, edge) - this.getOldPoint(i + 1, edge));
                    break;
                case 2:
                    // /* nog dichter bij amiga programma! */
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
        // unless index is out of bounds: index > the number of colors or index < 1
        // the value returned then is determined by the uncommented lines below
        if (index < 0) {
            switch (edge) {
                case 'transparent':
                    return 0;
                case 'opaque':
                    return this.thePoints[0];
                case 'reflect':
                    return this.thePoints[1];
            }
        } else if (index > this.thePoints.length - 1) {
            switch (edge) {
                case 'transparent':
                    return 0;
                case 'opaque':
                    return this.thePoints[this.theWidth - 1];
                case 'reflect':
                    return this.thePoints[this.theWidth - 2]; // reflective
            }
        }
        return this.thePoints[index];
    };

    /**
     * draw a line to the offscreen bitmap
     * @param lineNumber The line to draw
     */
    drawCALine = () => {
        //
        // draw a line in the backgroundcolor, so we can skip those pixels later on
        this.osBitmap.fillStyle = this.CAColors[0];
        this.osBitmap.fillRect(0, this.line, this.theWidth, 1);

        // write the current line buffer (thePoints) to the offscreen bitmap
        this.thePoints.forEach((p, i) => {
            // draw the pixel only if it's not in the background color
            if (p > 0) {
                const theColor = this.CAColors[p];
                this.osBitmap.fillStyle = theColor;
                this.osBitmap.fillRect(i, this.line, 1, 1);
            }
        });
    };

    initColors = (CABackColor: string, num: number): string[] => {
        // create 256 color palette
        const colors: string[] = [];
        for (let i = 0; i < 255; i++) {
            colors.push(`rgb(${Math.round(i / 2)}, ${i}, ${256 - i})`);
        }
        // map the entire palette to the user selected number of colors
        const CAColors = [CABackColor];
        for (let i = 1; i < num; i++) {
            CAColors.push(colors[Math.round((i * 255) / num)]);
        }
        return CAColors;
    };
}
