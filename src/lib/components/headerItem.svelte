<script>
    import { onMount } from "svelte";
    import {_ as i18n,isLoading} from 'svelte-i18n'
  import { link } from "svelte-spa-router"
    /**
     * @type { { 
     *  name : string, // `표현할` 이름
     *  url : string, // url to redirect to
     *  icon : string  // icon `path` to display
     *  }}
     */
    export let displayHeader;
    onMount(() => {
    })
</script>

<style lang="scss">
    a{
        color:var(--dark-text);
        text-decoration: none;
    }
</style>
{#if displayHeader && $isLoading === false }
<il>
    {#if displayHeader}
        <a href={displayHeader.url} use:link>
            <div>
                <span>{$i18n(displayHeader.name)}</span>
            </div>
        </a>
    {/if}
</il>
{/if}