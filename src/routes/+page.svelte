<script>
    import { specs, course_codes } from "../lib/data.js";
    import Specs from "$lib/specs.svelte";
    import Semesters from "$lib/semesters.svelte";
    import Table from "$lib/table.svelte";

    let active_courses = new Set();

    let active_specs = new Set(["Computing Systems"]);
    function toggle_specs(item) {
        active_specs.has(item)
            ? active_specs.delete(item)
            : active_specs.add(item);
        active_specs = active_specs;
    }

    let active_table_rows = course_codes;
    let active_bucket = [null, null];
    function toggle_rows(spec, category) {
        let [s, c] = active_bucket;
        if (s === spec && c === category) {
            active_table_rows = course_codes;
            active_bucket = ["", ""];
        } else {
            active_bucket = [spec, category];
            active_table_rows = specs[spec][category]["courses"];
        }
    }

    function clear_specs() {
        active_specs = new Set();
        active_bucket = [null, null];
        active_table_rows = course_codes;
    }
</script>

<div class="specs">
    <div class="sidebar-basis">
        <button on:click={clear_specs}
            >Clear Specializations</button
        >: {active_specs.size}
    </div>
    <div class="flex button-gap wrap">
        {#each Object.keys(specs) as name}
            <button on:click={() => toggle_specs(name)}>{name}</button>
        {/each}
    </div>
</div>
{#if active_specs.size == 0}
    <small>Pick one or multiple!</small>
{/if}

{#each active_specs as name, i}
    <Specs {name} {toggle_rows} {active_courses} {active_bucket} {i} />
{/each}

<Semesters {active_courses} />

<Table bind:active_courses {active_table_rows} />

<style>
    .specs {
        display: flex;
        margin-bottom: 0.5em;
    }
</style>
