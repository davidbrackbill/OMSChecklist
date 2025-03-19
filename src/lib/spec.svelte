<script>
    import Requirement from "../lib/requirement.svelte";
    import { specs } from "../lib/data.js";
    import { active_courses } from "../lib/state.js";

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
    const colors = {
        "Machine Learning": "hsl(178, 50%, 60%)",
        "Computer Graphics": "hsl(184, 100%, 29%)",
        Robotics: "hsl(77, 64%, 51%)",
        "Computing Systems": "hsl(48, 100%, 50%)",
        "Human Computer Interaction": "hsl(8, 73%, 55%)",
        "Interactive Intelligence": "hsl(269, 63%, 38%)",
    };
</script>

<h2 class="font-medium text-lg text-center pt-2" style={`color: ${colors[name]};`}>{name}</h2>
<div class="flex flex-wrap justify-center">
    {#each Object.values(buckets) as { category, count }, i}
        <Requirement spec={name} {category} {count} listed={bucket_courses[i]} />
    {/each}
</div>
