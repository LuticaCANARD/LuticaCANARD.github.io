<script>
    import { darkmode } from '../../store.js';
    import { onMount } from 'svelte';
    import ko from '../../i18n/ko.json';
    import LangChoice from '../components/langChoice.svelte';
    import { _ as i18,isLoading } from 'svelte-i18n'
    import HeaderItem from '../components/headerItem.svelte';
    let menu = null
    let load = false
    onMount(()=>{
        
    })
    isLoading.subscribe((loading) => {
        
        if(loading === false){
            menu = [
                {name : "menu-home", url : "/", icon : "home"},
                {name : "menu-about", url : "/about", icon : "info"},
                {name : "menu-contact", url : "/contact", icon : "contact_mail"},
            ]
        }
    })
</script>
<style lang="scss">
    header {
        background: #171718;
        color: white;
        padding: 1rem;
        text-align: center;
        font-size: 1.5rem;
        display: flex;
        justify-content: space-around;
    }
    header div {
        display: inline-block;
    }
    header div:hover {
        cursor: pointer;

    }

</style>
<header>
    {#if $isLoading}
        <div>Loading...</div>
    {:else if menu != null}
    {#each menu as item }
        <HeaderItem displayHeader={item} />
    {/each}
    {/if}
</header>