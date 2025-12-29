<script>
    import {
        activeSections,
        toggleSection,
        pinnedSections,
        pinSection,
        clearSpecs,
    } from "./state.js";
    import Tooltip from "./tooltip.svelte";
    import { trackIcons } from "./icon.js";
    const images = trackIcons;

    let showDropdown = $state(false);

    const usefulLinks = [
        { name: "OMSCS Homepage", url: "https://omscs.gatech.edu/" },
        { name: "Degree Requirements", url: "https://omscs.gatech.edu/degree-requirements" },
        { name: "Current Courses", url: "https://omscs.gatech.edu/current-courses" },
        { name: "Specializations", url: "https://omscs.gatech.edu/program-info/specializations" },
        { name: "OMSCentral", url: "https://www.omscentral.com/" },
        { name: "OMSHub", url: "https://www.omshub.org/" },
        { name: "r/OMSCS", url: "https://www.reddit.com/r/OMSCS/" },
    ];

    // Helper function for icon sizing
    function getIconClasses(key, isMobile = false) {
        const baseSize = isMobile ? "w-6 h-6" : "w-7 h-7";
        const inactiveSize = isMobile ? "w-5 h-5" : "w-6 h-6";
        const hoverSize = isMobile
            ? "hover:w-6 hover:h-6"
            : "hover:w-7 hover:h-7";

        return `object-contain transition-all duration-200 ${
            $activeSections.has(key) ? baseSize : `${inactiveSize} ${hoverSize}`
        }`;
    }
</script>

{#snippet icon(key, image, isMobile = false)}
    <div class="relative group last:ml-6">
        <button
            class="flex items-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity relative"
            data-spec={key}
            onclick={() => toggleSection(key)}
            ondblclick={() => {
                const wasPinned = $pinnedSections.has(key);
                pinSection(key);
                if (wasPinned) {
                    toggleSection(key);
                }
            }}
        >
            <img class={getIconClasses(key, isMobile)} src={image} alt="" />
            {#if $pinnedSections.has(key)}
                <div class="absolute -top-1 -right-1 text-xs">📌</div>
            {/if}
        </button>
        <Tooltip text={key} />
    </div>
{/snippet}

<svelte:head>
    {#each Object.values(images) as image}
        <link rel="preload" href={image} as="image" type="image/webp" />
    {/each}
</svelte:head>

<div
    class="w-full py-3 px-4 drop-shadow-md flex items-center relative"
    style="background-color: var(--color-sidebar-bg); z-index: 100;"
>
    <!-- Mobile: Only track tabs -->
    <div class="lg:hidden flex items-center gap-2 mx-2 flex-1 justify-center">
        <div class="relative group">
            <button
                class="flex items-center
                text-xs px-1 py-1 rounded opacity-70
                hover:bg-red-200 hover:opacity-90
                transition-colors"
                onclick={clearSpecs}
            >
                🗑️
            </button>
            <Tooltip text="Clear tabs" />
        </div>

        {#each Object.entries(images) as [key, image]}
            {@render icon(key, image, true)}
        {/each}
    </div>

    <!-- Desktop: Full navbar -->
    <div class="hidden lg:flex items-center ml-28 gap-4 mx-8">
        <div class="relative group">
            <button
                class="text-sm px-2 py-1 mr-4 rounded hover:bg-red-200
                transition-colors flex items-center opacity-70"
                onclick={clearSpecs}
            >
                🗑️
            </button>
            <Tooltip text="Clear tabs" />
        </div>

        {#each Object.entries(images) as [key, image]}
            {@render icon(key, image, false)}
        {/each}
    </div>

    <!-- Desktop: Right side controls -->
    <div class="hidden lg:flex items-center gap-3 ml-auto">
        <div class="relative group">
            <div class="text-xs text-gray-400 cursor-help">
                Reviews last updated: 10/14/25
            </div>
            <Tooltip text="Aggregates OMSHub and OMSCentral" />
        </div>

        <!-- Useful Links Dropdown -->
        <div class="relative">
            <div class="group">
                <button
                    class="text-gray-400 hover:text-gray-600 transition-colors flex items-center"
                    onclick={() => showDropdown = !showDropdown}
                    onblur={() => setTimeout(() => showDropdown = false, 200)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </button>
                {#if !showDropdown}
                    <Tooltip text="Useful Links" />
                {/if}
            </div>
            {#if showDropdown}
                <div class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div class="py-1">
                        {#each usefulLinks as link, i}
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                {link.name}
                            </a>
                            {#if i < usefulLinks.length - 1}
                                <hr class="border-gray-200" />
                            {/if}
                        {/each}
                    </div>
                </div>
            {/if}
        </div>

        <div class="relative group">
            <Tooltip text="Github" />
            <a
                href="https://github.com/davidbrackbill/omscs_spec"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-gray-600 transition-colors flex items-center"
            >
                <img src="/github.svg" alt="GitHub" class="w-4 h-4" />
            </a>
        </div>
    </div>
</div>
