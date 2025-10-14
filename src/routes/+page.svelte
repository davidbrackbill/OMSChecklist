<script>
    import { run } from "svelte/legacy";

    import {
        activeSections,
        pinnedSections,
        getFromStorage,
        setToStorage,
    } from "../lib/state.js";
    import { createPanelResizer } from "../lib/resize.js";
    import Navbar from "../lib/navbar.svelte";
    import Track from "../lib/track.svelte";
    import Semesters from "../lib/semesters.svelte";
    import Table from "../lib/table.svelte";

    // Resizable layout state
    const LEFT_PANEL_WIDTH = 45;
    let leftPanelWidth = $state(LEFT_PANEL_WIDTH);
    let mounted = $state(false);

    let pinned = $derived($pinnedSections.intersection($activeSections));
    let nonPinned = $derived($activeSections.difference($pinnedSections));

    if (typeof window !== "undefined") {
        leftPanelWidth = getFromStorage("leftPanelWidth", LEFT_PANEL_WIDTH);
        mounted = true;
    }
    const panelResizer = createPanelResizer({
        onResize: (newWidth) => {
            leftPanelWidth = newWidth;
        },
        minPercent: 20,
        maxPercent: 80,
    });
    run(() => {
        if (typeof window !== "undefined" && !panelResizer.isResizing()) {
            setToStorage("leftPanelWidth", leftPanelWidth);
        }
    });
</script>

{#snippet CoursePanelContent($activeSections, pinned, nonPinned)}
    {#if $activeSections.size === 0}
        <div
            class="text-center m-4 pb-8 pt-6 px-6 bg-gray-50 rounded-lg border border-gray-200"
        >
            <h1 class="font-semibold text-lg text-gray-900 mb-4">
                Welcome to OMSCS Checklist
            </h1>
            <div class=" text-sm text-gray-700 space-y-3 mb-4">
                <p>
                    Choose a track in the menu above to get started.
                </p>
                <ul class="text-sm space-y-1 text-left inline-block">
                    <li>• Double click to pin a track</li>
                    <li>• Pinned tracks stay visible and appear first</li>
                </ul>
            </div>
        </div>
    {:else}
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
    {/if}
{/snippet}

{#if mounted}
    <div class="flex flex-col h-screen">
        <Navbar />

        <!-- Mobile -->
        <div class="lg:hidden flex flex-col flex-1 min-h-0 pt-2 pb-6">
            <div class="px-4 mx-2 overflow-y-auto flex-1 min-h-0">
                {@render CoursePanelContent($activeSections, pinned, nonPinned)}
            </div>

            <div class="flex-shrink-0 max-h-[50vh] overflow-hidden pt-4">
                <Table />
            </div>
        </div>

        <!-- Desktop -->
        <div class="hidden lg:flex pt-2 pb-4 flex-1 min-h-0">
            <div
                class="ml-2 mr-1 mx-2 max-h-full overflow-y-auto [scrollbar-gutter:stable] min-w-0"
                style="width: {leftPanelWidth}%"
            >
                {@render CoursePanelContent($activeSections, pinned, nonPinned)}
            </div>

            <button
                class="w-2 cursor-col-resize relative duration-200 flex-shrink-0"
                onmousedown={panelResizer.startResize}
            ></button>

            <div
                class="max-h-full pt-2 ml-1 mr-2 min-w-0"
                style="width: {100 - leftPanelWidth}%"
            >
                <Table />
            </div>
        </div>
    </div>
{/if}
