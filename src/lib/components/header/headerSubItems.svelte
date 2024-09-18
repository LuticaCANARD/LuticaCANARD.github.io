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
</style>
<div>
    <a href={submenuInfo.url} use:link>
        <div>
            {#if !$isLoading}
            <p1>{$i18n(`menus.${menuItem}.${submenuInfo.name}`)}</p1>
            {/if}
        </div>
    </a>
</div>