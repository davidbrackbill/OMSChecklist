<script>
    import { active_specs } from "../lib/state.js";
    const images = {
        "Machine Learning": "/ml.png",
        "Computer Graphics": "/graphics.png",
        Robotics: "/robotics.png",
        "Computing Systems": "/computing-systems.png",
        "Human Computer Interaction": "/hci.png",
        "Interactive Intelligence": "/interactive-intelligence.png",
        GT: "/favicon.png",
    };
</script>

<svelte:head>
    {#each Object.values(images) as image}
        <link rel="preload" href={image} as="image" type="image/png" />
    {/each}
</svelte:head>

<div class="h-screen bg-gray-100 drop-shadow p-2 w-20">
    {#each Object.entries(images) as [key, image]}
        <div class="py-4" on:click={() => active_specs.toggle(key)}>
            <img
                style={$active_specs.has(key) ? "opacity:1" : ""}
                src={image}
                alt={image}
            />
        </div>
    {/each}
    <button on:click={active_specs.clear}>Clear</button>
</div>

<style>
    img {
        max-width: 6vh;
        opacity: 0.3;
    }
    img:hover {
        opacity: 0.6;
    }
</style>
