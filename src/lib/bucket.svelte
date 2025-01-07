<div class="flex flex-col mr-4 text-sm">
    <slot name="inside" />
    <slot name="label" />
</div>

<style>
    :global([slot="inside"]) {
        padding: 10px;
        border-radius: 4px;
        width: 10rem;
        min-width: 10rem;
        height: 5rem;
        min-height: 5rem;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        @apply shadow-md;
    }

    :global([slot="label"]) {
        margin: 0.3em;
        padding: 0.2em;
        display: flex;
        border-radius: 8px;
        align-items: center;
        justify-content: center;
        @apply gap-2;
    }

</style>
