<script>
    import { active_sections } from "../lib/state.js";
    const images = {
        "Machine Learning": "/ml.png",
        "Computer Graphics": "/graphics.png",
        Robotics: "/robotics.png",
        "Computing Systems": "/computing-systems.png",
        "Human Computer Interaction": "/hci.png",
        "Interactive Intelligence": "/interactive-intelligence.png",
        Semesters: "/favicon.png",
    };
</script>

<svelte:head>
    {#each Object.values(images) as image}
        <link rel="preload" href={image} as="image" type="image/png" />
    {/each}
</svelte:head>

<div class="h-screen basis-20 shrink p-2 bg-gray-50 drop-shadow-md">
    {#each Object.entries(images) as [key, image]}
        <div class="py-4" on:click={() => active_sections.toggle(key)}>
            <img
                class="opacity-30 hover:opacity-60"
                style={$active_sections.has(key) ? "opacity:1" : ""}
                src={image}
                alt={image}
            />
        </div>
    {/each}
    <div class="flex justify-center">
    <button on:click={active_sections.clear}>Clear</button>
    </div>
</div>

