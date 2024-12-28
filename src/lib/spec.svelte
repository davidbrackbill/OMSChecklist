<script>
    export let spec, category, count, listed;
    import {
        toggle_rows,
        active_bucket,
    } from "../lib/state.js";

    function active(bucket) {
        if (bucket[spec] === category) return "category active";
        return "category";
    }
</script>

<button on:click={() => toggle_rows(spec, category)}>
    <div class="flex-cw bucket">
        {#each listed as course}
            <div>{course}</div>
        {/each}
    </div>
    <div class={active($active_bucket)}>
        <h3>{category}</h3>
        &nbsp;{listed.length}/{count}
    </div>
</button>

<style>
    button {
        background-color: transparent;
        border: none;
        margin-right: 10px;
    }
    h3 {
        justify-self: center;
        margin: 0.1em;
    }

    .center {
        align-items: center;
    }

    .category {
        margin-top: 0.3em;
        margin-bottom: 0.5em;
        padding: 0.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
    }
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
