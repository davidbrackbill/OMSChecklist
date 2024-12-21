<script>
    import { sorted_courses } from "../lib/data.js";
    export let active_courses, active_table_rows;

    const clear_courses = () => {
        active_courses.clear();
        active_courses = active_courses;
    };
    function toggle_courses(item) {
        active_courses.has(item)
            ? active_courses.delete(item)
            : active_courses.add(item);
        active_courses = active_courses;
    }

    let sort_criteria = ["Reviews", "desc"];
    function sort(column) {
        let [c, s] = sort_criteria;
        if (c == column) {
            sort_criteria[1] = s === "desc" ? "asc" : "desc";
        } else {
            sort_criteria = [column, "desc"];
        }
    }
    function row_class(code, active_courses) {
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

<div class="flex wrap">
    <div class="sidebar-basis">
        <button on:click={clear_courses}>Clear Courses</button>: {active_courses.size}
    </div>
    <div class="flex button-gap wrap">
        {#each active_courses as Code}
            <button on:click={() => toggle_courses(Code)}>{Code}</button>
        {/each}
    </div>
</div>

<table cellspacing="0" cellpadding="0">
    <thead>
        <tr>
            <td on:click={() => sort("Code")}>Code</td>
            <td on:click={() => sort("Course")}>Course</td>
            <td on:click={() => sort("Rating")}>Rating</td>
            <td on:click={() => sort("Difficulty")}>Difficulty&#128548</td>
            <td on:click={() => sort("Workload")}>Workload&#9203</td>
            <td on:click={() => sort("Reviews")}>Reviews</td>
        </tr>
    </thead>
    {#each sorted_courses[sort_criteria.join("_")] as { Course, Code, Rating, Difficulty, Workload, Reviews }}
        {#if active_table_rows.has(Code)}
            <tr class={row_class(Code, active_courses)}>
                <td on:click={() => toggle_courses(Code)}
                    ><button>{Code}</button></td
                >
                <td on:click={() => toggle_courses(Code)}>{Course}</td>
                <td>{Rating}</td>
                <td>{Difficulty}</td>
                <td>{Workload}</td>
                <td
                    ><a href={review_url(Course)} target="_blank">{Reviews}</a
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

    thead > * > td:hover {
        mask: linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/350% 100%;
        animation: shimmer 1s infinite;
        /* background: linear-gradient(#d4ebf2, #0ff); */
    }
    @keyframes shimmer {
        100% {
            mask-position: left;
        }
    }
    .thickbutton {
        border-width: 2px;
        border-radius: 5px;
    }

    td {
        padding: 2px;
        min-width: 100px;
    }

    .b-highlight {
        background-color: #d4ebf2;
    }
</style>
