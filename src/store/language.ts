import { defineStore } from 'pinia';
import { ref } from 'vue';

const langMap = new Map<string, string>([
    ['Formule', 'Formula'],
    ['Pauzeer', 'Pause'],
    ['Stappen', 'Steps'],
    ['Aantal startpunten', 'Number of initial points'],
    ['Random positie startpunten', 'Random positions'],
    ['Scroll bij vol scherm', 'Scroll on full screen'],
    ['Stop bij alleen 1 of 0', 'Stop on just 1 or 0'],
    ['Kleuren', 'Colors'],
    ['Palet', 'Palette'],
    ['Achtergrondkleur', 'Background color'],
    ['Zwart', 'Black'],
    ['Wit', 'White'],
    ['Grijs', 'Grey'],
    ['Start opnieuw', 'Start over'],
]);

export const useLanguageStore = defineStore('language', () => {
    const userLang = ref(navigator.language);
    const lang: 'nl' | 'en' = userLang.value.startsWith('nl') ? 'nl' : 'en';
    const getLangString = (key: string) => {
        if (userLang.value !== 'nl') {
            return langMap.get(key) ?? 'something';
        }
        return key;
    };

    return { lang, getLangString };
});
