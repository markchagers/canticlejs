import type { IOption } from './generic';

export interface IGradientOption extends IOption {
    id: number;
}

export const gradients: IGradientOption[] = [
    { id: 1, value: '/canticle/gradients/gradient-1.png', label: 'gradient-1' },
    { id: 2, value: '/canticle/gradients/gradient-2.png', label: 'gradient-2' },
    { id: 3, value: '/canticle/gradients/gradient-3.png', label: 'gradient-3' },
    { id: 4, value: '/canticle/gradients/gradient-4.png', label: 'gradient-4' },
    { id: 5, value: '/canticle/gradients/gradient-5.png', label: 'gradient-5' },
    { id: 6, value: '/canticle/gradients/gradient-6.png', label: 'gradient-6' },
    { id: 7, value: '/canticle/gradients/gradient-7.png', label: 'gradient-7' },
];
