<script>
    export let text = "";
    export let position = "bottom-center"; // bottom-center, bottom-right, etc.
    export let multiline = false; // for help tooltip
    
    $: positionClasses = getPositionClasses(position);
    $: containerClasses = multiline ? "px-3 py-2 rounded-lg shadow-lg" : "px-2 py-1 rounded";
    $: textClasses = multiline ? "" : "whitespace-nowrap";
    
    function getPositionClasses(pos) {
        switch(pos) {
            case "bottom-right":
                return "top-full right-0";
            case "bottom-center":
            default:
                return "top-full left-1/2 transform -translate-x-1/2";
        }
    }
</script>

<div class="absolute {positionClasses} mt-1 {containerClasses} bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none {textClasses} z-[9999]">
    {#if multiline}
        <slot />
    {:else}
        {text}
    {/if}
    {#if multiline}
        <!-- Tooltip arrow -->
        <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
    {/if}
</div>
