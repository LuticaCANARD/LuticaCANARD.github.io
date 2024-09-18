<script>
    import { _ as i18,isLoading } from 'svelte-i18n'

</script>
<div>
    <h1>
        {#if $isLoading}
            Loading...
        {:else}
            {$i18('error404')}
        {/if}
    </h1>
</div>