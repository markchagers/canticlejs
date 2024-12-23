// set some other properties

export interface ICantOptions {
    formule: number;
    updateInterval: number;
    maxOverflow: number;
    minOverflow: number;
    edgeBehavior: 'transparent' | 'opaque' | 'reflect';
    initPoints: 'random' | 'regular';
    initNumber: number;
}

export const drawCanticle = (canvas: HTMLCanvasElement, options: ICantOptions) => {
    const destImg = canvas.getContext('2d');
    const theWidth = canvas.width;
    const numberOfPts = options.initNumber;
    const theHeight = canvas.height;
    let thePoints: number[] = [];

    // initialise display colors
    const CAColors = initColors('#000', 32);

    // initialise line buffer
    for (let i = 0; i < theWidth; i++) {
        thePoints[i] = 0;
    }

    // set up initial points
    const randomDist = options.initPoints === 'random';
    for (let i = 0; i < numberOfPts; i++) {
        const hoei = Math.round(randomDist ? Math.random() * (theWidth + 2) : (i * theWidth) / (numberOfPts + 1));
        thePoints[hoei] = CAColors.length - 1;
    }

    let myUpdate = 1;

    // some other props, to be exposed in dialog later
    const osbm = new OffscreenCanvas(theWidth, theHeight);
    const myOffScreen = osbm.getContext('2d');
    if (myOffScreen && destImg) {
        // blank the offscreen bitmap with CAColors[1] (the background color)
        myOffScreen.fillRect(0, 0, theWidth, theHeight);
        // copy this to the destination image as well
        destImg.drawImage(osbm, 0, 0);
        let oldPoints = thePoints.slice(0);
        for (let i = 0; i < theHeight; i++) {
            thePoints = newCALine(oldPoints, options.formule, CAColors.length, options);
            drawCALine(i, thePoints, CAColors, myOffScreen);
            oldPoints = thePoints.slice(0);

            // check for image full
            // if (lineNumber < myOffScreen.height - 1) {
            //     lineNumber = lineNumber + 1
            // } else {
            //     // image full
            //     // if scrolling is on then scroll the current image up the current chunk size in pixels
            //     if (scrolling) {
            //         // blit full image to screen
            //         destImg.copyPixels(myOffScreen, theRect, theRect)
            //         // shift offscreen image up
            //         myOffScreen.copyPixels(
            //             myOffScreen,
            //             rect(0, 0, theWidth, theHeight - updateInterval),
            //             rect(0, updateInterval, theWidth, theHeight),
            //         )
            //         // set the next line to draw
            //         lineNumber = lineNumber - updateInterval + 1
            //         // set myUpdate = 0, so no update comes before the screen is full again
            //         myUpdate = 0
            //     } else {
            //         lineNumber = 0
            //     }
            // }

            // blit the offscreen bitmap to stage if specified chunk size has been rendered
            // further optimisation is possible here
            if (options.updateInterval <= myUpdate) {
                destImg.drawImage(osbm, 0, 0);
                myUpdate = 0;
            }
            myUpdate++;
        }
    }
};

const newCALine = (points: number[], formule: number, numColors: number, options: ICantOptions): number[] => {
    //   this calculates a new line from the values in points
    //   the new values are returned, will be drawn by drawCALine
    return points.map((element, i, arr) => {
        let newEl = 0;
        //  use the selected formula
        switch (formule) {
            case 1:
                // /* zeer faksinerend!!*/
                newEl =
                    element -
                    1 +
                    2 * Math.abs(getOldPoint(i - 1, arr, options.edgeBehavior) - getOldPoint(i + 1, arr, options.edgeBehavior));
                break;
            case 2:
                // /* nog dichter bij amiga programma! */
                newEl =
                    Math.abs(element - 1) *
                    (1 + 2 * Math.abs(getOldPoint(i - 1, arr, options.edgeBehavior) - getOldPoint(i + 1, arr, options.edgeBehavior)));
                break;
            case 3:
                // /* ook wel aardig */
                newEl =
                    Math.abs(element - getOldPoint(i - 1, arr, options.edgeBehavior) - 1) *
                    Math.abs(element - getOldPoint(i + 1, arr, options.edgeBehavior) - 1);
                break;
            case 4:
                // /* wel aardig */
                newEl = element - 1 + getOldPoint(i - 1, arr, options.edgeBehavior) + getOldPoint(i + 1, arr, options.edgeBehavior);
                break;
            case 5:
                // /* heel mooi */
                newEl =
                    Math.abs(element - 1) +
                    2 * (getOldPoint(i - 1, arr, options.edgeBehavior) * getOldPoint(i + 1, arr, options.edgeBehavior));
                break;
            case 6:
                newEl =
                    Math.abs(element - 1) +
                    3 * (getOldPoint(i - 1, arr, options.edgeBehavior) + getOldPoint(i + 1, arr, options.edgeBehavior));
                break;
            case 7:
                newEl =
                    Math.abs(element - 1) +
                    2 * (getOldPoint(i - 1, arr, options.edgeBehavior) + getOldPoint(i + 1, arr, options.edgeBehavior));
                break;
            case 8:
                // /* kerstboom met kaarsjes */
                newEl = 1 - element + 2 * (getOldPoint(i - 1, arr, options.edgeBehavior) + getOldPoint(i + 1, arr, options.edgeBehavior));
                break;
            case 9:
                // /* wel aardig */
                newEl = (element + getOldPoint(i - 1, arr, options.edgeBehavior) + getOldPoint(i + 1, arr, options.edgeBehavior)) / 3;
                break;
        }

        // bounds checking and appropriate action on over- or underflow
        if (newEl > numColors - 1) {
            switch (options.maxOverflow) {
                case 1:
                    newEl = 0;
                    break;
                case 2:
                    newEl -= numColors;
                    break;
                case 3:
                    newEl = element;
                    break;
                case 4:
                    newEl = numColors - 1;
                    break;
                case 5:
                    newEl = numColors - (newEl - numColors);
                    break;
            }
        } else if (newEl < 0) {
            switch (options.minOverflow) {
                case 1:
                    newEl = 0;
                    break;
                case 2:
                    newEl += numColors;
                    break;
                case 3:
                    newEl = element;
                    break;
                case 4:
                    newEl = numColors - 1;
                    break;
                case 5:
                    newEl = Math.abs(newEl);
                    break;
            }
        }
        return newEl;
    });
};

const getOldPoint = (index: number, points: number[], edge: 'transparent' | 'opaque' | 'reflect' = 'reflect') => {
    // this function is used by newCALine, it returns the oldPoint[index],
    // unless index is out of bounds: index > the number of colors or index < 1
    // the value returned then is determined by the uncommented lines below
    if (index < 0) {
        switch (edge) {
            case 'transparent':
                return 0;
            case 'opaque':
                return points[0];
            case 'reflect':
                return points[1];
        }
    } else if (index > points.length - 1) {
        switch (edge) {
            case 'transparent':
                return 0;
            case 'opaque':
                return points[points.length - 1];
            case 'reflect':
                return points[points.length - 2]; // reflective
        }
    }
    return points[index];
};

const drawCALine = (lineNumber: number, thePoints: number[], CAColors: string[], myOffScreen: OffscreenCanvasRenderingContext2D) => {
    // draw a line to the offscreen bitmap
    const theWidth = thePoints.length;
    // draw a line in the backgroundcolor, so we can skip those pixels later on
    myOffScreen.moveTo(0, lineNumber);
    myOffScreen.fillStyle = CAColors[0];
    myOffScreen.lineTo(theWidth, lineNumber); //, CABackColor)

    // write the current line buffer (thePoints) to the offscreen bitmap
    thePoints.forEach((p, i) => {
        // draw the pixel only if it's not in the background color
        if (p > 0) {
            const theColor = CAColors[p];
            myOffScreen.fillStyle = theColor;
            myOffScreen.fillRect(i, lineNumber, 1, 1);
        }
    });
};

const initColors = (CABackColor: string, numColors: number): string[] => {
    // create 256 color palette
    const colors: string[] = [];
    for (let i = 0; i < 255; i++) {
        colors.push(`rgb(${256 - i}, ${i}, ${Math.round(i / 2)})`);
    }
    // map the entire palette to the user selected number of colors
    const CAColors = [CABackColor];
    for (let i = 1; i < numColors; i++) {
        CAColors.push(colors[Math.round((i * 255) / numColors)]);
    }
    return CAColors;
};
