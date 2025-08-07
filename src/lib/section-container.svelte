<script>
    import { toggleSection, pinSection, pinnedSections } from "./state.js";
    import { trackIcons } from "./icon.js";

    /**
     * @typedef {Object} Props
     * @property {any} name
     * @property {string} [css]
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { name, css = "text-black", children } = $props();
</script>

<div class="track-container">
    <h2 
        class="font-medium text-2xl text-center cursor-pointer
        transition-opacity flex items-center justify-center gap-2 mb-2
        hover:opacity-80
        {css}"
        onclick={(event) => {
            if (event.ctrlKey || event.metaKey) {
                pinSection(name);
            } else {
                toggleSection(name);
            }
        }}
        ondblclick={() => pinSection(name)}
    >
        <div class="relative">
            <img src={trackIcons[name]} alt="" class="track-icon" />
            {#if $pinnedSections.has(name)}
                <span class="absolute -top-1 -right-1 text-xs">📌</span>
            {/if}
        </div>
        {name}
    </h2>
    <div class="flex flex-wrap justify-center mx-2 track-content">
        {@render children?.()}
    </div>
</div>

