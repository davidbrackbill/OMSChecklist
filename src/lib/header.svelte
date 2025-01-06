<script>
    export let column, toggle, dir;
    const arrow = "/arrow.svg";
    const alignments = {
        Code: "left",
        Course: "left",
        Rating: "right",
        Difficulty: "right",
        Workload: "right",
        Reviews: "right",
    };
    let align = alignments[column];
</script>

<svelte:head>
    <link rel="preload" href={arrow} as="image" type="image/svg" />
</svelte:head>

<th
    class="text-gray-600 font-normal text-sm pr-2"
    on:click={() => toggle(column)}
>
    <div class={`flex grow ${align === "right" ? "justify-end" : ""}`}>
        {#if dir}
            <img
                class="w-3"
                style={`transform: scaleY(${dir === "desc" ? "-1" : "1"});`}
                src={arrow}
                alt={arrow}
            />
        {/if}
        <div>
            {column}
        </div>
    </div>
</th>

<style>
    th:hover {
        mask: linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/350% 100%;
        animation: shimmer 1s infinite;
    }
    @keyframes shimmer {
        100% {
            mask-position: left;
        }
    }
</style>
