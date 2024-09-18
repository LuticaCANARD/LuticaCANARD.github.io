<script>
    import { onMount } from "svelte";
    import { _ as i18n, isLoading } from 'svelte-i18n'
    import { link } from "svelte-spa-router"
    import HeaderSubMenus from "./headerSubMenus.svelte"
  import { darkMode } from "../../../store"
    /**
     * @type { { 
     *  name : string, // `표현할` 이름
     *  url : string, // url to redirect to
     *  icon : string,  // icon `path` to display
     *  tabindex : number, // tab index
     *  submenus : {
     *      name: string,
     *      url: string 
     *  }[]
     *  }}
     */
    export let displayHeader;
    /**@type {HTMLDivElement}*/
    let backgroundThis;

    const onEnter = (/**@type {MouseEvent}*/e )=>{
        hovering = true;
    }
    const onLeave = (/**@type {MouseEvent}*/e)=>{
        hovering = false;
    }
    $: hovering = false;
    $: rending = "transition: background-color 0.4s;"
    onMount(() => {
    })
    const setTransition = () =>
        rending = "transition: background-color 0.4s;"
    
    darkMode.subscribe((darkMode) => { 
        rending = ""
        setTimeout( // to prevent the transition effect
        // 이벤트 루프의 맨 끝에 실행되도록 0초 뒤에 실행
        setTransition,0)
    })
</script>

<style lang="scss">
    a{
        color:var(--font-color);
        text-decoration: none;
        height: 100%;
        display: flex;
        align-items: center;
    }
    il{
        display:block;
        background-color: var(--background);
        min-width: 150px;

    }
    .header-item-parent{
        padding-bottom: 0px;
        padding-left: 1rem;
        padding-right: 1rem;
        position: relative;
        transition: padding-bottom 0.4s;
        height: 100%;
        display: flex;
        align-items: center;
    }

    il:hover{
        background-color: var(--background-hover);
        cursor: pointer;
    }
    .header-item-parent:hover{
        padding-bottom: 5px;
        padding-left: 1rem;
        padding-right: 1rem;
    }
    .hovering-item{
        padding-bottom: 5px;
    }
    .subitem-href{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    
</style>
{#if displayHeader && $isLoading === false }
<il on:mouseenter={onEnter} on:mouseleave={onLeave} role="navigation"
    style={rending}>
    {#if displayHeader}
        <a href={displayHeader.url} class="subitem-href" use:link>
            <div class={hovering ? "header-item-parent hovering-item" : "header-item-parent"}>
                <div bind:this = {backgroundThis}>
                    <span>{$i18n(`menus.${displayHeader.name}.main`)}</span>
                </div>
            </div>
        </a>
        {#if hovering && displayHeader.submenus.length > 0}
            <HeaderSubMenus submenuInfos={displayHeader.submenus} tabindex ={displayHeader.tabindex} menuItem={displayHeader.name}/>
        {/if}
    {/if}
</il>
{/if}