<script>
    export let spec, category, count, listed, active_bucket, toggle_rows;

    function active([s, c]) {
        if (s === spec && c === category) return "category active";
        return "category";
    }
</script>

<button class="flex-c center" on:click={() => toggle_rows(spec, category)}>
    <div class="flex-cw bucket">
        {#each listed as course}
            <div class="overflow">{course}</div>
        {/each}
    </div>
    <div class={active(active_bucket)}>
        <h3>{category}</h3>
        <p>&nbsp;{listed.length}/{count}</p>
    </div>
</button>

<style>
    button {
        background-color: transparent;
        border: none;
    }

    .center {
        align-items: center;
    }

    .category {
        display: flex;
        align-items: center;
        align-content: start;
        border-radius: 8px;
    }
    .active {
        box-shadow:
            /* left magenta, right cyan */
            inset 60px 0 120px #d4ebf2,
            inset -60px 0 120px #0ff;
    }
</style>
