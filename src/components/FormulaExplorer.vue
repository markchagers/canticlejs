<script setup lang='ts'>
    import depthData from '@/assets/depth/depth-20k-100-1001.json';
    import { computed } from 'vue';
    import { useLanguageStore } from '../store/language';
    import { useSettingsStore } from '../store/settings';

    interface depthrec {
        id: string;
        formule: number;
        levels: number;
        iterations: number;
        herhalingen: number
    }

    const langStore = useLanguageStore();
    const settings = useSettingsStore();
    const emit = defineEmits(['close']);
    const testData: depthrec[] = depthData.map((d, i) => ({ id: `d_${i}`, ...d }));

    const foundData = computed(() => {
        const form = settings.selectedFormula;
        return testData.filter(d => d.formule === form);
    })

</script>
<template>
    <div class="docs">
        <div class="control">
            <h2>{{ langStore.getFormulaByValue(settings.selectedFormula).label }}</h2>
            <button class="close" @click="emit('close')">
                <div class="closeicon"> </div>
            </button>
        </div>
        <div class="page-container">
            <table>
                <thead>
                    <tr>
                        <th>{{ langStore.getLangString('Niveaus') }}</th>
                        <th>{{ langStore.getLangString('Iteraties') }}</th>
                        <th>{{ langStore.getLangString('Herhalingen') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rec in foundData" :key="rec.id"
                        :class="{ badvalue: rec.herhalingen > 1000 || rec.iterations < 500 }">
                        <td>{{ rec.levels }}</td>
                        <td>{{ rec.iterations }}</td>
                        <td>{{ rec.herhalingen }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style>
    table {
        display: block;
        overflow-y: scroll;
        max-height: 75vh;
        text-align: right;
        padding-right: 20px;
        margin: -16px;
        border-collapse: collapse;
    }

    tbody {
        overflow-y: scroll;
    }

    table thead th {
        position: sticky;
        top: 0px;
        background: var(--color-background-soft);
        z-index: 1;
        min-width: 80px;
        padding-right: 10px;
    }

    table tbody tr.badvalue {
        background-color: #965a5a;
        color: white;
    }

    table tbody td {
        padding-right: 10px;
    }
</style>