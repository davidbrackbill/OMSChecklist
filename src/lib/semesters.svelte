<script>
    import Semester from "./semester.svelte";
    export let active_courses;

    const max_semesters = 20;
    let pinned = {};
    let tooltip = true;
    // Once a course has been pinned, hide the tooltip
    $: tooltip = tooltip ? !Object.keys(pinned).length : false;

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
</script>

<div class="grid">
    <div class="sidebar-width sb">
        {#if tooltip && active.length > 1}
            <small
                >Courses are draggable, try moving them between semesters!
            </small>
        {/if}
    </div>
    <div>
        {#each active as codes, index}
            <Semester bind:pinned {codes} {index} />
        {/each}
    </div>
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr 8fr;
    }
    .sb {
        grid-row: 1 / -1;
    }
</style>
