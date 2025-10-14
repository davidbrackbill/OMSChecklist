<!-- Holds courses and # courses fulfilled for each requirement within the spec -->
<script>
    import { stopPropagation } from "svelte/legacy";

    import { toggleCourse, toggleRows, activeReq } from "./state.js";
    import { courses } from "./data.js";
    import { trackTailwindColors } from "./icon.js";

    let { track, req, count, listed } = $props();

    // Dynamic content
    let isCompleted = $derived(listed?.length === count);
    let reqCount = $derived(
        isCompleted ? "✓" : `(${listed?.length || 0}/${count})`,
    );

    // Dynamic CSS
    let isActive = $derived(
        $activeReq?.track === track && $activeReq?.req === req,
    );
    let borderColor = $derived(`border-${trackTailwindColors[track]}-500`);
    let activeCSS = $derived(isActive ? `border-2 shadow-xl` : "");
    let completedBg = $derived(
        isCompleted ? `bg-${trackTailwindColors[track]}-50` : "",
    );
</script>

<button
    class="flex flex-col mr-2 text-sm unstyled-button"
    onclick={() => toggleRows(track, req)}
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
                onclick={stopPropagation(() => toggleCourse(course))}
            >
                {courses[course]?.name || course}
            </button>
        {/each}
    </div>
</button>
