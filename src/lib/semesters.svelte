<script>
    import Semester from "./semester.svelte";
    export let active_courses;

    const max_semesters = 20;
    let tooltip = true;

    let pinned = {};
    $: semesters = update_semesters(active_courses);
    $: active = semesters.filter((a) => a.length);
    function update_semesters(active_courses) {
        if (!active_courses.size) {
            return [[]];
        }
        let res = new Array(max_semesters).fill().map((_) => []);
        let seen = new Set();
        for (const [semester, courses] of Object.entries(pinned)) {
            for (const [i, course] of courses.entries()) {
                if (active_courses.has(course)) {
                    res[semester].push(course);
                    seen.add(course);
                } else if (courses.length > 1) {
                    courses.splice(i, 1);
                } else {
                    delete pinned[semester];
                }
            }
        }

        let i = 0;
        function add(course) {
            if (i in pinned || res[i].length) {
                i++;
                add(course);
            } else res[i++] = [course];
        }
        active_courses.difference(seen).forEach(add);

        return res;
    }

    // Once a course has been pinned, hide the tooltip
    $: tooltip = tooltip ? !Object.keys(pinned).length : false;
</script>

<div class="flex wrap">
    <div class="mb-20 sidebar-width bottom">
        {#if tooltip && active.length > 1}
            <small
                >Courses are draggable, try moving them between semesters!
            </small>
        {/if}
    </div>
    {#each active as codes, index}
        <button>
            <Semester bind:pinned {codes} {index} />
            <h3>Semester {index + 1}</h3>
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
