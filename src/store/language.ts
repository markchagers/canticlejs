import { defineStore } from 'pinia';
import { ref } from 'vue';
import { initEdges } from '../types/edges';
import { initFormulae } from '../types/formula';

const langMap = new Map<string, string>([
    ['Wat is CanticleJS?', 'What is CanticleJS?'],
    ['Gebruiksaanwijzing', 'Manual'],
    ['Achtergrond', 'Background'],
    ['Wat is dit?', 'What is this?'],
    ['Formule', 'Formula'],
    ['formule', 'formula'],
    ['Pauzeer', 'Pause'],
    ['Ga door', 'Continue'],
    ['Niveaus', 'Levels'],
    ['Aantal startpunten', 'Number of initial points'],
    ['Random positie startpunten', 'Random positions'],
    ['Scroll bij vol scherm', 'Scroll on full screen'],
    ['Stop bij alleen 1 of 0', 'Stop on just 1 or 0'],
    ['Start een nieuwe afbeelding met de huidige instellingen', 'Start a new render with the current settings'],
    ['Kleuren', 'Colors'],
    ['Palet', 'Palette'],
    ['Achtergrondkleur', 'Background color'],
    ['Zwart', 'Black'],
    ['Wit', 'White'],
    ['Grijs', 'Grey'],
    ['Start opnieuw', 'Start over'],
    ['Iteraties', 'Iterations'],
    ['Aantal gegenereerde regels', 'Number of lines generated'],
    ['Max iteraties', 'Max iterations'],
    ['De formule waarmee gerekend wordt', 'The formula generating the image'],
    ['Aantal niveaus (kleuren) van de berekening', 'Number of levels (colors) of the calculation'],
    ['Het aantal startpunten', 'The number of initial points'],
    ['Willekeurige verdeling van de startpunten', 'Random positions of initial points'],
    ['Scroll het beeld als het scherm vol is', 'Scroll the image when screen is full'],
    ['Stop als het oninteressant wordt', 'Stop when it gets boring'],
    ['Maximum aantal iteraties (0 = geen limiet)', 'Maximum iterations (0 = no limit)'],
    ['Kies het kleurenpalet en de achtergrondkleur', 'Choose color palette and background color'],
    ['Niveaus voor', 'Levels for'],
    ['Herhalingen', 'Repetitions'],
    ['Deze instelling werkt direct op de huidige afbeelding', 'This setting affects the current image directly'],
    ['Randgedrag', 'Edge behavior'],
    ['Wat gebeurt aan de randen', 'What happens at the image edges'],
]);

export const useLanguageStore = defineStore('language', () => {
    const lang = ref<'nl' | 'en'>(navigator.language.startsWith('nl') ? 'nl' : 'en');
    const getEdgeValues = () => initEdges();

    const translate = (s: string) => {
        const words = s.split(' ');
        return words.map(w => getLangString(w)).join(' ');
    };

    const getLangString = (key: string) => {
        if (lang.value !== 'nl') {
            if (`${parseFloat(key)}` === key) {
                return key;
            }
            return langMap.get(key) ?? `missing: ${key}`;
        }
        return key;
    };

    const getFormulaByValue = (value: number) => {
        const form = initFormulae();
        const formul = form.find(f => f.id === value) ?? form[0];
        if (lang.value === 'en') {
            formul.label = translate(formul.label);
        }
        return formul;
    };

    const getFormulae = () => {
        const form = initFormulae();
        if (lang.value === 'en') {
            form.forEach(f => (f.label = translate(f.label)));
        }
        return form;
    };

    return { lang, getLangString, getFormulae, getFormulaByValue, getEdgeValues };
});
