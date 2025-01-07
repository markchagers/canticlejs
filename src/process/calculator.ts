export interface ICalculatorOptions {
    width: number;
    levels: number;
    maxOverflow: number;
    minOverflow: number;
    pointsCount: number;
    initPoints: 'random' | 'regular';
}

export class Calculator {
    private points: number[] = [];
    private options!: ICalculatorOptions;

    setupCALine = (options: ICalculatorOptions) => {
        this.options = options;
        for (let i = 0; i < this.options.width; i++) {
            this.points[i] = 0;
        }

        // set up initial points
        const randomDist = this.options.initPoints === 'random';
        for (let i = 0; i < this.options.pointsCount; i++) {
            const hoei = Math.floor(
                randomDist ? Math.random() * (this.options.width + 2) : (i + 1) * (this.options.width / (this.options.pointsCount + 1)),
            );
            this.points[hoei] = this.options.levels - 1;
        }
    };

    newCALine = (formule: number, edge: 'transparent' | 'opaque' | 'reflect'): number[] => {
        //   this calculates a new line from the values in points
        const newPoints = this.points.map((pt, i) => {
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
            if (newPt > this.options.levels - 1) {
                switch (this.options.maxOverflow) {
                    case 1:
                        newPt = 0;
                        break;
                    case 2:
                        newPt -= this.options.levels;
                        break;
                    case 3:
                        newPt = pt;
                        break;
                    case 4:
                        newPt = this.options.levels - 1;
                        break;
                    case 5:
                        newPt = this.options.levels - (newPt - this.options.levels);
                        break;
                }
            } else if (newPt < 0) {
                switch (this.options.minOverflow) {
                    case 1:
                        newPt = 0;
                        break;
                    case 2:
                        newPt += this.options.levels;
                        break;
                    case 3:
                        newPt = pt;
                        break;
                    case 4:
                        newPt = this.options.levels - 1;
                        break;
                    case 5:
                        newPt = Math.abs(newPt);
                        break;
                }
            }
            return newPt;
        });
        this.points = newPoints;
        return newPoints;
    };

    private getOldPoint = (index: number, edge: 'transparent' | 'opaque' | 'reflect' = 'reflect') => {
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
                    return this.points[this.options.width];
                case 'reflect':
                    return this.points[this.options.width - 1]; // reflective
            }
        }
        return this.points[index];
    };
}
