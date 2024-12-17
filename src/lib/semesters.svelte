<script>
    import Semester from "./semester.svelte";
    export let active_courses;

    const course_load = 1;
    let draggable_tooltip = true;

    $: semesters = divide_courses(active_courses, course_load);
    function divide_courses(active_courses, course_load) {
        let arr = [...active_courses];
        let res = [];
        while (arr.length) {
            res.push(arr.splice(0, course_load));
        }
        return res;
    }
</script>

<div class="flex wrap">
    <div class="mb-20 sidebar-width bottom">
        {#if semesters.length > 1 && draggable_tooltip}
            <small
                >Courses are draggable, try moving them between semesters!
            </small>
        {/if}
    </div>
    {#each semesters as codes, i}
        <button>
            <Semester {codes} />
            <h3>Semester {i + 1}</h3>
        </button>
    {/each}
</div>

<style>
    h3 {
        margin-top: -0.2em;
        justify-self: center;
    }

    button {
        background-color: transparent;
        border: none;
    }
</style>
