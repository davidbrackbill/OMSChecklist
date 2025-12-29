<script>
    import { toggleSection, pinSection, pinnedSections } from "./state.js";
    import { trackIcons, trackUrls } from "./icon.js";
    import Tooltip from "./tooltip.svelte";

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
        hover:opacity-80 group
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
        <div class="relative mr-1">
            <img src={trackIcons[name]} alt="" class="track-icon" />
            {#if $pinnedSections.has(name)}
                <span class="absolute -top-1 -right-1 text-xs">📌</span>
            {/if}
        </div>
        {name}
        {#if trackUrls[name]}
            <span class="relative ml-1 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity">
                <a
                    href={trackUrls[name]}
                    target="_blank"
                    rel="noopener noreferrer"
                    onclick={(e) => e.stopPropagation()}
                    ondblclick={(e) => e.stopPropagation()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                </a>
            </span>
        {/if}
    </h2>
    <div class="flex flex-wrap justify-center track-content">
        {@render children?.()}
    </div>
</div>
