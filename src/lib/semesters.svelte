<script>
    import { run } from "svelte/legacy";

    import Semester from "./semester.svelte";
    import SectionContainer from "./section-container.svelte";
    import { activeCourses, getFromStorage, setToStorage } from "./state.js";
    import { dndzone } from "svelte-dnd-action";

    const maxSemesters = 20;

    let pinned = $state(getFromStorage("pinnedSemesters", {}));

    function updateSemesters(activeCourses, pinnedData) {
        if (!activeCourses.size) {
            return [[]];
        }
        let res = new Array(maxSemesters).fill().map((_) => []);
        let seen = new Set();

        for (const [semester, courses] of Object.entries(pinnedData || {})) {
            for (const [i, course] of courses.entries()) {
                if (activeCourses.has(course)) {
                    res[semester].push(course);
                    seen.add(course);
                } else if (courses.length > 1) {
                    courses.splice(i, 1);
                } else {
                    delete pinned[semester];
                }
            }
        }

        let i = 0;
        function add(course) {
            // First check if there's an empty pinned bucket we can use
            const emptyPinnedIndex = Object.keys(pinned).find(
                (idx) => pinned[idx].length === 0,
            );
            if (emptyPinnedIndex !== undefined) {
                pinned[emptyPinnedIndex].push(course);
                res[emptyPinnedIndex].push(course);
                return;
            }

            // Otherwise find next available slot
            if (i in pinned || res[i].length) {
                i++;
                add(course);
            } else res[i++] = [course];
        }
        activeCourses.difference(seen).forEach(add);

        return res;
    }

    function dndClick() {
        // Check if there's already an empty bucket
        const hasEmptyBucket = Object.values(pinned).some(
            (bucket) => bucket.length === 0,
        );
        if (hasEmptyBucket) return;

        const nextIndex =
            Math.max(...Object.keys(pinned).map(Number), active.length - 1) + 1;
        pinned[nextIndex] = [];
        pinned = pinned;
    }

    // Handle drag and drop for the + button
    const dndConsider = (_) => {};

    const dndFinalize = (e) => {
        const items = e.detail.items;
        if (items.length > 0) {
            const nextIndex =
                Math.max(
                    ...Object.keys(pinned).map(Number),
                    active.length - 1,
                ) + 1;
            pinned[nextIndex] = items.map((o) => o.code);
            pinned = pinned;
        }
    };
    // Save to localStorage whenever pinned changes
    run(() => {
        if (typeof window !== "undefined") {
            setToStorage("pinnedSemesters", pinned);
        }
    });
    let semesters = $derived(updateSemesters($activeCourses, pinned));
    let active = $derived(semesters.filter((a) => a.length));
</script>

<SectionContainer name="Semesters">
    {#each semesters as codes, index}
        {#if codes.length > 0}
            <Semester bind:pinned {codes} {index} />
        {/if}
    {/each}
    {#each Object.keys(pinned) as pinnedIndex}
        {#if pinned[pinnedIndex].length === 0}
            <Semester bind:pinned codes={[]} index={parseInt(pinnedIndex)} />
        {/if}
    {/each}
    {#if !active.length && !Object.keys(pinned).length}
        <Semester bind:pinned codes={[]} index={0} />
    {/if}
    <div
        class="group flex items-center justify-center bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded transition-colors cursor-pointer mt-2 w-[--bucket-width] min-w-[--bucket-width] h-[--bucket-height] min-h-[--bucket-height] mr-[--spacing-md]"
        use:dndzone={{
            items: [],
            flipDurationMs: 100,
            dropTargetStyle: { "box-shadow": "var(--shadow-drop-target)" },
        }}
        onconsider={dndConsider}
        onfinalize={dndFinalize}
        onclick={dndClick}
        title="Add new semester bucket or drag courses here"
    >
        <span
            class="text-2xl text-gray-500 group-hover:text-gray-600 transition-colors"
            >+</span
        >
    </div>
</SectionContainer>
