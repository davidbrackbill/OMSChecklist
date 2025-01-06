<script>
    import { sorted_courses } from "../lib/data.js";
    import { active_courses, visible_rows } from "../lib/state.js";
    import Header from "$lib/header.svelte";

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

<table
    class="basis-1/2 shrink grow self-baseline justify-self-end max-h-screen overflow-y-scroll no-sb rounded-lg shadow"
>
    <thead class="bg-gray-100">
        <tr>
            {#each columns as column}
                <Header {column} {toggle} dir={cat === column ? dir : false} />
            {/each}
        </tr>
    </thead>
    <tbody>
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
    </tbody>
</table>

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
</style>
