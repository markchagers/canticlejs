<script setup lang="ts">
    import { marked } from 'marked';
    import { ref, watchEffect } from 'vue';
    import { useLanguageStore } from '../store/language';

    const langStore = useLanguageStore()
    const props = defineProps<{ language: 'nl' | 'en' }>();
    type content = 'howto' | 'whatis' | 'background';
    const tab = ref<content>('whatis');
    const result = ref('');
    watchEffect(async () => {
        const url = `/canticle/doc/${tab.value}-${props.language}.md`;
        fetch(url).then(r => r.text()).then(t => marked(t)).then(html => result.value = html)
    });

    const emit = defineEmits(['close'])
</script>

<template>
    <div class="docs">
        <div class="tabs">
            <div class="btn" @click="tab = 'whatis'" :class="{ special: tab === 'whatis' }">
                {{ langStore.getLangString('Wat is CanticleJS?') }}</div>
            <div class="btn" @click="tab = 'howto'" :class="{ special: tab === 'howto' }">
                {{ langStore.getLangString('Gebruiksaanwijzing') }}</div>
            <div class="btn" @click="tab = 'background'" :class="{ special: tab === 'background' }">
                {{ langStore.getLangString('Achtergrond') }}</div>
            <button class="close" @click="emit('close')">
                <div> </div>
            </button>
        </div>
        <div class="page" v-html="result">
        </div>
    </div>
</template>

<style lang="css">
    .docs {
        background-color: var(--color-background-soft);
        border: 1px solid var(--color-border);
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
        column-count: 2;
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
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
        line-height: 1.25rem;
        margin-bottom: 12px;
    }

    .tabs {
        padding-left: 8px;
        display: flex;
        gap: 8px;
    }

    .btn {
        background-color: var(--color-background-muted);
        font-weight: bold;
        cursor: pointer;
        padding: 2px 10px;
        border: 1px solid var(--color-border);
        border-radius: 6px;
        margin-bottom: 2px;
    }

    .btn.special {
        background-color: var(--color-background);
        border-bottom-color: var(--color-background);
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        padding-bottom: 3px;
        margin-bottom: -1px;
        z-index: 1;
    }

    .close {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 32px;
        height: 32px;
        cursor: pointer;
    }

    .close div {
        width: 24px;
        height: 24px;
        --svg: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><line x1="4" y1="4" x2="24" y2="24" stroke="currentColor" stroke-linecap="round" stroke-width="5" /><line x1="4" y1="24" x2="24" y2="4" stroke="currentColor" stroke-linecap="round" stroke-width="5" /></svg>');
        background-color: var(--color-text);
        mask: var(--svg);
        mask-repeat: no-repeat;
        margin-left: -12px;
    }

    .close:hover div {
        background-color: var(--color-select);
    }
</style>