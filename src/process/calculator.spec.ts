import { expect, test } from 'vitest';
import { Calculator, type ICalculatorOptions } from './calculator';

test('init', () => {
    const options: ICalculatorOptions = {
        levels: 32,
        maxOverflow: 1,
        minOverflow: 1,
        initPoints: 'regular',
        pointsCount: 1,
        width: 100,
    };

    const sut = new Calculator();
    sut.setupCALine(options);
    const newPoints = sut.newCALine(1, 'transparent');
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
    };

    const sut = new Calculator();
    sut.setupCALine(options);

    let iter = 0;
    for (let i = 0; i < 10000; i++) {
        const newPoints = sut.newCALine(1, 'transparent');
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
