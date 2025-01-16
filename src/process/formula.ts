import type { TEdgeOps } from './canticle';

export interface IFormula {
    value: number;
    label: string;
    description: string;
    formula: (ptN: number, ptNE: number, ptNW: number) => number;
}

export class Formula implements IFormula {
    constructor(
        readonly value: number,
        readonly label: string,
        readonly description: string,
        readonly formula: (ptN: number, ptNW: number, ptNE: number) => number,
    ) {}
}

export const initEdges = (): TEdgeOps[] => {
    return ['opaque', 'reflect', 'transparent'];
};

export const initFormulae = (): IFormula[] => {
    const formula: IFormula[] = [];

    formula.push(
        new Formula(1, 'formule 1', 'pt = ptN - 1 + 2 * abs(ptNW - ptNE)', (ptN: number, ptNW: number, ptNE: number) => {
            return ptN - 1 + 2 * Math.abs(ptNW - ptNE);
        }),
        new Formula(2, 'formule 2', 'pt = abs(ptN - 1) * (1 + 2 * abs(ptNW - ptNE))', (ptN: number, ptNW: number, ptNE: number) => {
            return Math.abs(ptN - 1) * (1 + 2 * Math.abs(ptNW - ptNE));
        }),
        new Formula(3, 'formule 3', 'pt = ptN - 1 + ptNW + ptNE', (ptN: number, ptNW: number, ptNE: number) => {
            return ptN - 1 + ptNW + ptNE;
        }),
        new Formula(4, 'formule 4', 'pt = abs(ptN - 1) + 2 * (ptNW * ptNE)', (ptN: number, ptNW: number, ptNE: number) => {
            return Math.abs(ptN - 1) + 2 * (ptNW * ptNE);
        }),
        new Formula(5, 'formule 5', 'pt = abs(ptN - 1) + 3 * (ptNW + ptNE)', (ptN: number, ptNW: number, ptNE: number) => {
            return Math.abs(ptN - 1) + 3 * (ptNW + ptNE);
        }),
        new Formula(6, 'formule 6', 'pt = abs(ptN - 1) + 2 * (ptNW + ptNE)', (ptN: number, ptNW: number, ptNE: number) => {
            return Math.abs(ptN - 1) + 2 * (ptNW + ptNE);
        }),
    );

    return formula;
};
