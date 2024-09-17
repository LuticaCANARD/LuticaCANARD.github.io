<script>
    import { onMount } from "svelte";
    import { _ as i18n, isLoading } from 'svelte-i18n'
    import { link } from "svelte-spa-router"
    /**
     * @type { { 
     *  name : string, // `표현할` 이름
     *  url : string, // url to redirect to
     *  icon : string  // icon `path` to display
     *  }}
     */
    export let displayHeader;
    /**@type {HTMLDivElement}*/
    let backgroundThis;
    onMount(() => {
    })
</script>

<style lang="scss">
    a{
        color:var(--dark-text);
        text-decoration: none;
    }
    il{
        display: flex;
        padding: 0 1rem;
        align-items: center;
        background-color: rgba(0,0,0,0);
        transition: background-color 0.4s;

    }

    il:hover{
        background-color: rgba(85, 85, 85, 0.3);
        cursor: pointer;
    }
    .header-item-parent{
        position: relative;
    }
    
</style>
{#if displayHeader && $isLoading === false }
<il>
    {#if displayHeader}
        <a href={displayHeader.url} use:link>
            <div class="header-item-parent">
                <div bind:this = {backgroundThis}>
                    <span>{$i18n(displayHeader.name)}</span>
                </div>
            </div>
        </a>
        <div class="header-items-bg"></div>
    {/if}
</il>
{/if}