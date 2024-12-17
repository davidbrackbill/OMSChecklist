<script>
    import { courses } from "$lib/data.js";
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    export let codes;
    export let flipDurationMs = 200;

    let pinned = false;

    $: items = codes.map((code) => ({ code, id: code }));
    const consider = (e) => {
        items = e.detail.items;
    };
    const finalize = (e) => {
        items = e.detail.items;
        pinned = true;
        console.log(pinned);
    };

    function average_difficulty(codes) {
        if (codes.length === 0) return 0;
        let sum = codes.reduce((a, b) => a + courses[b]["Difficulty"], 0);
        return (sum / codes.length).toFixed(1);
    }

    function workload(codes) {
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
                {item.code}
            </div>
        {/each}
    </section>
    <div draggable="false" class="flex stats">
        <div>&#128548{average_difficulty(codes)}</div>
        <div>&#9203{workload(codes)}</div>
    </div>
</div>

<style>
    .courses {
        margin-bottom: 10px;
    }

    .stats {
        justify-content: center;
        margin-top: auto;
        gap: 6%;
    }
</style>
