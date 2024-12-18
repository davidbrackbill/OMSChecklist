<script>
    import { courses } from "$lib/data.js";
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    export let codes, index, pinned;
    export let flipDurationMs = 200;

    /* Svelte-dnd */
    $: codes = codes ?? [];
    console.log("Semester", index, codes);

    // Give codes an id for svelte-dnd to use
    $: items = codes.map((code) => ({ code, id: code }));

    const consider = (e) => {
        items = e.detail.items;
    };

    const finalize = (e) => {
        items = e.detail.items;
        if (items.length === 0) delete pinned[index];
        else pinned[index] = items.map((o) => o.code);
        pinned = pinned;
        console.debug(index, e.detail.info.trigger);
    };

    /* Stats */

    function average_difficulty(items) {
        if (items.length === 0) return 0;
        let codes = items.map((o) => o.code);
        let sum = codes.reduce((a, b) => a + courses[b]["Difficulty"], 0);
        return (sum / codes.length).toFixed(1);
    }

    function workload(items) {
        let codes = items.map((o) => o.code);
        return Math.floor(
            codes.reduce((a, b) => a + courses[b]["Workload"], 0),
        );
    }
</script>

<div class="flex-c courses bucket">
    <section
        use:dndzone={{ items, flipDurationMs }}
        on:consider={consider}
        on:finalize={finalize}
        style="flex-basis: 75px;"
    >
        {#each items as item (item.id)}
            <div animate:flip={{ duration: flipDurationMs }}>
                <div class="course-text">{courses[item.code]["Course"]}</div>
            </div>
        {/each}
    </section>
    <div class="flex stats">
        <div>&#128548{average_difficulty(items)}</div>
        <div>&#9203{workload(items)}</div>
    </div>
</div>

<style>
    .course-text {
        line-height: 90%;
        font-size: 0.8em;
        margin-top: 0.3em;
    }
    .courses {
        margin-bottom: 10px;
    }

    .stats {
        justify-content: center;
        margin-top: auto;
        gap: 6%;
    }
</style>
