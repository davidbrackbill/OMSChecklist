<script>
    import { active_specs } from "../lib/state.js";
    import Sidebar from "$lib/sidebar.svelte";
    import Specs from "$lib/specs.svelte";
    import Semesters from "$lib/semesters.svelte";
    import Table from "$lib/table.svelte";
</script>

<div class="flex gap-8">
    <Sidebar />

    <div class="basis-1/3 grow">
        {#each $active_specs as name}
            <Specs {name} />
        {/each}

        <Semesters />
    </div>

    <Table />
</div>
