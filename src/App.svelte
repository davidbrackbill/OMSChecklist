<script>
    import {
        activeSections,
        pinnedSections,
        getFromStorage,
        setToStorage,
    } from "./lib/state.js";
    import { createPanelResizer } from "./lib/resize.js";
    import Navbar from "./lib/navbar.svelte";
    import Track from "./lib/track.svelte";
    import Semesters from "./lib/semesters.svelte";
    import Table from "./lib/table.svelte";

    // Resizable layout state
    const LEFT_PANEL_WIDTH = 45;
    let leftPanelWidth = LEFT_PANEL_WIDTH;
    if (typeof window !== "undefined") {
        leftPanelWidth = getFromStorage("leftPanelWidth", LEFT_PANEL_WIDTH);
    }
    const panelResizer = createPanelResizer({
        onResize: (newWidth) => {
            leftPanelWidth = newWidth;
        },
        minPercent: 20,
        maxPercent: 80,
    });
    $: if (typeof window !== "undefined" && !panelResizer.isResizing()) {
        setToStorage("leftPanelWidth", leftPanelWidth);
    }

    $: pinned = $pinnedSections.intersection($activeSections);
    $: nonPinned = $activeSections.difference($pinnedSections);
    
    // Mobile table toggle
    let showTable = false;
</script>

<div class="flex flex-col h-screen">
    <Navbar />

    <!-- Mobile: Stack vertically -->
    <div class="lg:hidden flex flex-col flex-1 min-h-0 pt-2 pb-12">
        <!-- Left panel takes available space -->
        <div class="px-4 overflow-y-auto flex-1 min-h-0">
            {#each pinned as name}
                {#if name === "Semesters"}
                    <Semesters />
                {:else}
                    <Track track={name} />
                {/if}
            {/each}

            {#each nonPinned as name}
                {#if name === "Semesters"}
                    <Semesters />
                {:else}
                    <Track track={name} />
                {/if}
            {/each}
        </div>
        
        <!-- Table section (toggleable on mobile) -->
        {#if showTable}
            <div class="flex-shrink-0 max-h-[40vh] overflow-hidden pt-4">
                <Table />
            </div>
        {/if}
        
        <!-- Table toggle footer for mobile -->
        <div class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-lg flex-shrink-0 z-10">
            <button 
                class="w-full py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50/50 transition-all duration-200 flex items-center justify-center gap-2"
                on:click={() => showTable = !showTable}
            >
                <span class="transform transition-transform duration-200 {showTable ? 'rotate-180' : ''} text-xs">▲</span>
                <span class="text-xs font-medium">{showTable ? 'Hide' : 'Show'} Table</span>
            </button>
        </div>
    </div>

    <!-- Desktop: Side by side -->
    <div class="hidden lg:flex pt-2 pb-4 flex-1 min-h-0">
        <div
            class="ml-2 mr-1 max-h-full overflow-y-auto [scrollbar-gutter:stable] min-w-0"
            style="width: {leftPanelWidth}%"
        >
            {#each pinned as name}
                {#if name === "Semesters"}
                    <Semesters />
                {:else}
                    <Track track={name} />
                {/if}
            {/each}

            {#each nonPinned as name}
                {#if name === "Semesters"}
                    <Semesters />
                {:else}
                    <Track track={name} />
                {/if}
            {/each}
        </div>

        <!-- Resizable divider -->
        <button
            class="w-2 cursor-col-resize relative duration-200 flex-shrink-0"
            on:mousedown={panelResizer.startResize}
        ></button>

        <div
            class="max-h-full pt-2 ml-1 mr-2 min-w-0"
            style="width: {100 - leftPanelWidth}%"
        >
            <Table />
        </div>
    </div>
</div>
