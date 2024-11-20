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
                let _to = Number(to.dataset.id);
                let _from = Number(from.dataset.id);
                semesters[_to] = Array.from(to.children, (c) => c.innerText);
                semesters[_from] = Array.from(
                    from.children,
                    (c) => c.innerText,
                );
            },
        });
    }

    // $: averages = compute_averages(semesters);
    // function compute_averages(semesters) {
    //     let averages = [];
    //     for (let i = 0; i < num_semesters; i++) {
    //         averages[i] = [
    //             average_difficulty(semesters[i]),
    //             workload(semesters[i]),
    //         ];
    //     }
    //     return averages;
    // }

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

<!-- {JSON.stringify(averages)} -->

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
