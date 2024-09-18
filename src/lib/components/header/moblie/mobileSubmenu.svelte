<script>
  import { link } from "svelte-spa-router"


    export let submenus;

</script>

<style>

</style>

{#each submenus as submenu }
<div class="header-item-child">
    <a href={submenu.url} class="a-no-decor-and-text" use:link>
        <span>{submenu.name}</span>
    </a>
</div>
{/each}