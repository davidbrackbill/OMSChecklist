<script>
    export let spec, category, count, listed, active_spec, toggle_rows;

    function active(active_spec) {
        let [s, c] = active_spec;
        if (s === spec && c === category) return "category active";
        return "category";
    }
</script>

<div class="column" on:click={() => toggle_rows(spec, category)}>
    <div class="table">
        {#each listed as course}
            <tr>{course}</tr>
        {/each}
    </div>
    <div class={active(active_spec)}>
        <h3>{category}</h3>
        <p>&nbsp;{listed.length}/{count}</p>
    </div>
</div>

<style>
    .column {
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
    }

    .category {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        margin-top: 4px;
        height: 40px;
    }

    .active {
        box-shadow:
            /* left magenta, right cyan */
            inset 60px 0 120px #d4ebf2,
            inset -60px 0 120px #0ff;
    }

    .table {
        width: 125px;
        height: 75px;
        border: 1px solid black;
        padding: 10px;
        border-radius: 4px;
    }

    tr:first-of-type {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    tr:last-of-type {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
</style>
