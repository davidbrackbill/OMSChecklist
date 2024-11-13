<script>
    import {
        courses,
        specs,
        course_codes,
        sorted_courses,
    } from "../lib/data.js";
    import BucketDivider from "../lib/BucketDivider.svelte";

    let sort_criteria = ["Reviews", "desc"];
    function sort(column) {
        let [c, s] = sort_criteria;
        if (c == column) {
            sort_criteria[1] = s === "desc" ? "asc" : "desc";
        } else {
            sort_criteria = [column, "desc"];
        }
        console.log(column, "!");
        console.log(sort_criteria.join("_"));
        console.log(sorted_courses[sort_criteria.join("_")]);
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
    $: average_difficulty = active_courses.size
        ? [...active_courses].reduce(
              (a, b) => a + courses[b]["Difficulty"],
              0,
          ) / active_courses.size
        : 0;
    $: total_workload = active_courses.size
        ? [...active_courses].reduce((a, b) => a + courses[b]["Workload"], 0) *
          15
        : 0;

    let active_specs = new Set(["Computing Systems"]);
    function toggle_specs(item) {
        active_specs.has(item)
            ? active_specs.delete(item)
            : active_specs.add(item);
        active_specs = active_specs;
    }

    let active_rows = course_codes;
    let active_spec = ["", ""];
    function toggle_rows(spec, category) {
        let [s, c] = active_spec;
        if (s === spec && c === category) {
            active_rows = course_codes;
            active_spec = ["", ""];
        } else {
            active_spec = [spec, category];
            active_rows = specs[spec][category]["courses"];
        }
    }

    function row_class(code, active_courses) {
        if (active_courses.has(code)) return "b-highlight";
        return "";
    }
</script>

<div class="flexw mb-20">
    <p class="m-5">Specializations:</p>
    {#each Object.keys(specs) as name}
        <button on:click={() => toggle_specs(name)} class="m-5">{name}</button>
    {/each}
</div>

{#each Object.keys(specs) as name}
    {#if active_specs.has(name)}
        <BucketDivider {name} {toggle_rows} {active_courses} {active_spec} />
    {/if}
{/each}
{#if active_specs.size == 0}
    <div class="flex">
        <p>Select a specialization!</p>
    </div>
{/if}

{#if active_spec[0] != ""}
    <p>Filtering for: {active_spec}</p>
{/if}
<p>Average difficulty: {average_difficulty.toFixed(2)}</p>
<p>Expected workload: {Math.ceil(total_workload)} hours</p>

<div class="flexcenter">
    <p class="m-5">Courses: {active_courses.size}</p>
    <button on:click={clear_courses}>Clear</button>
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
        {#if active_rows.has(Code)}
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
    /* Classes */
    .flex {
        display: flex;
    }
    .flexw {
        height: 20px;
        display: flex;
        flex-wrap: wrap;
    }
    .flexw button {
        margin-left: 5px;
    }
    .flexcenter {
        display: flex;
        align-items: center;
    }
    .flexcenter button {
        margin-left: 5px;
    }

    .b-highlight {
        background-color: #d4ebf2;
    }

    .g-highlight {
        background-color: #e8f8ec;
    }

    .bold * {
        font-weight: bold;
    }

    .italic * {
        font-weight: italic;
    }

    .m-5 {
        margin: 5px;
    }

    .mb-20 {
        margin-bottom: 20px;
    }
    /* Scopes */
    td {
        padding: 2px;
        min-width: 100px;
    }
</style>
