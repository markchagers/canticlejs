<script setup lang='ts'>
    import depthData from '@/assets/depth/depth-20k-100-1001.json';
    import { computed } from 'vue';
    import { useLanguageStore, type TOption } from '../store/language';

    interface depthrec {
        id: string;
        formule: number;
        levels: number;
        iterations: number;
        herhalingen: number
    }

    const langStore = useLanguageStore();
    const emit = defineEmits(['close']);
    const props = defineProps<{ formule: TOption }>();
    const testData: depthrec[] = depthData.map((d, i) => ({ id: `d_${i}`, ...d }));

    const foundData = computed(() => {
        return testData.filter(d => d.formule === props.formule.value);
    })

</script>
<template>
    <div class="docs">
        <div class="control">
            <h2>{{ props.formule.label }}</h2>
            <button class="close" @click="emit('close')">
                <div> </div>
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