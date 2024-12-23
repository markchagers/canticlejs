<script setup lang="ts">
    import { ref } from 'vue';
    import { drawCanticle } from '../process/canticle';

    const cantvas = ref<HTMLCanvasElement>()
    const start = () => {
        if (cantvas.value) {
            drawCanticle(cantvas.value, {
                formule: 1,
                updateInterval: 1,
                maxOverflow: 1,
                minOverflow: 1,
                edgeBehavior: 'reflect',
                initPoints: 'random',
                initNumber: 3
            })
        }
    }
</script>

<template>
    <div class="main">
        <h1>Canticle JS</h1>
        <button @click="start()">Start</button>
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
