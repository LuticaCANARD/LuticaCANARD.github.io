<script>
    import SpringComponent from '../../../components/springComponent.svelte'
    import { onMount } from 'svelte';
    import { _ as i18n,isLoading } from 'svelte-i18n'
    let scrolling;
    let innerWidth;


    $: triggingOption = innerWidth > 1200 ? [
        {x:0,y:1400},
        {x:0,y:3000}
        ] : Array.from({length: 2}, (_, i) => ({x:0,y:0}));
</script>

<style lang="scss">
    .intro-main-picture{
        background-image: url('/img/introduce/metabus_intro.png');
        background-size: cover;
        height: 600px;
        //margin: auto;
        //max-width: var(--main-max-width);
        display: flex;
        justify-content: center;
    }
    .intro-main-title{
        margin: auto;

    }
    .intro-main{
        margin: auto;
        max-width: var(--main-max-width);
        padding: 20px;
    }
</style>
<svelte:window bind:scrollY={scrolling} bind:innerWidth={innerWidth}/>
<div>
    <div class="intro-main-picture" style={innerWidth > 1200 ? `background-position: center ${-scrolling*0.4}px` : 'background-position: center' }>
        <div class="intro-main-title" >
            <h1 style="color: white;">{$i18n('about.metabus.title')}</h1>
            <h2 style="color: white;">{$i18n('about.metabus.subtitle')}</h2>
        </div>
    </div>
    <div class="intro-main">
        <h2>{$i18n('about.metabus.p1.title')}</h2>
        <p1>{$i18n('about.metabus.p1.content')}</p1>

        <div style="height: 100vh;"></div>
        <SpringComponent componentSettings={{style:'',class:'',curve:(s)=>{return {x:s,y:0}}}} trigging={triggingOption[0]}>
            <img src="/img/introduce/metabus_intro.png" alt="metabus" style="height: 600px;"/>
        </SpringComponent>
        <div style="height: 100vh;"></div>
        <SpringComponent componentSettings={{style:'position:relative;left:100px',class:'',curve:(s)=>{return {x:-s,y:0}}}} trigging={triggingOption[1]}>
            <img src="/img/introduce/metabus_intro.png" alt="metabus" style="height: 600px;"/>
        </SpringComponent>
        <div style="height: 100vh;"></div>

        

    </div>
</div>