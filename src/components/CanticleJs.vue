<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue';
    import { Canticle, type ICantOptions, type TColorChip } from '../process/canticle';
    import type { IFormula } from '../process/formula';
    import { useLanguageStore, type TOption } from '../store/language';
    import DocViewer from './DocViewer.vue';
    import FormulaExplorer from './FormulaExplorer.vue';

    const langStore = useLanguageStore();
    const selectedFormula = ref<IFormula>();
    const selectedPalette = ref<TOption>();

    const gradients: TOption[] = [
        { value: '/canticle/gradients/gradient-1.png', label: 'gradient-1' },
        { value: '/canticle/gradients/gradient-2.png', label: 'gradient-2' },
        { value: '/canticle/gradients/gradient-3.png', label: 'gradient-3' },
        { value: '/canticle/gradients/gradient-4.png', label: 'gradient-4' },
        { value: '/canticle/gradients/gradient-5.png', label: 'gradient-5' },
        { value: '/canticle/gradients/gradient-6.png', label: 'gradient-6' },
        { value: '/canticle/gradients/gradient-7.png', label: 'gradient-7' },
    ];

    const helpvisible = ref(false);
    const depthvisible = ref(false);
    const colorChips = ref<TColorChip[]>([]);
    const stepCount = ref(32);
    const startCount = ref(1);
    const startRandom = ref(false);
    const scrolling = ref(true);
    const bgColor = ref('#000');
    const stop10 = ref(true);
    const pauseBtnText = ref(langStore.getLangString('Pauzeer'));
    const started = ref(false);
    const maxIterations = ref(30000);
    const iterations = ref<number>(0);
    const cantvas = ref<HTMLCanvasElement>();
    let canticle: Canticle | null;

    onMounted(() => {
        selectedFormula.value = langStore.getFormulaByValue(0);
        selectedPalette.value = gradients[0];
        start();
    });

    watch(
        () => langStore.lang,
        () => {
            const val = selectedFormula.value
            const menu = langStore.getFormulae();
            const newVal = menu.find(m => m.value === val?.value) ?? menu[0];
            selectedFormula.value = newVal
        },
        { immediate: true }
    )

    const pauseResume = () => {
        canticle?.pauseResume();
    };

    const cleanUp = () => {
        canticle?.cleanUp();
        canticle = null;
        colorChips.value = [];
    };

    const start = () => {
        cleanUp();
        const selected = selectedFormula.value;
        if (!cantvas.value || !selected) {
            return;
        }
        const cv = new OffscreenCanvas(512, 4);
        const bitmap = cv.getContext('2d');
        if (!bitmap) {
            return;
        }
        const image = document.createElement('img');
        image.onload = () => {
            bitmap.drawImage(image, 0, 0);
            const cantOpts: ICantOptions = {
                background: bgColor.value,
                formule: selected,
                levels: stepCount.value,
                maxIterations: maxIterations.value,
                maxOverflow: 1,
                minOverflow: 1,
                edgeBehavior: 'transparent',
                initPoints: startRandom.value ? 'random' : 'regular',
                initNumber: startCount.value,
                stopOn10: stop10.value,
                scrolling: scrolling.value,
                paletteImage: bitmap
            };

            canticle = new Canticle(cantOpts, cantvas.value);
            canticle.getIterations((iter: number) => (iterations.value = iter));
            canticle.getPausedState((state: boolean) => {
                pauseBtnText.value = langStore.getLangString(state ? 'Ga door' : 'Pauzeer');
            });
            canticle.drawCanticle();
            colorChips.value = canticle.getColors();
            started.value = true;
            pauseBtnText.value = langStore.getLangString('Pauzeer');
        }
        image.src = (selectedPalette.value?.value as string) ?? '/canticle/gradients/gradient-1.png';
    };
</script>

<template>
    <div class="main">
        <DocViewer v-if="helpvisible" :language="langStore.lang" @close="helpvisible = false"></DocViewer>
        <FormulaExplorer :formule="selectedFormula" v-if="depthvisible" @close="depthvisible = false">
        </FormulaExplorer>
        <div class="sidebar">
            <h1>CanticleJS</h1>
            <div class="langbtns">
                <button class="lang" :class="{ active: langStore.lang === 'en' }" @click="langStore.lang = 'en'">
                    🇬🇧
                    <span>English</span>
                </button>
                <button class="lang" :class="{ active: langStore.lang === 'nl' }" @click="langStore.lang = 'nl'">
                    🇳🇱
                    <span>Nederlands</span>
                </button>
            </div>
            <button @click="helpvisible = true">{{ langStore.getLangString('Wat is dit?') }}</button>
            <div class="control">
                <label for="formule" :title="langStore.getLangString('De formule waarmee gerekend wordt')">
                    {{ langStore.getLangString('Formule') }}:
                    <select name="formule" id="formule" v-model="selectedFormula">
                        <option v-for="opt in langStore.getFormulae()" :key="opt.value" :value="opt">{{ opt.label }}
                        </option>
                    </select>
                </label>
                <button @click="depthvisible = true">{{ `${langStore.getLangString('Niveaus voor')}
                    ${selectedFormula?.label}` }}</button>
                <label for="stepcount" :title="langStore.getLangString('Aantal niveaus (kleuren) van de berekening')">
                    {{ langStore.getLangString('Niveaus') }}:
                    <input type="number" v-model="stepCount" id="stepcount" />
                </label>
                <label for="startcount" :title="langStore.getLangString('Het aantal startpunten')">
                    {{ langStore.getLangString('Aantal startpunten') }}:
                    <input type="number" v-model="startCount" id="startcount" />
                </label>
                <label for="checkrandom" :title="langStore.getLangString('Willekeurige verdeling van de startpunten')">
                    <input id="checkrandom" type="checkbox" v-model="startRandom" />
                    {{ langStore.getLangString('Random positie startpunten') }}
                </label>
                <label for="checkscroll" :title="langStore.getLangString('Scroll het beeld als het scherm vol is')">
                    <input id="checkscroll" type="checkbox" v-model="scrolling" />
                    {{ langStore.getLangString('Scroll bij vol scherm') }}
                </label>
                <label for="checkstop" :title="langStore.getLangString('Stop als het oninteressant wordt')">
                    <input id="checkstop" type="checkbox" v-model="stop10" />
                    {{ langStore.getLangString('Stop bij alleen 1 of 0') }}
                </label>
                <span :title="langStore.getLangString('Aantal gegenereerde regels')">{{
                    langStore.getLangString('Iteraties') }}: {{ iterations }}</span>
                <label for="maxiterations"
                    :title="langStore.getLangString('Maximum aantal iteraties (0 = geen limiet)')">
                    {{ langStore.getLangString('Max aantal iteraties') }}:
                    <input type="number" class="long" v-model="maxIterations" id="maxiterations" />
                </label>
                <button :disabled="!started" @click="pauseResume()">{{ pauseBtnText }}</button>
            </div>
            <details>
                <summary>{{ langStore.getLangString('Kleuren') }}:</summary>
                <span>{{ langStore.getLangString('Palet') }}:</span>

                <div class="palettes" :title="langStore.getLangString('Kies het kleurenpalet en de achtergrondkleur')">
                    <label v-for="grad in gradients" :key="grad.label" :for="grad.label">
                        <input type="radio" name="gradient" v-model="selectedPalette" :value="grad" :id="grad.label" />
                        <div class="gradient" :style="{ 'background-image': 'url(' + grad.value + ')' }"></div>
                    </label>
                    <span>{{ langStore.getLangString('Achtergrondkleur') }}:</span>
                    <label>
                        <label for="zwart">
                            <input type="radio" name="background" v-model="bgColor" value="#000" id="zwart" />
                            {{ langStore.getLangString('Zwart') }}
                        </label>
                        <label for="wit">
                            <input type="radio" name="background" v-model="bgColor" value="#fff" id="wit" />
                            {{ langStore.getLangString('Wit') }}
                        </label>
                        <label for="grijs">
                            <input type="radio" name="background" v-model="bgColor" value="#ccc" id="grijs" />
                            {{ langStore.getLangString('Grijs') }}
                        </label>
                    </label>
                </div>
            </details>
            <div class="control">
                <button @click="start()">{{ langStore.getLangString('Start opnieuw') }}</button>
            </div>
        </div>
        <div class="canticle">
            <canvas width="1001" height="800" ref="cantvas"></canvas>
            <div class="colors">
                <div v-for="chip in colorChips" :key="chip.index" :style="`background-color: ${chip.color};`"></div>
            </div>
        </div>
    </div>
</template>

<style lang="css">
    .main {
        width: 100vw;
        display: flex;
        flex-flow: row nowrap;
        align-items: flex-start;
    }

    .sidebar {
        flex: 0 0 320px;
        width: 320px;
        padding: 10px 32px;
        display: flex;
        flex-flow: column nowrap;
        align-items: stretch;
        height: 100vh;
        gap: 16px;
        background-color: var(--color-background-soft);
    }

    .colors {
        background-color: var(--color-background-muted);
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

    input[type='number'] {
        width: 60px;
    }

    input[type='number'].long {
        width: 100px;
    }

    .langbtns {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-flow: row nowrap;
        gap: 8px;
        align-items: center;
    }

    button.lang {
        padding: 0 4px;
        height: fit-content;
        line-height: 2rem;
        background-color: transparent;
        font-size: 2rem;
        cursor: pointer;
        border-radius: 4px;
        border: 2px solid;
        border-color: transparent;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    button.lang span {
        color: var(--color-text);
        font-size: 0.8rem;
    }

    button.lang.active {
        border-color: var(--color-select);
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

    details {
        border-radius: 6px;
        padding: 6px 10px;
    }

    details[open] {
        background-color: var(--color-background-soft);
    }

    .accordion-item__title::marker {
        content: "";
    }

    summary::-webkit-details-marker {
        display: none;
    }

    summary {
        cursor: pointer;
        display: flex;
        align-items: center;
        list-style: none;
    }

    summary::before {
        --svg: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 23"><polyline fill="transparent" points="2,2 12,11 2,21" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round" stroke-width="3" /></svg>');
        content: '';
        width: 10px;
        height: 17px;
        margin-right: 0.5rem;
        transition: 0.2s;
        background-color: var(--color-text);
        mask: var(--svg);
    }

    details[open]>summary::before {
        transform: rotate(90deg);
    }

    details>label {
        margin: 10px 0;
    }

    .gradient {
        background-size: contain;
        width: 128px;
        height: 16px;
        border: 1px solid var(--color-background-mute);
    }
</style>
