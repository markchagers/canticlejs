<script setup lang="ts">
    import { ref } from 'vue';
    import { Canticle, type ICantOptions } from '../process/canticle';
    import { getGradients } from '../process/fileread';

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
    const bgColor = ref('#000');
    const stop10 = ref(true);
    const buttonText = ref('Pauzeer');
    const started = ref(false);
    const imageMap = new Map<string, number>([
        ['one', 1], ['two', 2], ['three', 3]
    ]);

    const gradientFiles = ref<{ label: string, value: string }[]>([]);

    const pauseResume = () => {
        buttonText.value = canticle?.pauseResume() ? 'Ga door' : 'Pauzeer'
    }

    const cleanUp = () => {
        canticle?.cleanUp();
        canticle = null;
        colorChips.value = [];

        getGradients('/canticle/gradients').then((files) => {
            files.forEach(f => {
                gradientFiles.value.push({ label: f.name, value: f.path });
            })
        })
        // // const files = require.context('@/myFolder', false, /.json$/)
        // const files = import.meta.glob(*.png');

        // const fileNames = files.keys().then((resolve, reject) => {

        // }).map((key: string) => key.slice(2))
        // fileNames.forEach(f => {
        //     console.log(f)
        // });
    }

    const iterations = ref<number>();

    let canticle: Canticle | null;

    const cantvas = ref<HTMLCanvasElement>();
    const start = () => {
        cleanUp();
        const selected = selectedFormula.value
        if (cantvas.value && selected) {
            const cantOpts: ICantOptions = {
                background: bgColor.value,
                formule: selected.formula,
                steps: stepCount.value,
                updateInterval: 1,
                maxOverflow: 1,
                minOverflow: 1,
                edgeBehavior: 'transparent',
                initPoints: startRandom.value ? 'random' : 'regular',
                initNumber: startCount.value,
                stopOn10: stop10.value,
                scrolling: true,
            }
            const cv = new OffscreenCanvas(256, 2);
            const bitmap = cv.getContext('2d');
            if (bitmap) {
                const image = document.createElement('img');
                const img = imageMap.get(palette.value);
                image.src = `/canticle/gradients/gradient-${img}.png`;
                bitmap.drawImage(image, 0, 0);
                cantOpts.paletteImage = bitmap
            }

            canticle = new Canticle(cantvas.value, cantOpts);
            canticle.getIterations((iter: number) => iterations.value = iter);
            canticle.drawCanticle();
            colorChips.value = canticle.getColors();
            started.value = true;
            buttonText.value = 'Pauzeer';
        }
    }
</script>

<template>
    <div class="main">
        <div class="sidebar">
            <h1>Canticle JS</h1>
            <div class="control">
                <label for="formule" title="De formule waarmee gerekend wordt">
                    Formule:
                    <select name="formule" id="formule" v-model="selectedFormula">
                        <option v-for="opt in formulaOptions" :key="opt.formula" :value="opt">{{
                            opt.label }}</option>
                    </select>
                </label>
                <label for="stepcount" title="Aantal stappen (kleuren) van de berekening">
                    Stappen:
                    <input type="number" v-model="stepCount" id="stepcount">
                </label>
                <label for="startcount" title="Het aantal startpunten">
                    Aantal startpunten:
                    <input type="number" v-model="startCount" id="startcount">
                </label>
                <label for="checkrandom" title="Willekeurige verdeling van de startpunten">
                    <input id="checkrandom" type="checkbox" v-model="startRandom">
                    Random positie startpunten
                </label>
                <label for="checkstop" title="Stop als het oninteressant wordt">
                    <input id="checkstop" type="checkbox" v-model="stop10">
                    Stop bij alleen 1 of 0
                </label>
                <span>Iteraties: {{ iterations }}</span>
                <button :disabled="!started" @click="pauseResume()">{{ buttonText }}</button>
            </div>
            <div class="palettes" title="Kies het kleurenpalet en de achtergrondkleur">
                <span>Kleuren:</span>
                <label for="one">
                    <input type="radio" name="gradient" v-model="palette" value="one" id="one">
                    <div class="gradient one"></div>
                </label>
                <label for="two">
                    <input type="radio" name="gradient" v-model="palette" value="two" id="two">
                    <div class="gradient two"></div>
                </label>
                <label for="three">
                    <input type="radio" name="gradient" v-model="palette" value="three" id="three">
                    <div class="gradient three"></div>
                </label>
                <span>Achtergrondkleur:</span>
                <label>
                    <label for="zwart">
                        <input type="radio" name="background" v-model="bgColor" value="#000" id="zwart">
                        Zwart
                    </label>
                    <label for="wit">
                        <input type="radio" name="background" v-model="bgColor" value="#fff" id="wit">
                        Wit
                    </label>
                    <label for="grijs">
                        <input type="radio" name="background" v-model="bgColor" value="#ccc" id="grijs">
                        Grijs
                    </label>
                </label>
                <span v-for="grad in gradientFiles" :key="grad.label">{{ grad.label }}</span>
            </div>
            <div class="control">
                <button @click="start()">Start opnieuw</button>
            </div>
        </div>
        <div class="canticle">
            <canvas width="1001" height="800" ref="cantvas"></canvas>
            <div class="colors">
                <div v-for="chip in colorChips" :key="chip" :style="`background-color: ${chip};`"></div>
            </div>
        </div>
    </div>
</template>

<style lang="css">
    .main {
        width: 100vw;
        display: flex;
        flex-flow: row nowrap;
        align-items: stretch;
    }

    .sidebar {
        width: 360px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        gap: 16px;
    }

    .control {
        display: flex;
        flex-flow: column nowrap;
        gap: 8px;
    }

    .colors {
        background-color: #aaa;
        padding: 1px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: stretch;
        gap: 1px;
    }

    .palettes {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: center;
        gap: 16px;
    }

    input[type=number] {
        width: 60px;
    }

    button {
        height: 24px;
        width: fit-content;
        padding: 0 16px;
    }

    .palettes span {
        margin-bottom: -10px;
        margin-top: 16px;
    }

    .colors div {
        display: block;
        height: 16px;
        width: 11%;
    }

    label {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        gap: 8px;
    }

    canvas {
        background-color: black;
    }

    .gradient {
        background-size: contain;
        width: 128px;
        height: 16px;
        border: 1px solid #aaa;
    }

    .one {
        background-image: url(/gradients/gradient-1.png);
    }

    .two {
        background-image: url(/gradients/gradient-2.png);
    }

    .three {
        background-image: url(/gradients/gradient-3.png);
    }
</style>
