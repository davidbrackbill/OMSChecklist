<script>
    /**
     * @typedef {Object} Props
     * @property {string} [text]
     * @property {string} [position] - bottom-center, bottom-right, etc.
     * @property {boolean} [multiline] - for help tooltip
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let {
        text = "",
        position = "bottom-center",
        multiline = false,
        children,
    } = $props();

    function getPositionClasses(pos) {
        switch (pos) {
            case "bottom-right":
                return "top-full right-0";
            case "bottom-center":
            default:
                return "top-full left-1/2 transform -translate-x-1/2";
        }
    }
    let positionClasses = $derived(getPositionClasses(position));
    let containerClasses = $derived(
        multiline ? "px-3 py-2 rounded-lg shadow-lg" : "px-2 py-1 rounded",
    );
    let textClasses = $derived(multiline ? "" : "whitespace-nowrap");
</script>

<div
    class="absolute {positionClasses} mt-1 {containerClasses} bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none {textClasses}"
    style="z-index: 99999;"
>
    {#if multiline}
        {@render children?.()}
    {:else}
        {text}
    {/if}
    {#if multiline}
        <!-- Tooltip arrow -->
        <div
            class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"
        ></div>
    {/if}
</div>
