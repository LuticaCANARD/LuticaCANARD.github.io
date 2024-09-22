<script>
  import Banner from "../../../lib/components/banner.svelte"
import Loading from "../../../lib/components/loading.svelte"
  import { onMount } from 'svelte';
  import { _  as i18n,isLoading } from 'svelte-i18n'
</script>
<div>
  {#if $isLoading}
    <Loading />
  {:else}
  <div>
    <Banner settings={{
        img:'/img/introduce/about-me.png',
        style:'',
        class:''
    }}>
        <h1>{$i18n('about-me.title')}</h1>
        <h2>{$i18n('about-me.subtitle')}</h2>
    </Banner>
    <div class="about-me">
      <div class="main-class">
        <h1>{$i18n('about-me.title')}</h1>
        <p>{$i18n('about-me.p1')}</p>
        <p>{$i18n('about-me.p2')}</p>
      </div>
    </div>
    <div>

    </div>
  </div>
  {/if}
</div>