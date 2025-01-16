import { expect, test } from 'vitest';
import { initFormulae } from '../types/formula';
import { Calculator, type ICalculatorOptions } from './calculator';

const formulae = initFormulae();
test('init', () => {
    const options: ICalculatorOptions = {
        levels: 32,
        maxOverflow: 1,
        minOverflow: 1,
        initPoints: 'regular',
        pointsCount: 1,
        width: 100,
        edge: () => 'transparent',
    };

    const sut = new Calculator();
    sut.setupCALine(options);
    const newPoints = sut.newCALine(formulae[1]);
    expect(newPoints.length).toBe(100);
    expect(Math.max(...newPoints)).toBeGreaterThan(10);
});

test('calcDepth', () => {
    const options: ICalculatorOptions = {
        levels: 32,
        maxOverflow: 1,
        minOverflow: 1,
        initPoints: 'regular',
        pointsCount: 1,
        width: 1001,
        edge: () => 'transparent',
    };

    const sut = new Calculator();
    sut.setupCALine(options);

    let iter = 0;
    for (let i = 0; i < 10000; i++) {
        const newPoints = sut.newCALine(formulae[1]);
        const max = Math.max(...newPoints);
        if (max <= 0) {
            break;
        }
        expect(max).toBeGreaterThan(1);
        iter = i;
    }
    console.log(iter);
    expect(iter).toBeGreaterThan(10);
});
