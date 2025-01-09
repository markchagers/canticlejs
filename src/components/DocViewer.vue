<script setup lang="ts">
    import { marked } from 'marked';
    import { ref, watchEffect } from 'vue';
    import { useLanguageStore } from '../store/language';

    const langStore = useLanguageStore();
    const props = defineProps<{ language: 'nl' | 'en' }>();
    type content = 'howto' | 'whatis' | 'background';
    const tab = ref<content>('whatis');
    const result = ref('');
    watchEffect(async () => {
        const url = `/canticle/doc/${tab.value}-${props.language}.md`;
        fetch(url)
            .then(r => r.text())
            .then(t => marked(t))
            .then(html => (result.value = html));
    });

    const emit = defineEmits(['close']);
</script>

<template>
    <div class="docs">
        <div class="tabs">
            <div class="btn" @click="tab = 'whatis'" :class="{ special: tab === 'whatis' }">
                {{ langStore.getLangString('Wat is CanticleJS?') }}
            </div>
            <div class="btn" @click="tab = 'howto'" :class="{ special: tab === 'howto' }">
                {{ langStore.getLangString('Gebruiksaanwijzing') }}
            </div>
            <div class="btn" @click="tab = 'background'" :class="{ special: tab === 'background' }">
                {{ langStore.getLangString('Achtergrond') }}
            </div>
            <button class="close" @click="emit('close')">
                <div> </div>
            </button>
        </div>
        <div class="page" v-html="result"></div>
    </div>
</template>

<style lang="css">
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
</style>
