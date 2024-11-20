<script>
    import Sortable from "sortablejs";
    import { courses } from "../lib/data.js";
    export let active_courses;

    let course_load = 1;
    let buckets_populated = 0;
    let draggable_tooltip = true;

    $: semesters = divide_courses(active_courses, course_load);
    function divide_courses(active_courses, course_load) {
        let arr = [...active_courses];
        let res = [];
        while (arr.length) {
            res.push(arr.splice(0, course_load));
        }
        // Don't ever let buckets delete from under Sortablejs;
        // it will hang the app. So, make sure to keep any buckets
        // alive as empty buckets.
        buckets_populated = Math.max(res.length, buckets_populated);
        for (let i = 0; i < (buckets_populated - res.length); i++)
            res.push([]);
        return res;
    }

    function init_sortable(list) {
        return new Sortable(list, {
            group: "shared",
            animation: 150,
            onSort({ from, to }) {
                draggable_tooltip = false;
                let t = Number(to.dataset.id);
                let f = Number(from.dataset.id);
                semesters[t] = Array.from(to.children, (c) => c.innerText);
                semesters[f] = Array.from(from.children, (c) => c.innerText);
            },
        });
    }

    function average_difficulty(codes) {
        if (codes.length === 0) return 0;
        let sum = codes.reduce((a, b) => a + courses[b]["Difficulty"], 0);
        return (sum / codes.length).toFixed(1);
    }

    function workload(codes) {
        return Math.floor(
            codes.reduce((a, b) => a + courses[b]["Workload"], 0),
        );
    }

    // TODO: merge with bucket styles
</script>

<div class="flex">
    <div class="w-175 flex-c">
        <div class="mt-40" />
        {#if semesters.length > 1 && draggable_tooltip}
            <small
                >Courses are draggable, try moving them between semesters!
            </small>
        {/if}
    </div>
    {#each semesters as semester, i}
        <div class="column">
            <div use:init_sortable class="table" data-id={i}>
                {#each semester as course}
                    <tr data-id={course}>{course}</tr>
                {/each}
            </div>
            <div class="category mt--45">
                <p>&#128548 {average_difficulty(semester)}</p>
                <p>&#9203 {workload(semester)}</p>
            </div>
            <h3 class="category mt-10">Semester {i + 1}</h3>
        </div>
    {/each}
</div>

<style>
    .category {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        height: 20px;
    }

    .column {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
    }

    .table {
        width: 125px;
        height: 75px;
        border: 1px solid black;
        margin-right : 10px;
        margin-bottom: 20px;
        padding: 10px;
        border-radius: 4px;
    }
</style>
