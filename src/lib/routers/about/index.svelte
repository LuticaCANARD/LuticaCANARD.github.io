<script>
  import Loading from "../../../lib/components/loading.svelte"
  import { onMount } from 'svelte';
  import { _  as i18n,isLoading } from 'svelte-i18n'
</script>
<style>
.about-me{

}
</style>
<div>
  {#if $isLoading}
    <Loading />
  {:else}
  <div>
    <div class="about-me">
      <div class="main-class">
        <h1>{$i18n('about-me.title')}</h1>
        <p>{$i18n('about-me.p1')}</p>
        <p1>{$i18n('about-me.p2')}</p1>
      </div>
    </div>
    <div>

    </div>
  </div>
  {/if}
</div>