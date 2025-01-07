<script>
    import { sorted_courses } from "../lib/data.js";
    import { active_courses, visible_rows } from "../lib/state.js";
    const arrow = "/arrow.svg";

    const columns = [
        "Code",
        "Course",
        "Rating",
        "Difficulty",
        "Workload",
        "Reviews",
    ];
    const alignments = {
        Code: "left",
        Course: "left",
        Rating: "right",
        Difficulty: "right",
        Workload: "right",
        Reviews: "right",
    };

    let cat = "Reviews";
    let dir = "desc";
    function toggle(column) {
        if (cat == column) dir = dir === "desc" ? "asc" : "desc";
        else dir = "desc";
        cat = column;
    }
    function active(code, active_courses) {
        if (active_courses.has(code)) return "active";
        return "";
    }

    function review_url(course_name) {
        return `https://www.omscentral.com/courses/${kebab_case(course_name)}/reviews`;
    }
    function kebab_case(str) {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    }
</script>

<svelte:head>
    <link rel="preload" href={arrow} as="image" type="image/svg" />
</svelte:head>

<div class="max-h-screen basis-1/2 shrink overflow-y-scroll justify-self-end">
    <table class="self-baseline shrink justify-self-end rounded-lg shadow">
        <thead class="bg-gray-100">
            <tr>
                {#each columns as column}
                    <th
                        class="text-gray-600 font-normal text-sm pr-2"
                        on:click={() => toggle(column)}
                    >
                        <div
                            class={`flex grow ${alignments[column] === "right" ? "justify-end" : ""}`}
                        >
                            {#if cat === column}
                                <img
                                    class="w-3"
                                    style={`transform: scaleY(${dir === "desc" ? "-1" : "1"});`}
                                    src={arrow}
                                    alt={arrow}
                                />
                            {/if}
                            {column}
                        </div>
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each sorted_courses[`${cat}_${dir}`] as course}
                {#if $visible_rows.has(course.Code)}
                    <tr class={active(course.Code, $active_courses)}>
                        {#each columns.slice(0, -1) as column}
                            <td
                                on:click={() =>
                                    active_courses.toggle(course.Code)}
                                >{course[column]}</td
                            >
                        {/each}
                        <td
                            ><a
                                class="text-gray-700 underline"
                                href={review_url(course.Course)}
                                target="_blank">{course.Reviews}</a
                            ></td
                        >
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>
</div>

<style>
    table {
        border-collapse: separate;
        border-spacing: 0;
    }

    td,
    th {
        padding: 0 0.5rem;
        max-width: 20rem;
        vertical-align: top;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* Right-align the numbers */
    td:nth-last-child(-n + 4) {
        text-align: right;
    }

    tbody > tr:not(.active):hover {
        background-color: hsl(46 50% 95%);
    }

    .active > td {
        background-color: hsl(46 60% 93%);
    }

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
