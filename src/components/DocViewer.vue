<script setup lang="ts">
    import { marked } from 'marked';
    import { ref, watchEffect } from 'vue';

    type content = 'howto' | 'whatis' | 'background';
    const tab = ref<content>('whatis');
    const result = ref('');
    watchEffect(async () => {
        const url = `/canticle/src/assets/doc/${tab.value}.md`;
        fetch(url).then(r => r.text()).then(t => marked(t)).then(html => result.value = html)
    });
</script>

<template>
    <div class="docs">
        <div class="tabs">
            <div class="btn" @click="tab = 'whatis'" :class="{ special: tab === 'whatis' }">Wat is CanticleJS?</div>
            <div class="btn" @click="tab = 'howto'" :class="{ special: tab === 'howto' }">Hoe gebruik je het?</div>
            <div class="btn" @click="tab = 'background'" :class="{ special: tab === 'background' }">Achtergrond</div>
        </div>
        <div class="page" v-html="result">
        </div>
    </div>
</template>

<style lang="css">
    .docs {
        background-color: #eee;
        border: 1px solid #aaa;
        border-radius: 8px;
        padding: 24px;
        position: absolute;
        top: 2vh;
        bottom: 2vh;
        left: 20vw;
        right: 2vw;
        margin: 0 auto 0 auto;
        height: min-content;
    }

    .page {
        position: relative;
        background-color: white;
        border: 1px solid #aaa;
        padding: 32px;
        border-radius: 6px;
        overflow-y: scroll;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: min-content;
    }

    .page p {
        margin-bottom: 6px;
    }

    .tabs {
        display: flex;
        gap: 8px;
    }

    .btn {
        font-weight: bold;
        cursor: pointer;
        padding: 2px 10px;
        border: 1px solid #aaa;
        border-radius: 6px;
        margin-bottom: 2px;
    }

    .btn.special {
        background-color: white;
        border-bottom-color: white;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        padding-bottom: 3px;
        margin-bottom: -1px;
        z-index: 1;
    }
</style>