<script>
    import { specs } from "../lib/data.js";
    import Spec from "../lib/spec.svelte";
    export let name, toggle_rows, active_courses, active_bucket;

    $: bucket_tooltip = active_bucket[0] == null;

    const buckets = specs[name];
    const keys = Object.keys(buckets);
    const bucket_sets = keys.map(
        (category) => new Set(buckets[category]["courses"]),
    );

    // Each time `active_courses` changes, recalculates
    function divide_courses(active_courses) {
        let courses = Array.from({ length: keys.length }, () => []);
        active_courses.forEach((course) => {
            let elective = true;
            keys.forEach((category, i) => {
                if (category === "Electives") {
                    if (elective) courses[i].push(course);
                } else if (bucket_sets[i].has(course)) {
                    if (courses[i].length < buckets[category].count) {
                        courses[i].push(course);
                        elective = false;
                    }
                }
            });
        });
        return courses;
    }
    $: bucket_courses = divide_courses(active_courses);
</script>

<div class="grid">
    <div class="sidebar-width sb">
        <h1 class="wrap-t">{name}</h1>
        {#if bucket_tooltip}
            <slot />
        {/if}
    </div>
    <div>
        {#each Object.values(buckets) as { category, count }, i}
            <Spec
                spec={name}
                {category}
                {count}
                listed={bucket_courses[i]}
                {active_bucket}
                {toggle_rows}
            />
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
