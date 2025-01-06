import { beforeEach, expect, test } from 'vitest';
import { Canticle, type ICantOptions } from './canticle';

beforeEach(() => {});

test('init', () => {
    const options: ICantOptions = {
        levels: 32,
        background: '#000',
        formule: 1,
        maxIterations: 10000,
        maxOverflow: 1,
        minOverflow: 1,
        edgeBehavior: 'transparent',
        initPoints: 'regular',
        initNumber: 1,
        stopOn10: true,
        scrolling: true,
    };

    const sut = new Canticle(options);
    sut.getPoints();
    sut.newCALine(1, 32, 'transparent');
    expect(sut.getPoints().length).toBe(100);
});
