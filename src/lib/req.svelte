<!-- Holds courses and # courses fulfilled for each requirement within the spec -->
<script>
    import { toggleCourse, toggleRows, activeReq } from "./state.js";
    import { courses } from "./fallback.js";
    import { trackTailwindColors } from "./icon.js";

    export let track, req, count, listed;
    $: console.log(track, req, count, listed);

    // Dynamic content
    $: isCompleted = listed?.length === count;
    $: reqCount = isCompleted ? "✓" : `(${listed?.length || 0}/${count})`;

    // Dynamic CSS
    $: isActive = $activeReq?.track === track && $activeReq?.req === req;
    $: borderColor = `border-${trackTailwindColors[track]}-500`;
    $: activeCSS = isActive ? `border-2 shadow-xl` : "";
    $: completedBg = isCompleted ? `bg-${trackTailwindColors[track]}-50` : "";
</script>

<button
    class="flex flex-col mr-2 text-sm unstyled-button"
    on:click={() => toggleRows(track, req)}
>
    <div
        class="flex items-center justify-center gap-2 cursor-pointer
    text-base text-shadow-lg pt-[--spacing-xs] pb-[--spacing-sm]"
    >
        {req}&nbsp;{reqCount}
    </div>
    <div
        data-active={isActive}
        class="course-container border {borderColor} hover:border-2 {activeCSS} {completedBg}"
    >
        {#each listed || [] as course}
            <button
                class="course-item hover:opacity-70 rounded-md unstyled-button"
                on:click|stopPropagation={() => toggleCourse(course)}
            >
                {courses[course]?.name || course}
            </button>
        {/each}
    </div>
</button>
