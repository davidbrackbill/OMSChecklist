<script>
    import { specs } from "../lib/data.js";
    import { active_specs } from "../lib/state.js";
    const images = [
        "/ml.png",
        "/graphics.png",
        "/robotics.png",
        "/computing-systems.png",
        "/hci.png",
        "/interactive-intelligence.png",
        "/favicon.png",
    ];
</script>

<svelte:head>
    {#each images as image}
        <link rel="preload" href={image} as="image" type="image/png" />
    {/each}
</svelte:head>

<div>
    {#each Object.keys(specs) as name}
        <button on:click={() => active_specs.toggle(name)}>{name}</button>
    {/each}
</div>
