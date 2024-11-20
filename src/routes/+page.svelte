<script>
    import { specs, course_codes, sorted_courses } from "../lib/data.js";
    import Semesters from "$lib/Semesters.svelte";
    import BucketDivider from "$lib/BucketDivider.svelte";

    let sort_criteria = ["Reviews", "desc"];
    function sort(column) {
        let [c, s] = sort_criteria;
        if (c == column) {
            sort_criteria[1] = s === "desc" ? "asc" : "desc";
        } else {
            sort_criteria = [column, "desc"];
        }
    }

    let active_courses = new Set();
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

    let active_specs = new Set();
    function toggle_specs(item) {
        active_specs.has(item)
            ? active_specs.delete(item)
            : active_specs.add(item);
        active_specs = active_specs;
    }

    let active_table_rows = course_codes;
    let active_bucket = [null, null];
    function toggle_rows(spec, category) {
        let [s, c] = active_bucket;
        if (s === spec && c === category) {
            active_table_rows = course_codes;
            active_bucket = ["", ""];
        } else {
            active_bucket = [spec, category];
            active_table_rows = specs[spec][category]["courses"];
        }
    }

    function row_class(code, active_courses) {
        if (active_courses.has(code)) return "b-highlight";
        return "";
    }
</script>

<div class="flexw mb-20">
    <b class="mt-10">Specializations:</b>
    {#each Object.keys(specs) as name}
        <button on:click={() => toggle_specs(name)} class="m-5 mt-10"
            >{name}</button
        >
    {/each}
</div>
{#if active_specs.size == 0}
    <small>Pick one or multiple!</small>
{/if}

{#each active_specs as name}
    <BucketDivider {name} {toggle_rows} {active_courses} {active_bucket}>
        {#if active_specs.size == 1}
            <small
                >Click a specialization to find courses that satisfy it!</small
            >
        {/if}
    </BucketDivider>
{/each}

<Semesters {active_courses} />

<div class="flexcenter mb-10">
    <b class="m-5">Courses:</b>
    <p>{active_courses.size}</p>
    <button class="thickbutton" on:click={clear_courses}>Clear</button>
    {#each active_courses as Code}
        <button on:click={() => toggle_courses(Code)}>{Code}</button>
    {/each}
</div>

<table cellspacing="0" cellpadding="0">
    <tr class="bold">
        <td on:click={() => sort("Code")}>Code</td>
        <td on:click={() => sort("Course")}>Course</td>
        <td on:click={() => sort("Rating")}>Rating</td>
        <td on:click={() => sort("Difficulty")}>Difficulty</td>
        <td on:click={() => sort("Workload")}>Workload</td>
        <td on:click={() => sort("Reviews")}>Reviews</td>
    </tr>
    {#each sorted_courses[sort_criteria.join("_")] as { Course, Code, Rating, Difficulty, Workload, Reviews }}
        {#if active_table_rows.has(Code)}
            <tr
                on:click={() => toggle_courses(Code)}
                class={row_class(Code, active_courses)}
            >
                <td><button>{Code}</button></td>
                <td>{Course}</td>
                <td>{Rating}</td>
                <td>{Difficulty}</td>
                <td>{Workload}</td>
                <td>{Reviews}</td>
            </tr>
        {/if}
    {/each}
</table>

<style>
    .thickbutton {
        border-width: 2px;
        border-radius: 5px;
    }

    td {
        padding: 2px;
        min-width: 100px;
    }
</style>
