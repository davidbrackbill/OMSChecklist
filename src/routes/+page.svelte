<script>
    import { specs } from "../lib/data.js";
    import { active_specs } from "../lib/state.js";
    import Specs from "$lib/specs.svelte";
    import Semesters from "$lib/semesters.svelte";
    import Table from "$lib/table.svelte";
</script>

<div class="specs">
    <div class="sidebar-basis">
        <button on:click={active_specs.clear}>Clear Specializations</button>
        : {$active_specs.size}
    </div>
    <div class="flex button-gap wrap">
        {#each Object.keys(specs) as name}
            <button on:click={() => active_specs.toggle(name)}>{name}</button>
        {/each}
    </div>
</div>
{#if $active_specs.size == 0}
    <small>Pick one or multiple!</small>
{/if}

{#each $active_specs as name}
    <Specs {name} />
{/each}

<Semesters />

<Table />

<style>
    .specs {
        display: flex;
        margin-bottom: 0.5em;
    }
</style>
