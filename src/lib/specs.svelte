<script>
    import { specs } from "../lib/data.js";
    import { active_courses } from "../lib/state.js";
    import Spec from "../lib/spec.svelte";

    export let name;

    const buckets = specs[name];
    const keys = Object.keys(buckets);
    const bucket_sets = keys.map(
        (category) => new Set(buckets[category]["courses"]),
    );

    $: bucket_courses = divide_courses($active_courses);
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
    </div>
    {#each Object.values(buckets) as { category, count }, i}
        <Spec spec={name} {category} {count} listed={bucket_courses[i]} />
    {/each}
</div>

<style>
    h2 {
        margin-top: 0.4em;
        margin-bottom: 0.1em;
    }
</style>
