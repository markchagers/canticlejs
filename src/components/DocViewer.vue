<script setup lang="ts">
    import { marked } from 'marked';
    import { ref, watchEffect } from 'vue';
    import { useLanguageStore } from '../store/language';

    const langStore = useLanguageStore();
    const props = defineProps<{ language: 'nl' | 'en' }>();
    type content = 'howto' | 'whatis' | 'background' | 'formule';
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
            <div class="btn" @click="tab = 'formule'" :class="{ special: tab === 'formule' }">
                {{ langStore.getLangString('Formule') }}
            </div>
            <button class="close" @click="emit('close')">
                <div class="closeicon"> </div>
            </button>
        </div>
        <div class="page-container">
            <div class="page" v-html="result"></div>
        </div>
    </div>
</template>

<style lang="css">
    .page {
        column-count: 2;
        position: relative;
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
