<script>
    export let spec, category, count, listed, active_spec, toggle_rows;

    function _class(spec, category, active_spec) {
        let [s, c] = active_spec;
        if (s === spec && c === category) return "g-highlight";
        return "";
    }
</script>

<div class="column" on:click={() => toggle_rows(spec, category)}>
    <table class={_class(spec, category, active_spec)}>
        {#each listed as course}
            <tr>{course}</tr>
        {/each}
    </table>
    <div class="flex">
        <h3>{category}</h3>
        <p>{listed.length}/{count}</p>
    </div>
</div>

<style>
    .flex {
        display: flex;
    }

    .column {
        margin-left: 10px;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
    }

    .g-highlight {
        background-color: #e8f8ec;
    }

    table {
        width: 150px;
        height: 100px;
        border: 1px solid black;
        padding: 10px;
    }
</style>
