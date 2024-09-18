<script>
  import { link } from "svelte-spa-router"
  import MobileSubmenu from "./mobileSubmenu.svelte"

    
    /**@type {{
            name: string;
            url: string;
            icon: string;
            tabindex: number;
            submenus: {
                name: string;
                url: string;
            }[];
        }[]}
    * 
    */
    export let menuInfo;

    $: submenu_on = false;

</script>

<style lang="scss">
    .bg-all{
        background-color: rgba(0,0,0,0.5);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .bg-mobile-menu{
        background-color: var(--background);
        width: max(80%, 300px);
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    a{
        color:var(--font-color);
        text-decoration: none;
        height: 100%;
        display: flex;
        align-items: center;
    }

</style>
<div class="bg-all">
    <div class="bg-mobile-menu">
        {#each menuInfo as menu}
            <a href={menu.url} tabindex={menu.tabindex} use:link>
                <div class="header-item-parent">
                    <span>{menu.name}</span>
                    {#if menu.submenus.length > 0}
                    <button on:click|preventDefault={() => submenu_on = !submenu_on}>+</button>
                    {/if}
                </div>
            </a>
            {#if submenu_on}
                <MobileSubmenu submenus={menu.submenus}/>
            {/if}
        {/each}
    </div>
</div>
