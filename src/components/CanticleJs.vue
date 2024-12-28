<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { Canticle, type ICantOptions } from '../process/canticle';

    type TOption = {
        label: string;
        value: number | string
    }

    const selectedFormula = ref<TOption>({ label: 'zeer fascinerend!!', value: 1 });
    const selectedPalette = ref<TOption>();

    const gradients: TOption[] = [
        { value: '/canticle/gradients/gradient-1.png', label: 'gradient-1' },
        { value: '/canticle/gradients/gradient-2.png', label: 'gradient-2' },
        { value: '/canticle/gradients/gradient-3.png', label: 'gradient-3' },
        { value: '/canticle/gradients/gradient-4.png', label: 'gradient-4' },
        { value: '/canticle/gradients/gradient-5.png', label: 'gradient-5' },
    ];

    const formulaOptions: TOption[] = [
        { label: 'Basis formule', value: 1 },
        { label: 'Als amiga programma', value: 2 },
        { label: 'formule 3', value: 3 },
        { label: 'formule 4', value: 4 },
        { label: 'formule 5', value: 5 },
        { label: 'formule 6', value: 6 },
        { label: 'formule 7', value: 7 },
        { label: 'kerstboom met kaarsjes', value: 8 },
        { label: 'formule 9', value: 9 },
    ];

    const colorChips = ref<string[]>([]);
    const stepCount = ref(32);
    const startCount = ref(1);
    const startRandom = ref(false);
    const bgColor = ref('#000');
    const stop10 = ref(true);
    const pauseBtnText = ref('Pauzeer');
    const started = ref(false);

    onMounted(() => {
        selectedFormula.value = formulaOptions[0];
        selectedPalette.value = gradients[0];
    });

    const pauseResume = () => {
        pauseBtnText.value = canticle?.pauseResume() ? 'Ga door' : 'Pauzeer'
    }

    const cleanUp = () => {
        canticle?.cleanUp();
        canticle = null;
        colorChips.value = [];
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
                formule: selected.value as number,
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
            const cv = new OffscreenCanvas(512, 4);
            const bitmap = cv.getContext('2d');
            if (bitmap) {
                const image = document.createElement('img');
                image.src = selectedPalette.value?.value as string ?? 'gradient-1';
                bitmap.drawImage(image, 0, 0);
                cantOpts.paletteImage = bitmap
            }

            canticle = new Canticle(cantvas.value, cantOpts);
            canticle.getIterations((iter: number) => iterations.value = iter);
            canticle.drawCanticle();
            colorChips.value = canticle.getColors();
            started.value = true;
            pauseBtnText.value = 'Pauzeer';
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
                        <option v-for="opt in formulaOptions" :key="opt.value" :value="opt">{{
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
                <button :disabled="!started" @click="pauseResume()">{{ pauseBtnText }}</button>
            </div>
            <details>
                <summary>Kleuren:</summary>
                <span>Palet:</span>
                <div class="palettes" title="Kies het kleurenpalet en de achtergrondkleur">
                    <label v-for="grad in gradients" :key="grad.label" :for="grad.label">
                        <input type="radio" name="gradient" v-model="selectedPalette" :value="grad" :id="grad.label">
                        <div class="gradient" :style="{ 'background-image': 'url(' + grad.value + ')' }"></div>
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
                </div>
            </details>
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
        flex: 0 0 320px;
        width: 320px;
        padding: 0 16px;
        display: flex;
        flex-flow: column nowrap;
        align-items: stretch;
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

    details>label {
        margin: 10px 0;
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
</style>
