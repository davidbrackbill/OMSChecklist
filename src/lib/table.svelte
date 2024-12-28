<script>
    import { sorted_courses } from "../lib/data.js";
    import { active_courses, visible_rows } from "../lib/state.js";

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

<table class="content-start">
    <thead>
        <tr>
            <td on:click={() => toggle("Code")}>Code</td>
            <td on:click={() => toggle("Course")}>Course</td>
            <td on:click={() => toggle("Rating")}>Rating</td>
            <td on:click={() => toggle("Difficulty")}>Difficulty</td>
            <td on:click={() => toggle("Workload")}>Workload</td>
            <td on:click={() => toggle("Reviews")}>Reviews</td>
        </tr>
    </thead>
    {#each sorted_courses[`${cat}_${dir}`] as { Course, Code, Rating, Difficulty, Workload, Reviews }}
        {#if $visible_rows.has(Code)}
            <tr class={active(Code, $active_courses)}>
                <td on:click={() => active_courses.toggle(Code)}>{Code}</td>
                <td on:click={() => active_courses.toggle(Code)}>{Course}</td>
                <td on:click={() => active_courses.toggle(Code)}>{Rating}</td>
                <td on:click={() => active_courses.toggle(Code)}
                    >{Difficulty}</td
                >
                <td on:click={() => active_courses.toggle(Code)}>{Workload}</td>
                <td
                    ><a
                        class="text-gray-700 underline"
                        href={review_url(Course)}
                        target="_blank">{Reviews}</a
                    ></td
                >
            </tr>
        {/if}
    {/each}
</table>

<style>
    thead * {
        font-weight: bold;
    }

    /* Right-align the numbers */
    td:nth-last-child(-n + 4) {
        text-align: right;
    }

    thead > * > td:hover {
        mask: linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/350% 100%;
        animation: shimmer 1s infinite;
    }
    @keyframes shimmer {
        100% {
            mask-position: left;
        }
    }

    .b-highlight {
        background-color: hsl(194 54% 89%);
    }
</style>
