<script>
    import { active_sections } from "../lib/state.js";
    import Sidebar from "$lib/sidebar.svelte";
    import Specs from "$lib/specs.svelte";
    import Semesters from "$lib/semesters.svelte";
    import Table from "$lib/table.svelte";
</script>

<div class="flex gap-8">
    <Sidebar />

    <div class="basis-1/3 grow">
        {#each $active_sections as name}
            {#if name === "Semesters"}
                <Semesters />
            {:else}
                <Specs {name} />
            {/if}
        {/each}
    </div>

    <Table />
</div>
