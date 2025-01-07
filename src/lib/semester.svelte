<script>
    import { courses } from "$lib/data.js";
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import Bucket from "$lib/bucket.svelte";
    export let codes, index, pinned;

    export let flipDurationMs = 100;
    export let dropTargetStyle = {
        border: "solid rgba(0, 255, 255, 0.2)",
        "border-radius": "4px",
    };

    /* Svelte-dnd */
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

<Bucket>
    <section
        slot="inside"
        use:dndzone={{ items, flipDurationMs, dropTargetStyle }}
        on:consider={consider}
        on:finalize={finalize}
    >
        {#each items as item (item.id)}
            <div class="shimmer" animate:flip={{ duration: flipDurationMs }}>
                {item.code}
            </div>
        {/each}
    </section>
    <div slot="label">
        &#128548{average_difficulty(items)}&nbsp;&#9203{workload(items)}
    </div>
</Bucket>

<style>
    section {
        flex-basis: 75px;
    }
</style>
