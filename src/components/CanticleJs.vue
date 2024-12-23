<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { Canticle, Formula } from '../process/canticle';

    const formulaOptions: { label: string, value: number }[] = [];
    onMounted(() => {
        Formula.forEach((value, label) => {
            formulaOptions.push({ label, value });
        });
    });

    const selectedFormula = ref({ label: 'zeer faksinerend!!', value: 1 })
    const cantvas = ref<HTMLCanvasElement>();
    const start = () => {
        if (cantvas.value) {
            const canticle = new Canticle(cantvas.value, {
                formule: selectedFormula.value.value,
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
            <select name="formule" @select="start()">
                <option v-for="opt in formulaOptions" :key="opt.label" value="opt.value">{{
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
