import { beforeEach, expect, test } from 'vitest';
import { Calculator, type ICalculatorOptions } from './calculator';

beforeEach(() => {});

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
