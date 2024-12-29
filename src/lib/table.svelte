<script>
    import { sorted_courses } from "../lib/data.js";
    import { active_courses, visible_rows } from "../lib/state.js";

    const columns = [
        "Code",
        "Course",
        "Rating",
        "Difficulty",
        "Workload",
        "Reviews",
    ];

    let cat = "Reviews";
    let dir = "desc";
    function toggle(column) {
        if (cat == column) dir = dir === "desc" ? "asc" : "desc";
        else dir = "desc";
        cat = column;
    }
    function active(code, active_courses) {
        if (active_courses.has(code)) return "b-highlight";
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

<table
    class="basis-1/2 shrink justify-self-end max-h-screen overflow-y-auto rounded-lg border-2 border-gray-300"
>
    <thead>
        <tr class="bg-gray-100">
            {#each columns as column}
                <th
                    align="left"
                    class="text-gray-600 font-normal"
                    on:click={() => toggle(column)}>{column}</th
                >
            {/each}
        </tr>
    </thead>
    {#each sorted_courses[`${cat}_${dir}`] as course}
        {#if $visible_rows.has(course.Code)}
            <tr class={active(course.Code, $active_courses)}>
                {#each columns.slice(0, -1) as column}
                    <td on:click={() => active_courses.toggle(course.Code)}
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
</table>

<style>
    table {
        border-collapse: separate;
        border-spacing: 0;
    }

    td,
    th {
        border-bottom: solid #e5e7eb 2px;
    }

    /* Right-align the numbers */
    td:nth-last-child(-n + 4) {
        text-align: right;
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

    .b-highlight {
        background-color: hsl(194 54% 95%);
    }
</style>
