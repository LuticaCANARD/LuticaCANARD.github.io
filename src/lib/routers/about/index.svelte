<script>
  import Loading from "../../../lib/components/loading.svelte"
  import { onMount } from 'svelte';
  import { _  as i18n,isLoading } from 'svelte-i18n'
</script>
<style>

</style>
<div>
  {#if $isLoading}
    <Loading />
  {:else}
    <h1>{$i18n('about-me.title')}</h1>
    <p>{$i18n('about-me.p1')}</p>
  {/if}
</div>