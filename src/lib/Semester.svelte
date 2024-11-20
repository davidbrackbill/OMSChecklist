<script>
    let html;
    $: if (html && html.children) console.log(html.children);
</script>

<div bind:this={html}>
    <slot />
</div>
