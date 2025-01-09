<script setup lang='ts'>
    import depthData from '@/assets/depth/depth-20k-100-1001.json';
    import { computed, ref } from 'vue';
    import { useLanguageStore, type TOption } from '../store/language';

    interface depthrec {
        id: string;
        formule: number;
        levels: number;
        iterations: number;
        herhalingen: number
    }

    const langStore = useLanguageStore();
    const selectedFormula = ref<TOption>({ label: 'formule 1', value: 1 });
    const testData: depthrec[] = depthData.map((d, i) => ({ id: `d_${i}`, ...d }));

    const foundData = computed(() => {
        return testData.filter(d => d.formule === selectedFormula.value.value);
    })

    const emit = defineEmits(['close']);
</script>
<template>
    <div class="docs">
        <div class="control">
            <label for="formule" :title="langStore.getLangString('De formule waarmee gerekend wordt')">
                {{ langStore.getLangString('Formule') }}:
                <select name="formule" id="formule" v-model="selectedFormula">
                    <option v-for="opt in langStore.getFormulae()" :key="opt.value" :value="opt">{{ opt.label }}
                    </option>
                </select>
            </label>
            <button class="close" @click="emit('close')">
                <div> </div>
            </button>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Levels</th>
                        <th>Iterations</th>
                        <th>Herhalingen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rec in foundData" :key="rec.id">
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
    }

    tbody {
        overflow-y: scroll;
    }

    table thead th {
        position: sticky;
        top: 0px;
        background: var(--color-background-soft);
        z-index: 1;
    }
</style>