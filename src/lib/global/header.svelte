<script>
    import { darkmode } from '../../store.js';
    import { onMount } from 'svelte';
    import LangChoice from '../components/langChoice.svelte';
    import { _ as i18,isLoading } from 'svelte-i18n'
    import HeaderItem from '../components/headerItem.svelte';
    import { link } from 'svelte-spa-router'
    import { MOBILE_HEADER_WIDTH } from '../../constants.js'
    const menu = [
                {name : "menu-home", url : "/", icon : "home"},
                {name : "menu-about", url : "/about", icon : "info"},
                {name : "menu-contact", url : "/contact", icon : "contact_mail"},
            ]
    $: isDarkMode = false;
    darkmode.subscribe(value => {
        isDarkMode = value;
    })
    $: innerW = 0; 
    onMount(()=>{
        
    })
</script>
<svelte:window bind:innerWidth={innerW} />
<style lang="scss">
    header>nav {
        background: #171718;
        color: white;
        padding-right: 1rem;
        padding-left: 1rem;
        padding-bottom: 1rem;
        padding-top: 0.1rem;
        text-align: center;
        font-size: 1.5rem;
        display: flex;
        justify-content: space-between;
        max-width: 1500px;
        margin: auto;
    }
    
    header div {
        display: inline-block;
    }
    header div:hover {
        cursor: pointer;
    }
    nav>ul{
        display: flex;
        justify-content: space-around;
        list-style: none;
        padding: 0;
    }
    #logo {
        display: flex;
        align-items: center;
        width: 50%;
        
    }
    #logo img {
        max-width: 100px;
        margin-right: 1rem;
    }
    #logo h2 {
        margin-left: 1.1rem;
        color:var(--dark-text);
    }
    ul{
        margin: 0;
    }
</style>

<header>
    {#if $isLoading}
    <!-- i18n Loading ....-->
        <div>Loading...</div>
    {:else if innerW > MOBILE_HEADER_WIDTH}
    <!-- Desktop Header ! -->
    <nav>
        <div id="logo">
            <a href="/" use:link class="linknone">
                <img src="/img/logo/logo.png" alt="logo of Lutica Lab">
            </a>
            <a href="/" use:link class="linknone">
                <h2 class="linknone">{$i18('labname')}</h2>
            </a>
        </div>
        <ul>
        {#each menu as item }
            <HeaderItem displayHeader={item} />
        {/each}
        </ul>
    </nav>
    {:else}
    <!-- Mobile Header ! -->
    <div id="logo">
        <a href="/" use:link class="linknone">
            <img src="/img/logo/logo.png" alt="logo of Lutica Lab">
        </a>
        {#if innerW > 200}
        <a href="/" use:link class="linknone">
            <h2 class="linknone">{$i18('labname')}</h2>
        </a>
        {/if}
        {#if innerW > 250}
        <!--Button for menu-->
        {/if}
    </div>
    {/if}
</header>