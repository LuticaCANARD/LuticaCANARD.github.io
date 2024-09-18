<script>
    import { onMount } from 'svelte';
    import { _ as i18n,isLoading } from 'svelte-i18n'
  import { link } from 'svelte-spa-router'
  import HeaderSubItems from './headerSubItems.svelte'
    
    /**@type{{
    * name : string,
    * url : string,
    }[]}*/
    export let submenuInfos;
    export let tabindex;
    export let menuItem;

    const onEnter = (/**@type {MouseEvent}*/e )=>{
        //e.preventDefault();
    }
</script>

<style lang="scss">
    a{
        color:var(--font-color);
        text-decoration: none;
        height: 100%;
        display: flex;
        align-items: center;
    }
    .header-item-parent{
        position: absolute;
        padding-bottom: 10px;
        background-color: var(--background);
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-top: 15px;
    }
    .header-item-wrapper {
        position: relative;
        width: 100%;
    }

</style>

<div on:mouseenter={onEnter} role="menuitem" tabindex={tabindex} class="header-item-wrapper">
    <div class="header-item-parent">
        {#each submenuInfos as submenuInfo}
        <HeaderSubItems submenuInfo={submenuInfo} menuItem = {menuItem}/>
        {/each}
    </div>
</div>