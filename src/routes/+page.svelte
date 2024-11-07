<script>
    import { courses, specs, names, spec_search } from "../lib/data.js";
    import Bucket from "../lib/Bucket.svelte";

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

    let active_specs = new Set(["Computing Systems"]);
    function toggle_specs(item) {
        active_specs.has(item)
            ? active_specs.delete(item)
            : active_specs.add(item);
        active_specs = active_specs;
    }

    let active_rows = [];
    let active_spec = ["", ""];
    function toggle_rows(spec, category) {
        let [s, c] = active_spec;
        if (s === spec && c === category) {
            active_rows = [];
            active_spec = ["", ""];
        } else {
            active_spec = [spec, category];
            active_rows = spec_search[spec][category];
        }
    }

    function spec_class(spec, category, active_spec) {
        let [s, c] = active_spec;
        if (s === spec && c === category) return "g-highlight";
        return "";
    }

    function row_class(code, active_rows, active_courses) {
        if (active_courses.has(code)) return "b-highlight";
        if (active_rows.includes(code)) return "g-highlight";
        return "";
    }
</script>

<p>Active: {active_rows}</p>

<div class="flexw mb-20">
    <p class="m-5">Specializations:</p>
    {#each specs as { name }}
        <button on:click={() => toggle_specs(name)} class="m-5">{name}</button>
    {/each}
</div>

{#each specs as { name, buckets }}
    {#if active_specs.has(name)}
        <div class="flex">
            <div class="w-175">
                <h1 class="wrap">{name}</h1>
            </div>
            {#each buckets as bucket}
                <div
                    on:click={() => toggle_rows(name, bucket.category)}
                    class={spec_class(name, bucket.category, active_spec)}
                >
                    <Bucket {...bucket} {active_courses} />
                </div>
            {/each}
        </div>
    {/if}
{/each}
{#if active_specs.size == 0}
    <div class="flex">
        <p>Select a specialization!</p>
    </div>
{/if}

<div class="flexcenter">
    <p class="m-5">Courses: {active_courses.size}</p>
    <button on:click={clear_courses}>Clear</button>
    {#each active_courses as Code}
        <button on:click={() => toggle_courses(Code)}>{Code}</button>
    {/each}
</div>

<table cellspacing="0" cellpadding="0">
    <tr class="bold">
        <td>Code</td>
        <td>Course</td>
        <td>Rating</td>
        <td>Difficulty</td>
        <td>Workload</td>
        <td>Reviews</td>
    </tr>
    {#each courses as { Course, Code, Rating, Difficulty, Workload, Reviews }}
        <tr
            class={row_class(Code, active_rows, active_courses)}
            on:click={() => toggle_courses(Code)}
        >
            <td><button>{Code}</button></td>
            <td>{Course}</td>
            <td>{Rating}</td>
            <td>{Difficulty}</td>
            <td>{Workload}</td>
            <td>{Reviews}</td>
        </tr>
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

    .wrap {
        text-wrap: wrap;
    }

    .bold * {
        font-weight: bold;
    }

    .w-175 {
        max-width: 175px;
        min-width: 175px;
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
