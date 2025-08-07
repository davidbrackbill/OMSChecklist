<!-- External container labeling the spec and holding each requirement bucket -->
<script>
    import Req from "./req.svelte";
    import SectionContainer from "./section-container.svelte";
    import { specs as trackRequirements } from "./data.js";
    import { activeCourses, activeSections } from "./state.js";
    import { trackTailwindColors } from "./icon.js";

    let { track } = $props();



    function divideCourses(activeCourses, _) {
        const courses = keys.map(() => []);
        const electiveIndex = keys.findIndex((key) => key === "Electives");

        for (const course of activeCourses) {
            let assignedToCategory = false;

            // First, try to assign to specific categories (non-electives)
            for (let i = 0; i < keys.length; i++) {
                const category = keys[i];
                if (category === "Electives") continue;

                const isInCategory = reqSets[i].has(course);
                const hasSpace =
                    courses[i].length < requirements[category].count;

                if (isInCategory && hasSpace) {
                    courses[i].push(course);
                    assignedToCategory = true;
                    break;
                }
            }

            // If not assigned to any specific category, add to electives
            if (!assignedToCategory && electiveIndex !== -1) {
                courses[electiveIndex].push(course);
            }
        }

        return courses;
    }
    // Dynamic content
    let requirements = $derived(trackRequirements[track]);
    let keys = $derived(Object.keys(requirements));
    let reqSets = $derived(keys.map(
        (category) => new Set(requirements[category]["courses"]),
    ));
    let reqCourses = $derived(divideCourses($activeCourses, $activeSections));
    // Dynamic CSS
    let titleColor = $derived(`text-${trackTailwindColors[track]}-500`);
</script>

<SectionContainer name={track} css={titleColor}>
    {#each Object.values(requirements) as { category: req, count }, i}
        <Req {track} {req} {count} listed={reqCourses[i]} />
    {/each}
</SectionContainer>
