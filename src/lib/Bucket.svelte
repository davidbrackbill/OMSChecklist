<script>
    export let category, count, courses, active_courses;
    const course_set = new Set(courses);
    $: bubbles = course_set.intersection(active_courses);
    $: satisfied = bubbles.size;
</script>

<div class="column">
    <table>
        {#each bubbles as course}
            <tr>{course}</tr>
        {/each}
    </table>
    <div class="flex">
        <h3>{category}</h3>
        <p>{satisfied}/{count}</p>
    </div>
</div>

<style>
    .flex {
        display: flex;
    }

    .column {
        margin: 10px;
        display: flex;
        flex-direction: column;
    }

    table {
        width: 150px;
        height: 100px;
        border: 1px solid black;
        padding: 10px;
    }
</style>
