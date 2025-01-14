import { Calculator, type ICalculatorOptions } from './calculator.ts';
import { initFormulae, type IFormula } from './formula.ts';

const testFormula = (formule: IFormula, depth: number, minDepth: number) => {
    for (let i = 0; i < 256; i++) {
        const res = testLevelDepth(formule, i, depth);
        if (res.iterations > minDepth) {
            console.log(`{ "formule": ${formule}, "levels": ${i}, "iterations": ${res.iterations}, "herhalingen": ${res.repeatCount} },`);
        }
    }
};

const testLevelDepth = (formule: IFormula, levels: number, depth: number) => {
    const options: ICalculatorOptions = {
        levels,
        maxOverflow: 1,
        minOverflow: 1,
        initPoints: 'regular',
        pointsCount: 1,
        width: 1001,
        edge: 'transparent',
    };

    const repeatLines: string[] = [];
    let matchIndex = -1;
    let startIndex = -1;
    let repeatCount = 0;
    const checkRepeat = (index: number, newLine: string) => {
        const match = repeatLines.lastIndexOf(newLine);
        if (match > -1) {
            repeatCount++;
            if (matchIndex === -1) {
                // first hit
                startIndex = match;
            }
            if (match > matchIndex) {
                // second hit in a row
                matchIndex = match;
            }
        } else {
            // no match
            startIndex = -1;
            matchIndex = -1;
        }
        repeatLines.push(newLine);
        if (repeatLines.length > 100) {
            repeatLines.shift();
        }
    };

    const sut = new Calculator();
    sut.setupCALine(options);

    let iterations = 0;

    for (let i = 0; i <= depth; i++) {
        const newPoints = sut.newCALine(formule);
        const thisLine = newPoints.join('|').toString();
        checkRepeat(i, thisLine);
        const max = Math.max(...newPoints);
        if (max <= 1) {
            break;
        }
        iterations = i;
    }
    return { formule, iterations, repeatCount, startIndex, matchIndex };
};

const formulae = initFormulae();
formulae.forEach(f => {
    testFormula(f, 20000, 100);
});
