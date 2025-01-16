import type { TEdgeOps } from '../types/edges';
import type { IFormula } from '../types/formula';

export interface ICalculatorOptions {
    width: number;
    levels: number;
    maxOverflow: number;
    minOverflow: number;
    pointsCount: number;
    initPoints: 'random' | 'regular';
    edge: () => TEdgeOps;
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

    newCALine = (formule: IFormula): number[] => {
        //   this calculates a new line from the values in points
        const newPoints = this.points.map((pt, i) => {
            //  use the selected formula
            let newPt = formule.formula(pt, this.getOldPoint(i - 1), this.getOldPoint(i + 1));

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

    private getOldPoint = (index: number) => {
        // this function is used by newCALine, it returns the oldPoint[index],
        // unless index is out of bounds: index > the number of points or index < 0
        // the value returned then is determined by the uncommented lines below
        if (index < 0) {
            switch (this.options.edge()) {
                case 'transparent':
                    return 0;
                case 'opaque':
                    return this.points[0];
                case 'reflect':
                    return this.points[1];
            }
        } else if (index > this.points.length - 1) {
            switch (this.options.edge()) {
                case 'transparent':
                    return 0;
                case 'opaque':
                    return this.points[this.options.width - 1];
                case 'reflect':
                    return this.points[this.options.width - 2]; // reflective
            }
        }
        return this.points[index];
    };
}
