<script>
    import Sortable from "sortablejs";
    import { courses } from "../lib/data.js";
    export let active_courses, course_load;

    $: semesters = divide_courses(active_courses, course_load);
    $: num_semesters = semesters.length;
    function divide_courses(active_courses, course_load) {
        let arr = [...active_courses];
        let res = [];
        while (arr.length) {
            res.push(arr.splice(0, course_load));
        }
        // empty end bucket
        res.push([]);
        return res;
    }

    function init_sortable(list) {
        return new Sortable(list, {
            group: "shared",
            animation: 150,
            onSort({ from, to }) {
                let t = Number(to.dataset.id);
                let f = Number(from.dataset.id);
                semesters[t] = Array.from(to.children, (c) => c.innerText);
                semesters[f] = Array.from(from.children, (c) => c.innerText);
            },
        });
    }

    function average_difficulty(codes) {
        console.log("avg_diff", codes);
        if (codes.length === 0) return 0;
        let sum = codes.reduce((a, b) => a + courses[b]["Difficulty"], 0);
        return (sum / codes.length).toFixed(2);
    }

    function workload(codes) {
        if (!codes) return 0;
        return codes.reduce((a, b) => a + courses[b]["Workload"], 0);
    }
</script>

{#each semesters as semester, i}
    <div class="flexc">
        {#key semester}
            <p>Average difficulty: {average_difficulty(semester)}</p>
            <p>Workload: {workload(semester)} hours per week</p>
        {/key}
    </div>
    <div use:init_sortable class="table mb-20" data-id={i}>
        {#each semester as course}
            <div data-id={course}>{course}</div>
        {/each}
    </div>
{/each}

<div use:init_sortable class="table mb-20" data-id={num_semesters} />

<style>
    .table {
        width: 125px;
        height: 75px;
        border: 1px solid black;
        margin: 10px;
        padding: 10px;
        border-radius: 4px;
    }
</style>
