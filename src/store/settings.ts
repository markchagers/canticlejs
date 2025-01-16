import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { TEdgeOps } from '../types/edges';

export const useSettingsStore = defineStore('settings', () => {
    // 'private'
    const prefix = 'canticle_settings';

    const saveSetting = <T>(key: string, value: T) => {
        const storeKey = `${prefix}-${key}`;
        localStorage.setItem(storeKey, JSON.stringify(value));
    };

    const getSetting = <T>(key: string, defaultValue: T): T => {
        const storeKey = `${prefix}-${key}`;
        const item = localStorage.getItem(storeKey);
        if (item) {
            return JSON.parse(item) as T;
        }
        return defaultValue;
    };

    const levelCount = ref(getSetting('levels', 45));
    const startCount = ref(getSetting('startcount', 3));
    const startRandom = ref(getSetting('startrandom', true));
    const scrolling = ref(getSetting('scrolling', true));
    const bgColor = ref(getSetting('background', '#000'));
    const stop10 = ref(getSetting('stop10', true));
    const maxIterations = ref(getSetting('maxiterations', 30000));
    const edgeBehavior = ref<TEdgeOps>(getSetting('edge', 'transparent'));
    const selectedPalette = ref(getSetting('palette', 1));
    const selectedFormula = ref(getSetting('formula', 1));

    watch(levelCount, () => {
        saveSetting('levels', levelCount.value);
    });
    watch(startCount, () => {
        saveSetting('startcount', startCount.value);
    });
    watch(startRandom, () => {
        saveSetting('startrandom', startRandom.value);
    });
    watch(scrolling, () => {
        saveSetting('scrolling', scrolling.value);
    });
    watch(bgColor, () => {
        saveSetting('background', bgColor.value);
    });
    watch(stop10, () => {
        saveSetting('stop10', stop10.value);
    });
    watch(maxIterations, () => {
        saveSetting('maxiterations', maxIterations.value);
    });
    watch(edgeBehavior, () => {
        saveSetting('edge', edgeBehavior.value);
    });
    watch(selectedPalette, () => {
        saveSetting('palette', selectedPalette.value);
    });
    watch(selectedFormula, () => {
        saveSetting('formula', selectedFormula.value);
    });

    return {
        levelCount,
        startCount,
        startRandom,
        scrolling,
        bgColor,
        stop10,
        maxIterations,
        edgeBehavior,
        selectedPalette,
        selectedFormula,
    };
});
