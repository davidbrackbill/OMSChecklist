<script>
    import { active_courses } from "../lib/state.js";
    import { toggle_rows, active_bucket } from "../lib/state.js";

    export let spec, category, count, listed;

    function active(bucket) {
        if (bucket[spec] === category) return "category active";
        return "category";
    }
</script>

<div class="mr-4">
    <div class="flex-cw bucket shadow-md">
        {#each listed as course}
            <div on:click={() => active_courses.toggle(course)}>{course}</div>
        {/each}
    </div>
    <div
        on:click={() => toggle_rows(spec, category)}
        class={active($active_bucket)}
    >
        <h3>{category}</h3>
        &nbsp;{listed.length}/{count}
    </div>
</div>

<style>
    .active {
        box-shadow:
            /* left magenta, right cyan */
            inset 60px 0 120px #d4ebf2,
            inset -60px 0 120px #0ff;
    }
    .category:hover {
        mask: linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/350% 100%;
        animation: shimmer 1s infinite;
        /* background: linear-gradient(#d4ebf2, #0ff); */
    }
    @keyframes shimmer {
        100% {
            mask-position: left;
        }
    }
</style>
