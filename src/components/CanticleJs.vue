<script setup lang="ts">
    import { ref } from 'vue';
    import { Canticle, type ICantOptions } from '../process/canticle';

    type TOption = {
        label: string;
        formula: number
    }

    const selectedFormula = ref<TOption>({ label: 'zeer fascinerend!!', formula: 1 });

    const formulaOptions: TOption[] = [
        { label: 'zeer fascinerend!!', formula: 1 },
        { label: 'als amiga programma!', formula: 2 },
        { label: 'ook wel aardig', formula: 3 },
        { label: 'wel aardig', formula: 4 },
        { label: 'heel mooi', formula: 5 },
        { label: 'formule 6', formula: 6 },
        { label: 'formule 7', formula: 7 },
        { label: 'kerstboom met kaarsjes', formula: 8 },
        { label: 'wel aardig 3', formula: 9 },
    ];

    const colorChips = ref<string[]>([]);
    const stepCount = ref(32);
    const startCount = ref(3);
    const startRandom = ref(true);
    const palette = ref<'one' | 'two' | 'three'>('one');

    const cantvas = ref<HTMLCanvasElement>();
    const start = () => {
        const imageMap = new Map<string, number>([
            ['one', 1], ['two', 2], ['three', 3]
        ])
        const selected = selectedFormula.value
        if (cantvas.value && selected) {
            const cantOpts: ICantOptions = {
                formule: selected.formula,
                steps: stepCount.value,
                updateInterval: 1,
                maxOverflow: 1,
                minOverflow: 1,
                edgeBehavior: 'reflect',
                initPoints: startRandom.value ? 'random' : 'regular',
                initNumber: startCount.value,
                scrolling: true,
            }
            const cv = new OffscreenCanvas(256, 2);
            const bitmap = cv.getContext('2d');
            if (bitmap) {
                const image = document.createElement('img');
                const img = imageMap.get(palette.value);
                image.src = `/src/assets/gradient-${img}.png`;
                bitmap.drawImage(image, 0, 0);
                cantOpts.paletteImage = bitmap
            }
            const canticle = new Canticle(cantvas.value, cantOpts);
            canticle.drawCanticle();
            colorChips.value = canticle.getColors();
        }
    }
</script>

<template>
    <div class="main">
        <h1>Canticle JS</h1>
        <div class="control">
            <span>Formule:</span>
            <select name="formule" v-model="selectedFormula">
                <option v-for="opt in formulaOptions" :key="opt.formula" :value="opt">{{
                    opt.label }}</option>
            </select>
            <span> Stappen:</span>
            <input type="number" v-model="stepCount">
            <span> Startpunten:</span>
            <input type="number" v-model="startCount">
            <label for="checkrandom">Random</label>
            <input id="checkrandom" type="checkbox" v-model="startRandom">
            <button @click="start()">Start</button>
        </div>
        <div class="palettes">
            <input type="radio" name="gradient" v-model="palette" value="one" id="one">
            <label for="one">
                <div class="gradient one"></div>
            </label>
            <input type="radio" name="gradient" v-model="palette" value="two" id="two">
            <label for="two">
                <div class="gradient two"></div>
            </label>
            <input type="radio" name="gradient" v-model="palette" value="three" id="three">
            <label for="three">
                <div class="gradient three"></div>
            </label>
        </div>
        <div class="colors">
            <div v-for="chip in colorChips" :key="chip" :style="`background-color: ${chip};`"></div>
        </div>
        <canvas width="1000" height="800" ref="cantvas"></canvas>
    </div>
</template>

<style lang="css">
    .main {
        display: flex;
        flex-flow: column nowrap;
        gap: 16px;
    }

    .control {
        display: flex;
        flex-flow: row nowrap;
        gap: 8px;
    }

    .colors {
        display: flex;
        flex-flow: row nowrap;
        justify-content: stretch;
        gap: 1px;
    }

    .palettes {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        gap: 16px;
    }

    .colors div {
        display: block;
        height: 16px;
        width: 11%;
    }

    input[type=number] {
        width: 60px;
    }

    canvas {
        width: 1000px;
        height: 800px;
        background-color: black;
    }

    .gradient {
        background-size: contain;
        width: 256px;
        height: 16px;
    }

    .one {
        background-image: url(/src/assets/gradient-1.png);
    }

    .two {
        background-image: url(/src/assets/gradient-2.png);
    }

    .three {
        background-image: url(/src/assets/gradient-3.png);
    }
</style>
