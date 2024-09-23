<script>
    import { onMount, tick } from 'svelte';
    import LangChoice from '../components/langChoice.svelte';
    import { _ as i18,isLoading } from 'svelte-i18n'
    import HeaderItem from '../components/header/headerItem.svelte';
    import HeaderData from '../../assets/headerMenus.json';
    import { link } from 'svelte-spa-router'
    import { MOBILE_MAX_WIDTH } from '../../constants.js'
    import SetDarkmodeButton from '../components/setDarkmodeButton.svelte'
    import {routePath} from '../../store.js'
    import MobileHeader from '../components/header/moblie/mobileHeader.svelte'
    const menu = HeaderData;
    $: innerW = 0; 
    $: scroll_ = 0;
    $: innerH = 0;
    $: state_rel = false;
    let boxHeight = 0;
    let last_scroll = 0;
    $: mobile_menu_on = false;
    let goUp = false;
    onMount(()=>{
        routePath.subscribe((val)=>{
            state_rel = false;
            scroll_ = 0;
            return;
        })
    })
    
    const onScroll = (e)=>{
        goUp = scroll_ < last_scroll;
        last_scroll = scroll_;
        if(state_rel && scroll_ < 150) {
            state_rel = false;
            scroll_ += 150;
            return;
        }
        if(scroll_ >= 300 && !state_rel){
            state_rel = true;
            scroll_ -= 150;
            last_scroll = scroll_;
            return;
        }
    }
    
</script>
<svelte:window bind:innerWidth={innerW} bind:scrollY={scroll_} on:scroll={onScroll}
bind:innerHeight={innerH} bind:outerHeight={boxHeight}/>
<style lang="scss">
    header>nav {
        background: var(--background);
        color: white;
        padding-right: 1rem;
        padding-left: 1rem;
        padding-bottom: 0.1rem;
        padding-top: 0.1rem;
        text-align: center;
        font-size: 1.5rem;
        display: flex;
        justify-content: space-between;
        max-width: var(--main-max-width);
        margin: auto;
    }
    header{
        border-bottom: white 1px solid;
        //max-width: var(--main-max-width);
        margin: auto;
        background-color: var(--background);
    }
    header div {
        display: inline-block;
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
    }
    #logo img {
        max-width: 100px;
        margin-right: 1rem;
    }
    #logo h2 {
        margin-left: 1.1rem;
        margin-top: auto;
        margin-bottom: auto;
        color:var(--font-color);
    }
    .mobile-logo{
        width: 100%;
    }
    ul{
        margin: 0;
    }
    .onMountTop{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 100;
    }
    .notMountTop{
        position: relative;
    }
    .mobile-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
    }
    .btn-mobile-menu{
        margin: auto;
        width: max(30px,10%);
    }
    .btn-mobile-menu button{
        font-size: 2rem;
        background-color: var(--background);
        color: var(--font-color);
        border: none;
    }
</style>
{#key state_rel}
<header class={state_rel ? "onMountTop" : "notMountTop"} style={goUp && state_rel ? 'transform:translate(0,-120px)' : ''}>
    {#if $isLoading}
    <!-- i18n Loading ....-->
    <div>Loading...</div>
    {:else if innerW > MOBILE_MAX_WIDTH}
    <!-- Desktop Header ! -->
    <nav>
        <div id="logo">
            <a href="/" use:link class="linknone">
                <img src="/img/logo/logo.png" alt="logo of Lutica Lab">
            </a>
            <a href="/" use:link class="linknone">
                <h2 class="linknone">{$i18('tab-name')}</h2>
            </a>
        </div>
        <ul>
            {#each menu as item }
            <HeaderItem displayHeader={item} />
            {/each}
        </ul>
        <div>
            <LangChoice />
            <SetDarkmodeButton />
        </div>
    </nav>
    
    {:else}
    <!-- Mobile Header ! -->
    <div class="mobile-header">
        <div id="logo" class="mobile-logo">
            <a href="/" use:link class="linknone">
                <img src="/img/logo/logo.png" alt="logo of Lutica Lab">
            </a>
            {#if innerW > 200}
            <a href="/" use:link class="linknone">
                <h2 class="linknone">{$i18('tab-name')}</h2>
            </a>
            {/if}
            
        </div>
        {#if innerW > 250}
        <!--Button for menu-->
        <!--옆에서 슬라이드해서 나오는 버튼!-->
        <div class="btn-mobile-menu">
            <button on:click|preventDefault={()=>{mobile_menu_on = !mobile_menu_on}}>{mobile_menu_on ? 'X' : '☰'}</button>
        </div>
        {/if}
    </div>
    {#if mobile_menu_on}
    <div>
        <MobileHeader menuInfo={menu} />
        <div>
            <LangChoice />
            <SetDarkmodeButton />
        </div>
    </div>
    {/if}
    
    {/if}
</header>
{/key}