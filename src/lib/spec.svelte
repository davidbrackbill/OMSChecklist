<script>
    import { active_courses } from "../lib/state.js";
    import { toggle_rows, active_bucket } from "../lib/state.js";
    import Bucket from "$lib/bucket.svelte";

    export let spec, category, count, listed;

    function active(bucket) {
        if (bucket[spec] === category) return "shimmer active";
        return "shimmer";
    }
</script>

<Bucket>
    <div slot="inside" class="flex-cw">
        {#each listed as course}
            <div on:click={() => active_courses.toggle(course)}>{course}</div>
        {/each}
    </div>
    <div
        slot="label"
        on:click={() => toggle_rows(spec, category)}
        class={active($active_bucket)}
    >
        {category}&nbsp;{listed.length}/{count}
    </div>
</Bucket>

<style>
    .active {
        box-shadow:
            /* left magenta, right cyan */
            inset 60px 0 120px #d4ebf2,
            inset -60px 0 120px #0ff;
    }
</style>
