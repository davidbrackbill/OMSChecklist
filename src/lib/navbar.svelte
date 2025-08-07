<script>
    import { activeSections, toggleSection, clear, activeCourses, pinnedSections, pinSection, clearSpecs, clearCourses } from "./state.js";
    import Tooltip from "./tooltip.svelte";
    import { trackIcons } from "./icon.js";
    const images = trackIcons;
</script>

<svelte:head>
    {#each Object.values(images) as image}
        <link rel="preload" href={image} as="image" type="image/webp" />
    {/each}
</svelte:head>

<div class="w-full py-3 px-4 drop-shadow-md flex items-center" style="background-color: var(--color-sidebar-bg);">
    <!-- Mobile: Only track tabs -->
    <div class="lg:hidden flex items-center gap-2 mx-2 flex-1 justify-center">
        <div class="relative group">
            <button class="text-xs px-1 py-1 rounded hover:bg-red-200 transition-colors flex items-center opacity-40" onclick={clearSpecs}>
                ▼
            </button>
            <Tooltip text="Clear tabs" />
        </div>
        
        {#each Object.entries(images) as [key, image]}
            <div class="relative group">
                <figure
                    class="flex items-center cursor-pointer hover:opacity-80 transition-opacity relative"
                    data-spec={key}
                    onclick={(event) => {
                        if (event.ctrlKey || event.metaKey) {
                            pinSection(key);
                        } else {
                            toggleSection(key);
                        }
                    }}
                >
                    <img
                        class="w-6 h-6 object-contain transition-opacity duration-200 {$activeSections.has(key) ? 'opacity-100' : 'opacity-30 hover:opacity-60'}"
                        src={image}
                        alt=""
                    />
                    {#if $pinnedSections.has(key)}
                        <div class="absolute -top-1 -right-1 text-xs">📌</div>
                    {/if}
                </figure>
                <Tooltip text={key} />
            </div>
        {/each}
    </div>
    
    <!-- Desktop: Full navbar -->
    <div class="hidden lg:flex items-center gap-4 mx-8">
        <div class="relative group">
            <button class="text-sm px-2 py-1 rounded hover:bg-red-200 transition-colors flex items-center opacity-40" onclick={clearSpecs}>
                ▼
            </button>
            <Tooltip text="Clear tabs" />
        </div>
        
        {#each Object.entries(images) as [key, image]}
            <div class="relative group">
                <figure
                    class="flex items-center cursor-pointer hover:opacity-80 transition-opacity relative"
                    data-spec={key}
                    onclick={(event) => {
                        if (event.ctrlKey || event.metaKey) {
                            pinSection(key);
                        } else {
                            toggleSection(key);
                        }
                    }}
                >
                    <img
                        class="w-7 h-7 object-contain transition-opacity duration-200 {$activeSections.has(key) ? 'opacity-100' : 'opacity-30 hover:opacity-60'}"
                        src={image}
                        alt=""
                    />
                    {#if $pinnedSections.has(key)}
                        <div class="absolute -top-1 -right-1 text-xs">📌</div>
                    {/if}
                </figure>
                <Tooltip text={key} />
            </div>
        {/each}
        
        <div class="relative group ml-2">
            <div class="w-4 h-4 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors cursor-help flex items-center justify-center text-xs text-gray-600 hover:text-gray-800">
                ?
            </div>
            <Tooltip multiline={true}>
                <div class="text-center w-60">
                    <div class="font-semibold mb-1">Tabs</div>
                    <ul class="text-left list-disc list-inside space-y-0.5">
                        <li>Only one track is shown at a time</li>
                        <li>Show multiple by pinning (ctrl-click)</li>
                        <li>Pinned tabs appear first and stay visible</li>
                    </ul>
                </div>
            </Tooltip>
        </div>
    </div>
    
    <!-- Desktop: Right side controls -->
    <div class="hidden lg:flex items-center gap-4 ml-auto">
        <div class="flex items-center gap-2 ml-2">
            <div class="relative group">
                <div class="text-xs text-gray-400 cursor-help">
                    Reviews last updated: 08/05/25
                </div>
                <Tooltip text="Aggregates OMSHub and OMSCentral"/>
            </div>
            <a 
                href="https://github.com/davidbrackbill/omscs_spec" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                title="View on GitHub"
            >
                <img src="/github.svg" alt="GitHub" class="w-4 h-4" />
            </a>
        </div>
    </div>
</div>

