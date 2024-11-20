<script>
    import Sortable from "sortablejs";
    export let active_courses, course_load;

    $: semesters = divide_courses(active_courses, course_load);
    function divide_courses(active_courses, course_load) {
        let arr = Array.from(active_courses);
        let res = [];
        while (arr.length) {
            res.push(arr.splice(0, course_load));
        }
        return res;
    }

    function init_sortable(list) {
        return new Sortable(list, {
            group: "shared",
            animation: 150,
        });
    }
</script>

{#each semesters as semester}
    <div use:init_sortable class="table mb-20">
        {#each semester as course}
            <div>{course}</div>
        {/each}
    </div>
{/each}

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
