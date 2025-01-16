# CanticleJS

## What is CanticleJS?

CanticleJS is the latest incarnation of a program to experiment with the phenomenon named Cellular Automatons. Basically all you can do with it is generate interesting images.

Read more about this in [the docs](/public/doc/whatis-en.md), [the manual](/dist/doc/howto-en.md) and some [background](/public/doc/background-en.md).

CanticleJS was developed with Vue and Vite (see below), but the imaging code is all just vanilla typescript, so it should be easy to use it in other environments.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).
Alternatively you may prefer [VSCodium](https://vscodium.com) which is functionally equivalent, but less MicroSofty.

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
