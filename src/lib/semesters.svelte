<script>
    import Semester from "./semester.svelte";
    export let active_courses;

    const max_semesters = 20;
    let draggable_tooltip = true;
    let pinned = {};

    $: semesters = divide_courses(active_courses);
    function divide_courses(active_courses) {
        if (!active_courses.size) return [[]];
        let seen = new Set();
        let res = new Array(max_semesters).fill().map((_) => []);
        for (const [i, courses] of Object.entries(pinned)) {
            res[i] = courses;
            for (const course of courses) seen.add(course);
        }

        let i = 0;
        function add(course) {
            if (i in pinned || res[i].length) {
                i++;
                add(course);
                }
            else 
                res[i++] = [course];
        }
        active_courses.difference(seen).forEach(add)

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
    {#each semesters as codes, index}
        {#if codes.length}
        <button>
            <Semester bind:pinned {codes} {index} />
            <h3>Semester {index + 1}</h3>
        </button>
        {/if}
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
