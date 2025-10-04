<!-- Right-most table for selecting courses -->
<script>
    import { courses } from "./fallback.js";
    import {
        activeCourses,
        toggleCourse,
        activeRows,
        getFromStorage,
        setToStorage,
        activeReq,
        activeSections,
        clearCourses,
    } from "./state.js";
    import { specs } from "./data.js";
    import { trackTailwindColors } from "./icon.js";
    const arrow = "/arrow.svg";

    // NAMES

    const columns = [
        "name",
        "id",
        "rating",
        "difficulty",
        "workload",
        "numReviews",
    ];

    // Display names for columns
    const columnLabels = {
        name: "Course",
        id: "Code",
        rating: "Rating",
        difficulty: "Difficulty",
        workload: "Workload",
        numReviews: "Reviews",
    };

    const rightAlignedColumns = new Set([
        "rating",
        "difficulty",
        "workload",
        "numReviews",
    ]);

    // Columns that should default to ascending sort
    const ascendingDefaultColumns = new Set([
        "workload",
        "id", // course code
        "name",
        "difficulty",
    ]);

    // SORTING

    const initialSort = getFromStorage("tableSort", {
        column: "numReviews",
        direction: "desc",
    });
    let sortColumn = $state(initialSort.column);
    let sortDirection = $state(initialSort.direction);

    function toggleSort(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortColumn = column;
            sortDirection = ascendingDefaultColumns.has(column) ? "asc" : "desc";
        }
        setToStorage("tableSort", {
            column: sortColumn,
            direction: sortDirection,
        });
    }

    // SEARCH

    let searchQuery = $state("");

    let filteredCourses = $derived(
        Object.values(courses).filter((course) => {
            if (!searchQuery.trim()) return true;

            const query = searchQuery.toLowerCase();
            return (
                course.name.toLowerCase().includes(query) ||
                course.id.toLowerCase().includes(query)
            );
        })
    );

    let sortedCourses = $derived([...filteredCourses].sort((A, B) => {
        const a = A[sortColumn];
        const b = B[sortColumn];

        const comparison = typeof a === "string" ? a.localeCompare(b) : a - b;

        return sortDirection === "asc" ? comparison : -comparison;
    }));

    // Check if there are any visible courses after filtering
    let hasVisibleCourses = $derived(
        sortedCourses.some((course) => $activeRows.has(course.id))
    );

    // CSS

    let activeColor = $derived(`bg-${trackTailwindColors[$activeReq.track] || "gray"}-100`);

    // Mobile column selection
    let showColumnMenu = $state(false);
    let visibleColumns = $state(new Set(["name", "id"])); // Default columns for mobile

    function toggleColumn(column) {
        if (visibleColumns.has(column)) {
            visibleColumns.delete(column);
        } else {
            visibleColumns.add(column);
        }
        visibleColumns = visibleColumns; // Trigger reactivity
    }

    // No more JS column hiding - using CSS instead

    function clearFilter() {
        activeReq.set({});
    }

    // URLS

    function reviewURL(course_name) {
        return `https://www.omscentral.com/courses/${kebabCase(course_name)}/reviews`;
    }
    function kebabCase(str) {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    }

    function exportData() {
        // Get current state
        const activeSpecializations = Array.from($activeSections).filter(
            (s) => s !== "Semesters",
        );
        const selectedCourses = Array.from($activeCourses);

        // Organize courses by specializations and buckets
        const specializationPlans = {};

        activeSpecializations.forEach((specName) => {
            const specData = specs[specName];
            if (!specData) return;

            const buckets = Object.keys(specData);
            const bucketSets = buckets.map(
                (category) => new Set(specData[category]["courses"]),
            );

            // Divide courses into buckets (similar logic to spec.svelte)
            const bucketCourses = buckets.map(() => []);
            const electiveIndex = buckets.findIndex(
                (key) => key === "Electives",
            );

            for (const courseCode of selectedCourses) {
                let assignedToCategory = false;

                // First, try to assign to specific categories (non-electives)
                for (let i = 0; i < buckets.length; i++) {
                    const category = buckets[i];
                    if (category === "Electives") continue;

                    const isInCategory = bucketSets[i].has(courseCode);
                    const hasSpace =
                        bucketCourses[i].length < specData[category].count;

                    if (isInCategory && hasSpace) {
                        bucketCourses[i].push(courseCode);
                        assignedToCategory = true;
                        break;
                    }
                }

                // If not assigned to any specific category, add to electives
                if (!assignedToCategory && electiveIndex !== -1) {
                    bucketCourses[electiveIndex].push(courseCode);
                }
            }

            // Build the specialization plan
            specializationPlans[specName] = {};
            buckets.forEach((category, i) => {
                specializationPlans[specName][category] = {
                    required: specData[category].count,
                    selected: bucketCourses[i].length,
                    courses: bucketCourses[i].map((code) => courses[code].name),
                };
            });
        });

        // Get semester planning data
        let semesterPlan = {};
        try {
            const storedPinned = localStorage.getItem("pinnedSemesters");
            const pinnedSemesters = storedPinned
                ? JSON.parse(storedPinned)
                : {};

            // Calculate semester statistics
            Object.entries(pinnedSemesters).forEach(
                ([semesterIndex, courseCodes]) => {
                    if (courseCodes.length > 0) {
                        const semesterCourses = courseCodes
                            .map((code) => courses[code])
                            .filter(Boolean);
                        const avgDifficulty =
                            semesterCourses.reduce(
                                (sum, course) => sum + course.difficulty,
                                0,
                            ) / semesterCourses.length;
                        const totalWorkload = semesterCourses.reduce(
                            (sum, course) => sum + course.workload,
                            0,
                        );

                        semesterPlan[
                            `Semester ${parseInt(semesterIndex) + 1}`
                        ] = {
                            courses: semesterCourses.map(
                                (course) => course.name,
                            ),
                            courseCount: semesterCourses.length,
                            averageDifficulty:
                                Math.round(avgDifficulty * 10) / 10,
                            totalWorkload: Math.round(totalWorkload * 10) / 10,
                        };
                    }
                },
            );
        } catch (e) {
            console.warn("Failed to load semester data:", e);
        }

        // Build export data - flatten specialization plans to top level
        const exportDataObj = {
            ...specializationPlans,
            semesterPlan: semesterPlan,
        };

        // Create formatted JSON
        const jsonString = JSON.stringify(exportDataObj, null, 2);

        // Open in new tab
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");

        // Clean up the URL after a short delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
</script>

<svelte:head>
    <link rel="preload" href={arrow} as="image" type="image/svg+xml" />
</svelte:head>

<div class="h-full flex flex-col">
    <!-- Desktop: Column selector and action buttons -->
    <div
        class="mb-3 px-4 flex justify-between items-center flex-shrink-0 hidden lg:flex"
    >
        <div class="flex items-center gap-3">

            <button
                class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium {activeColor} border border-gray-300 hover:bg-opacity-80 transition-colors"
                class:invisible={!$activeReq.track}
                onclick={clearFilter}
                title="Clear filter"
            >
                {$activeReq.track}: {$activeReq.req}
                <span class="text-gray-500 hover:text-gray-700">✕</span>
            </button>
        </div>

        <div class="flex gap-2">
            <button
                class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors"
                onclick={exportData}
                title="Export currently shown tabs as JSON"
            >
                📄 Export as JSON
            </button>

            <button
                class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 border border-gray-300 hover:bg-red-100 transition-colors"
                onclick={clearCourses}
                title="Clear course selections"
            >
                Clear Courses
                <span class="text-gray-500 hover:text-gray-700">✕</span>
            </button>
        </div>

        {#if showColumnMenu}
            <!-- Modal overlay -->
            <div
                class="fixed inset-0 bg-black/50 z-30"
                onclick={() => (showColumnMenu = false)}
            ></div>

            <!-- Modal content -->
            <div
                class="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-300 z-40 p-4"
            >
                <div class="text-center mb-4">
                    <h3 class="font-medium text-gray-900 mb-1">
                        Select Columns
                    </h3>
                    <p class="text-xs text-gray-600">Click to toggle columns</p>
                </div>

                <div class="grid grid-cols-3 gap-2 mb-4">
                    {#each columns as column}
                        <button
                            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors border {visibleColumns.has(
                                column,
                            )
                                ? 'bg-gray-100 border-gray-300 text-gray-900'
                                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}"
                            onclick={() => toggleColumn(column)}
                        >
                            {columnLabels[column]}
                        </button>
                    {/each}
                </div>

                <button
                    class="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 py-2 rounded-lg text-sm font-medium transition-colors"
                    onclick={() => (showColumnMenu = false)}
                >
                    Done
                </button>
            </div>
        {/if}
    </div>

    <!-- Desktop: Search bar -->
    <div class="mb-3 px-4 flex-shrink-0 hidden lg:block">
        <div class="relative">
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search courses by name or code"
                class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
            {#if searchQuery}
                <button
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onclick={() => (searchQuery = "")}
                    title="Clear search"
                >
                    ✕
                </button>
            {/if}
        </div>
    </div>

    <!-- Mobile: Column selector and action buttons -->
    <div class="lg:hidden px-4 mb-2 flex justify-between items-center gap-2">
        <div class="flex items-center gap-2">
            <button
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors"
                onclick={() => (showColumnMenu = !showColumnMenu)}
            >
                <span class="text-xs">☰</span>
                {visibleColumns.size}
            </button>

            <button
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium {activeColor} border border-gray-300 hover:bg-opacity-80 transition-colors"
                class:invisible={!$activeReq.track}
                onclick={clearFilter}
                title="Clear filter"
            >
                {$activeReq.track}: {$activeReq.req}
                <span class="text-gray-500 hover:text-gray-700">✕</span>
            </button>
        </div>

        <div class="flex gap-1">
            <button
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 border border-gray-300 hover:bg-red-100 transition-colors"
                onclick={clearCourses}
                title="Clear course selections"
            >
                Clear
                <span class="text-gray-500 hover:text-gray-700">✕</span>
            </button>
        </div>

        {#if showColumnMenu}
            <!-- Modal overlay -->
            <div
                class="fixed inset-0 bg-black/50 z-30"
                onclick={() => (showColumnMenu = false)}
            ></div>

            <!-- Modal content -->
            <div
                class="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-300 z-40 p-4"
            >
                <div class="text-center mb-4">
                    <h3 class="font-medium text-gray-900 mb-1">
                        Select Columns
                    </h3>
                    <p class="text-xs text-gray-600">Tap to toggle columns</p>
                </div>

                <div class="grid grid-cols-2 gap-2 mb-4">
                    {#each columns as column}
                        <button
                            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors border {visibleColumns.has(
                                column,
                            )
                                ? 'bg-gray-100 border-gray-300 text-gray-900'
                                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}"
                            onclick={() => toggleColumn(column)}
                        >
                            {columnLabels[column]}
                        </button>
                    {/each}
                </div>

                <button
                    class="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 py-2 rounded-lg text-sm font-medium transition-colors"
                    onclick={() => (showColumnMenu = false)}
                >
                    Done
                </button>
            </div>
        {/if}
    </div>

    <!-- Mobile: Search bar -->
    <div class="lg:hidden px-4 mb-2 flex-shrink-0">
        <div class="relative">
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search courses by name or code"
                class="w-full px-3 py-2 pl-9 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <svg
                class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
            {#if searchQuery}
                <button
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-sm"
                    onclick={() => (searchQuery = "")}
                    title="Clear search"
                >
                    ✕
                </button>
            {/if}
        </div>
    </div>

    <div class="block px-4 flex-1 min-h-0 overflow-y-auto">
        <table class="w-full rounded-lg shadow">
            <thead class="sticky top-0">
                <tr>
                    {#each columns as column}
                        <th
                            class="{activeColor}
                          first:rounded-tl-lg last:rounded-tr-lg
                          first:border-l-black last:border-r-black
                          font-medium text-sm
                          p-[var(--spacing-sm)] cursor-pointer
                          whitespace-nowrap overflow-hidden text-ellipsis w-auto
                          relative
                          border border-x-gray-400 border-y-black"
                            class:text-right={rightAlignedColumns.has(column)}
                            onclick={() => toggleSort(column)}
                        >
                            <div class="flex {rightAlignedColumns.has(column) ? 'justify-end' : 'justify-start'} items-center">
                                {#if !rightAlignedColumns.has(column)}
                                    {columnLabels[column]}
                                {/if}

                                <img
                                    class="sort-arrow {sortColumn === column ? sortDirection : (ascendingDefaultColumns.has(column) ? 'asc' : 'desc')}"
                                    data-active={sortColumn === column}
                                    src={arrow}
                                    alt="Sort direction"
                                />

                                {#if rightAlignedColumns.has(column)}
                                    {columnLabels[column]}
                                {/if}
                            </div>
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody class="table-body">
                {#if !hasVisibleCourses}
                    <tr>
                        <td colspan={columns.length} class="text-center py-8 text-gray-500 border-b border-gray-200">
                            No results found
                        </td>
                    </tr>
                {:else}
                    {#each sortedCourses as course}
                        {#if $activeRows.has(course.id)}
                            <tr
                                class="data-[active=true]:font-semibold > first:td"
                                data-active={$activeCourses.has(course.id)}
                            >
                                {#each columns.slice(0, -1) as column, i}
                                    <td
                                        class="table-cell"
                                        class:text-right={rightAlignedColumns.has(
                                            column,
                                        )}
                                        onclick={() => toggleCourse(course.id)}
                                        title={typeof course[column] === "number"
                                            ? course[column].toFixed(1)
                                            : course[column]}
                                    >
                                        {typeof course[column] === "number"
                                            ? course[column].toFixed(1)
                                            : course[column] ?? "-"}
                                    </td>
                                {/each}
                                <td class="table-cell text-right" title={course.numReviews}>
                                    <a
                                        class="review-link"
                                        href={reviewURL(course.name)}
                                        target="_blank">{course.numReviews}</a
                                    >
                                </td>
                            </tr>
                        {/if}
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style>
    thead {
        position: sticky;
        top: 0;
        z-index: 5;
    }

    table {
        border-collapse: separate;
        border-spacing: 0;
        table-layout: auto;
        width: 100%;
    }

    /* Flexible column sizing - no horizontal scrollbar */
    th:nth-child(1) {
        /* name */
        width: 40%;
        max-width: 300px;
        min-width: 120px;
    }
    th:nth-child(2) {
        /* id */
        width: 12%;
        max-width: 80px;
        min-width: 60px;
    }
    th:nth-child(3) {
        /* rating */
        width: 12%;
        max-width: 70px;
        min-width: 50px;
    }
    th:nth-child(4) {
        /* difficulty */
        width: 12%;
        max-width: 80px;
        min-width: 60px;
    }
    th:nth-child(5) {
        /* workload */
        width: 12%;
        max-width: 80px;
        min-width: 60px;
    }
    th:nth-child(6) {
        /* numReviews */
        width: 12%;
        max-width: 70px;
        min-width: 50px;
    }

    /* Responsive column hiding with CSS - hide in order: workload, difficulty,
     * rating, reviews */
    @media (max-width: 900px) {
        th:nth-child(5), /* workload */
        td:nth-child(5) {
            display: none;
        }
    }

    @media (max-width: 750px) {
        th:nth-child(4), /* difficulty */
        td:nth-child(4) {
            display: none;
        }
    }

    @media (max-width: 600px) {
        th:nth-child(3), /* rating */
        td:nth-child(3) {
            display: none;
        }
    }

    @media (max-width: 450px) {
        th:nth-child(6), /* numReviews */
        td:nth-child(6) {
            display: none;
        }
    }

    .text-right {
        justify-content: flex-end;
    }

    .sort-arrow {
        width: 0.75rem;
        transition: opacity 0.2s ease;
        opacity: 0;
    }

    .sort-arrow.desc {
        transform: scaleY(-1);
    }

    /* Show arrow when active */
    .sort-arrow[data-active="true"] {
        opacity: 1;
    }

    /* Show preview arrow on hover */
    th:hover .sort-arrow[data-active="false"] {
        opacity: 0.5;
    }

    .table-body {
        font-size: 0.875rem;
    }

    .table-cell {
        padding: var(--spacing-xs) var(--spacing-sm);
        vertical-align: top;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        border-right: 1px solid #e5e7eb;
        border-bottom: 1px solid #f3f4f6;
        position: relative;
        max-width: 0; /* Forces ellipsis truncation */
    }

    .table-cell:last-child {
        border-right: none;
    }

    .review-link {
        color: rgb(55 65 81);
        text-decoration: underline;
    }

    .column-resize-handle {
        position: absolute;
        top: 0;
        right: -4px;
        width: 8px;
        height: 100%;
        background-color: transparent;
        cursor: col-resize;
        z-index: 10;
    }

    /* Mobile-friendly resize handles */
    @media (max-width: 1023px) {
        .column-resize-handle {
            width: 16px;
            right: -8px;
        }

        .column-resize-handle:hover,
        .column-resize-handle:active {
            background-color: rgba(0, 0, 0, 0.05);
        }
    }

    /* Round bottom corners on last row */
    tbody tr:last-child td:first-child {
        border-bottom-left-radius: 0.5rem;
    }

    tbody tr:last-child td:last-child {
        border-bottom-right-radius: 0.5rem;
    }
</style>
