<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { Canticle, type ICantOptions, type TColorChip } from '../process/canticle';
    import { useLanguageStore } from '../store/language';
    import { useSettingsStore } from '../store/settings';
    import { gradients } from '../types/gradient';
    import DocViewer from './DocViewer.vue';
    import FormulaExplorer from './FormulaExplorer.vue';

    const langStore = useLanguageStore();
    const settings = useSettingsStore();

    const cantvas = ref<HTMLCanvasElement>();
    const colorarea = ref<HTMLDetailsElement>();

    const helpvisible = ref(false);
    const depthvisible = ref(false);

    const colorChips = ref<TColorChip[]>([]);

    const pauseBtnText = ref(langStore.getLangString('Pauzeer'));
    const started = ref(false);
    const iterations = ref<number>(0);
    let canticle: Canticle | null;

    onMounted(() => {
        start();
    });

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
        const selected = langStore.getFormulaByValue(settings.selectedFormula);
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
                background: () => settings.bgColor,
                formule: selected,
                levels: settings.levelCount,
                maxIterations: () => settings.maxIterations,
                maxOverflow: 1,
                minOverflow: 1,
                edgeBehavior: () => settings.edgeBehavior ?? 'transparent',
                initPoints: settings.startRandom ? 'random' : 'regular',
                initNumber: settings.startCount,
                stopOn10: () => settings.stop10,
                scrolling: () => settings.scrolling,
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
        image.src = (gradients.find(g => g.id === settings.selectedPalette)?.value as string) ?? '/canticle/gradients/gradient-1.png';
    };

    const closeColors = () => {
        if (colorarea.value) {
            colorarea.value.open = false
        }
    }
</script>

<template>
    <div class="main" v-on:click="closeColors()">
        <DocViewer v-if="helpvisible" :language="langStore.lang" @close="helpvisible = false"></DocViewer>
        <FormulaExplorer v-if="depthvisible" @close="depthvisible = false">
        </FormulaExplorer>
        <div class="sidebar">
            <div class="sidebar-section-fixed">
                <h1>CanticleJS</h1>
                <div class="control">
                    <div class="langbtns">
                        <button class="lang" :class="{ active: langStore.lang === 'en' }"
                            @click="langStore.lang = 'en'">
                            🇬🇧
                            <span>English</span>
                        </button>
                        <button class="lang" :class="{ active: langStore.lang === 'nl' }"
                            @click="langStore.lang = 'nl'">
                            🇳🇱
                            <span>Nederlands</span>
                        </button>
                    </div>
                    <button @click="helpvisible = true">{{ langStore.getLangString('Wat is dit?') }}</button>
                    <button @click="start()" class="default"
                        :title="langStore.getLangString('Start een nieuwe afbeelding met de huidige instellingen')">{{
                            langStore.getLangString('Start opnieuw') }}</button>
                </div>
            </div>
            <div class="sidebar-section-scroll">
                <div class="side-container">
                    <div class="control">
                        <label for="formule" :title="langStore.getLangString('De formule waarmee gerekend wordt')">
                            {{ langStore.getLangString('Formule') }}:
                            <select name="formule" id="formule" v-model="settings.selectedFormula">
                                <option v-for="opt in langStore.getFormulae()" :key="opt.id" :value="opt.id">{{
                                    opt.label }}
                                </option>
                            </select>
                        </label>
                        <button @click="depthvisible = true">{{ `${langStore.getLangString('Niveaus voor')}
                            ${langStore.getFormulaByValue(settings.selectedFormula).label}` }}</button>
                        <label for="levelCount"
                            :title="langStore.getLangString('Aantal niveaus (kleuren) van de berekening')">
                            {{ langStore.getLangString('Niveaus') }}:
                            <input type="number" v-model="settings.levelCount" id="levelCount" />
                        </label>
                        <label for="startcount" :title="langStore.getLangString('Het aantal startpunten')">
                            {{ langStore.getLangString('Aantal startpunten') }}:
                            <input type="number" v-model="settings.startCount" id="startcount" />
                        </label>
                        <label for="checkrandom"
                            :title="langStore.getLangString('Willekeurige verdeling van de startpunten')">
                            <input id="checkrandom" type="checkbox" v-model="settings.startRandom" />
                            {{ langStore.getLangString('Random positie startpunten') }}
                        </label>
                        <label for="edge" :title="langStore.getLangString('Wat gebeurt aan de randen')">
                            {{ langStore.getLangString('Randgedrag') }}:
                            <span class="icon"
                                :title="langStore.getLangString('Deze instelling werkt direct op de huidige afbeelding')">📍</span>
                            <select name="edge" id="edge" v-model="settings.edgeBehavior">
                                <option v-for="opt in langStore.getEdgeValues()" :key="`${opt}`" :value="opt">{{ opt }}
                                </option>
                            </select>
                        </label>
                        <label for="checkscroll"
                            :title="langStore.getLangString('Scroll het beeld als het scherm vol is')">
                            <input id="checkscroll" type="checkbox" v-model="settings.scrolling" />
                            <span class="icon"
                                :title="langStore.getLangString('Deze instelling werkt direct op de huidige afbeelding')">📍</span>
                            {{ langStore.getLangString('Scroll bij vol scherm') }}
                        </label>
                        <label for="checkstop" :title="langStore.getLangString('Stop als het oninteressant wordt')">
                            <input id="checkstop" type="checkbox" v-model="settings.stop10" /><span class="icon"
                                :title="langStore.getLangString('Deze instelling werkt direct op de huidige afbeelding')">📍</span>
                            {{ langStore.getLangString('Stop bij alleen 1 of 0') }}
                        </label>
                        <span :title="langStore.getLangString('Aantal gegenereerde regels')">{{
                            langStore.getLangString('Iteraties') }}: {{ iterations }}</span>
                        <label for="maxiterations"
                            :title="langStore.getLangString('Maximum aantal iteraties (0 = geen limiet)')"><span
                                class="icon"
                                :title="langStore.getLangString('Deze instelling werkt direct op de huidige afbeelding')">📍</span>
                            {{ langStore.getLangString('Max iteraties') }}:
                            <input type="number" class="long" v-model="settings.maxIterations" id="maxiterations" />
                        </label>
                        <button :disabled="!started" @click="pauseResume()">{{ pauseBtnText }}</button>
                    </div>
                    <details ref="colorarea" @click.stop="undefined">
                        <summary>{{ langStore.getLangString('Kleuren') }}:</summary>
                        <span>{{ langStore.getLangString('Palet') }}:</span>

                        <div class="palettes"
                            :title="langStore.getLangString('Kies het kleurenpalet en de achtergrondkleur')">
                            <label v-for="grad in gradients" :key="grad.id" :for="grad.label">
                                <input type="radio" name="gradient" v-model="settings.selectedPalette" :value="grad.id"
                                    :id="grad.label" />
                                <div class="gradient" :style="{ 'background-image': 'url(' + grad.value + ')' }"></div>
                            </label>
                            <span><span class="icon"
                                    :title="langStore.getLangString('Deze instelling werkt direct op de huidige afbeelding')">📍</span>
                                {{ langStore.getLangString('Achtergrondkleur') }}:</span>
                            <label>
                                <label for="zwart">
                                    <input type="radio" name="background" v-model="settings.bgColor" value="#000"
                                        id="zwart" />
                                    {{ langStore.getLangString('Zwart') }}
                                </label>
                                <label for="wit">
                                    <input type="radio" name="background" v-model="settings.bgColor" value="#fff"
                                        id="wit" />
                                    {{ langStore.getLangString('Wit') }}
                                </label>
                                <label for="grijs">
                                    <input type="radio" name="background" v-model="settings.bgColor" value="#ccc"
                                        id="grijs" />
                                    {{ langStore.getLangString('Grijs') }}
                                </label>
                            </label>
                        </div>
                    </details>
                </div>
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
        height: 100vh;
        background-color: var(--color-background-soft);
        display: flex;
        flex-flow: column nowrap;
    }

    .sidebar-section-fixed {
        flex: 0 0 200px;
        padding: 0 32px;
        display: flex;
        flex-flow: column nowrap;
        align-items: stretch;
        gap: 8px;
        border-bottom: 1px solid var(--color-border);
    }

    .sidebar-section-fixed .control {
        gap: 14px;
    }

    button.default {
        background-color: #3200d8;
        color: white;
    }

    button.default:hover {
        background-color: #554ee6;
    }

    .sidebar-section-scroll {
        flex: 1 0 calc(100vh - 200px);
        overflow-y: scroll;
    }

    .side-container {
        flex: 0 0 340px;
        padding: 16px 32px;
        display: flex;
        flex-flow: column nowrap;
        align-items: stretch;
        gap: 16px;
        height: fit-content;
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
