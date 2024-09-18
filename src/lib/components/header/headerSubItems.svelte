<script>
import { link } from "svelte-spa-router"
import { _ as i18n , isLoading } from 'svelte-i18n'
export let submenuInfo;
export let menuItem;

</script>
<style>
    a{
        color:var(--font-color);
        text-decoration: none;
        height: 100%;
        display: flex;
        align-items: center;
    }
    .submenu-item{
        padding-bottom: 10px;
        background-color: var(--background);
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-top: 15px;
        z-index: 100;
    }
    .submenu-wrapper{
        position: relative;
        width: 100%;
        border-bottom: 1px solid var(--font-color);
    }

</style>
<div class="submenu-wrapper">
    <a href={submenuInfo.url} use:link>
        <div class="submenu-item">
            {#if !$isLoading}
            <p1>{$i18n(`menus.${menuItem}.${submenuInfo.name}`)}</p1>
            {/if}
        </div>
    </a>
</div>