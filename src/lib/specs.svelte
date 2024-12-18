<script>
    import { specs } from "../lib/data.js";
    import Spec from "../lib/spec.svelte";
    export let name, toggle_rows, active_courses, active_bucket, i;

    let tooltip = true;
    $: tooltip = tooltip ? i === 0 && active_bucket[0] == null : false;
    const buckets = specs[name];
    const keys = Object.keys(buckets);
    const bucket_sets = keys.map(
        (category) => new Set(buckets[category]["courses"]),
    );

    $: bucket_courses = divide_courses(active_courses);
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
</script>

<div class="flex wrap">
    <div class="sidebar-width">
        <h2 class="wrap-t">{name}</h2>
        {#if tooltip}
            <small
                >Click on a specialization to find courses that satisfy it!</small
            >
        {/if}
    </div>
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

<style>
    h2 {
        margin-top: .4em;
        margin-bottom: .1em;
    }
</style>
