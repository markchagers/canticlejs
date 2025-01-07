import { Calculator, type ICalculatorOptions } from './calculator.ts';

const testFormula = (formule: number, depth: number) => {
    // const results = new Map<number, number>();
    for (let i = 0; i < 256; i++) {
        const res = testLevelDepth(formule, i, depth);
        if (res.iterations > depth * 0.5) {
            console.log(`Formula: ${formule}; levels: ${i}; iterations: ${res.iterations}`);
        }
        // results.set(i, res.iterations);
    }
};

const testLevelDepth = (formule: number, levels: number, depth: number) => {
    const options: ICalculatorOptions = {
        levels,
        maxOverflow: 1,
        minOverflow: 1,
        initPoints: 'regular',
        pointsCount: 1,
        width: 1001,
    };

    const sut = new Calculator();
    sut.setupCALine(options);

    let iterations = 0;
    for (let i = 0; i <= depth; i++) {
        const newPoints = sut.newCALine(formule, 'transparent');
        const max = Math.max(...newPoints);
        if (max <= 1) {
            break;
        }
        iterations = i;
    }
    return { formule, iterations };
};

testFormula(1, 20000);
