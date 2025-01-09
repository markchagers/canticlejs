import { defineStore } from 'pinia';
import { ref } from 'vue';

const langMap = new Map<string, string>([
    ['Wat is CanticleJS?', 'What is CanticleJS?'],
    ['Gebruiksaanwijzing', 'Manual'],
    ['Achtergrond', 'Background'],
    ['Wat is dit?', 'What is this?'],
    ['Formule', 'Formula'],
    ['Pauzeer', 'Pause'],
    ['Ga door', 'Continue'],
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
    ['Iteraties', 'Iterations'],
    ['Aantal gegenereerde regels', 'Number of lines generated'],
    ['Max aantal iteraties', 'Max iterations'],
    ['De formule waarmee gerekend wordt', 'The formula generating the image'],
    ['Aantal stappen (kleuren) van de berekening', 'Number of steps (colors) of the calculation'],
    ['Het aantal startpunten', 'The number of initial points'],
    ['Willekeurige verdeling van de startpunten', 'Random positions of initial points'],
    ['Scroll het beeld als het scherm vol is', 'Scroll the image when screen is full'],
    ['Stop als het oninteressant wordt', 'Stop when it gets boring'],
    ['Maximum aantal iteraties (0 = geen limiet)', 'Maximum iterations (0 = no limit)'],
    ['Kies het kleurenpalet en de achtergrondkleur', 'Choose color palette and background color'],
]);

export type TOption = {
    label: string;
    value: number | string;
};

const lang = ref<'nl' | 'en'>(navigator.language.startsWith('nl') ? 'nl' : 'en');

export const useLanguageStore = defineStore('language', () => {
    const getFormulae = () => {
        if (lang.value === 'en') {
            return [
                { label: 'formula 1', value: 1 },
                { label: 'formula 2', value: 2 },
                { label: 'formula 3', value: 3 },
                { label: 'formula 4', value: 4 },
                { label: 'formula 5', value: 5 },
                { label: 'formula 6', value: 6 },
                { label: 'formula 7', value: 7 },
            ];
        }
        return [
            { label: 'formule 1', value: 1 },
            { label: 'formule 2', value: 2 },
            { label: 'formule 3', value: 3 },
            { label: 'formule 4', value: 4 },
            { label: 'formule 5', value: 5 },
            { label: 'formule 6', value: 6 },
            { label: 'formule 7', value: 7 },
        ];
    };

    const getLangString = (key: string) => {
        if (lang.value !== 'nl') {
            return langMap.get(key) ?? `missing: ${key}`;
        }
        return key;
    };

    return { lang, getLangString, getFormulae };
});
