<script>
    import { specs } from "../lib/data.js";
    import Bucket from "../lib/Bucket.svelte";
    export let name, toggle_rows, active_courses, active_spec;

    const buckets = specs[name];
    const keys = Object.keys(buckets);
    const bucket_sets = keys.map(
        (category) => new Set(buckets[category]["courses"]),
    );

    // Each time active_courses changes, recalculates
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

<div class="flex">
    <div class="w-175">
        <h1 class="wrap">{name}</h1>
    </div>
    {#each Object.values(buckets) as { category, count }, i}
        <Bucket
            spec={name}
            {category}
            {count}
            listed={bucket_courses[i]}
            {active_spec}
            {toggle_rows}
        />
    {/each}
</div>

<style>
    /* Classes */
    .flex {
        display: flex;
    }

    .wrap {
        text-wrap: wrap;
    }

    .w-175 {
        max-width: 175px;
        min-width: 175px;
    }
</style>
