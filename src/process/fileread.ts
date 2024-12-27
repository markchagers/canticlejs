import { readdir } from 'node:fs/promises';

export const getGradients = async (path: string) => {
    const entries = await readdir(path, { recursive: true });
    return entries.filter(e => /\.png$/i.exec(e)).map(e => ({ name: e, path: `${path}${e}` }));
};
