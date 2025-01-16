export type TEdgeOps = 'transparent' | 'opaque' | 'reflect';

export const initEdges = (): TEdgeOps[] => {
    return ['opaque', 'reflect', 'transparent'];
};
