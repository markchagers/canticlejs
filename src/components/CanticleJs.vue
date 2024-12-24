<script setup lang="ts">
    import { ref } from 'vue';
    import { Canticle } from '../process/canticle';

    type TOption = {
        label: string;
        formula: number
    }

    const selectedFormula = ref<TOption>({ label: 'zeer fascinerend!!', formula: 1 });

    const formulaOptions: TOption[] = [
        { label: 'zeer fascinerend!!', formula: 1 },
        { label: 'nog dichter bij amiga programma!', formula: 2 },
        { label: 'ook wel aardig', formula: 3 },
        { label: 'wel aardig', formula: 4 },
        { label: 'heel mooi', formula: 5 },
        { label: 'formule 6', formula: 6 },
        { label: 'formule 7', formula: 7 },
        { label: 'kerstboom met kaarsjes', formula: 8 },
        { label: 'wel aardig 3', formula: 9 },
    ];


    const cantvas = ref<HTMLCanvasElement>();
    const start = () => {
        const selected = selectedFormula.value
        if (cantvas.value && selected) {
            const canticle = new Canticle(cantvas.value, {
                formule: selected.formula,
                steps: 30,
                updateInterval: 1,
                maxOverflow: 1,
                minOverflow: 1,
                edgeBehavior: 'reflect',
                initPoints: 'random',
                initNumber: 3,
                scrolling: true
            });
            canticle.drawCanticle();
        }
    }
</script>

<template>
    <div class="main">
        <h1>Canticle JS</h1>
        <div class="control">
            <span>Formule</span>
            <select name="formule" v-model="selectedFormula">
                <option v-for="opt in formulaOptions" :key="opt.formula" :value="opt">{{
                    opt.label }}</option>
            </select>
            <button @click="start()">Start</button>
        </div>

        <canvas width="1000" height="800" ref="cantvas"></canvas>
    </div>
</template>

<style lang="css">
    .main {
        display: flex;
        flex-flow: column nowrap;
        gap: 16px;
    }

    canvas {
        width: 1000px;
        height: 800px;
        background-color: black;
    }
</style>
