<script>
    import { courses } from "./fallback.js";
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import Tooltip from "./tooltip.svelte";
    export let codes, index, pinned;

    export let flipDurationMs = 100;
    export let dropTargetStyle = {
        "box-shadow": "var(--shadow-drop-target)",
    };

    /* Svelte-dnd */
    // Give codes an id for svelte-dnd to use
    $: items = codes.map((code) => ({ code, id: code }));

    const dndConsider = (e) => {
        items = e.detail.items;
    };

    const dndFinalize = (e) => {
        items = e.detail.items;
        if (items.length === 0) delete pinned[index];
        else pinned[index] = items.map((o) => o.code);
        pinned = pinned;
    };

    /* Stats */
    function getDifficulty(items) {
        if (items.length === 0) return 0;
        let codes = items.map((o) => o.code);
        let sum = codes.reduce((a, b) => a + courses[b]["difficulty"], 0);
        return (sum / codes.length).toFixed(1);
    }

    function getWorkload(items) {
        let codes = items.map((o) => o.code);
        return Math.floor(
            codes.reduce((a, b) => a + courses[b]["workload"], 0),
        );
    }

    function getWorkloadEmoji(workload) {
        if (workload < 11) return "💨";
        if (workload < 17) return "⌚";
        if (workload < 25) return "⌛";
        return "⏳";
    }

    function getDifficultyEmoji(difficulty) {
        if (difficulty < 2.8) return "😴";
        if (difficulty < 3.5) return "🤓";
        if (difficulty < 4.3) return "😤";
        return "🫠";
    }
</script>

<div class="flex flex-col mr-4 text-sm mb-0.5">
    <div class="relative group">
        <section
            class="course-container border border-black hover:border-2 mt-2"
            use:dndzone={{ items, flipDurationMs, dropTargetStyle }}
            on:consider={dndConsider}
            on:finalize={dndFinalize}
        >
            {#each items as item (item.id)}
                <div
                    class="course-item hover:border rounded-lg "
                    animate:flip={{ duration: flipDurationMs }}
                >
                    {courses[item.code]["name"]}
                </div>
            {/each}
        </section>
        <Tooltip multiline={true} position="bottom-right">
            <div class="w-40 flex-col content-center justify-center">
              <div class="font-semibold mb-1 text-center">
                  Semester {index + 1}
              </div>
              <div class="mb-1 text-center">
                  {getDifficulty(items)}
                  average difficulty {getDifficultyEmoji(
                      getDifficulty(items),
                  )}
              </div>
              <div class="text-center">
                  {getWorkload(items)}
                  hours per week {getWorkloadEmoji(getWorkload(items))}
              </div>
            </div>
        </Tooltip>
    </div>
    <div class="semester-stats flex items-center gap-1 text-xs -mt-1">
        <div>{getDifficultyEmoji(getDifficulty(items))}{getDifficulty(items)}</div>
        <div>{getWorkloadEmoji(getWorkload(items))}{getWorkload(items)}</div>
    </div>
</div>
