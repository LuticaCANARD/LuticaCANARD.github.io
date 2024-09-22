<script>
  import { MOBILE_HEADER_WIDTH } from "../../constants"

    /**
     * @type {{
     * style: string,
     * class: string,
     * img: string,
     * height?: number,
     * }}
     */
    export let settings;
    let scrolling;
    let innerWidth;
    let style = settings.style;
    if( settings.class === undefined){
        settings.class = "";
    }
    $: innerWidth > MOBILE_HEADER_WIDTH ? 
    style = settings.style+`;background-image: url(${settings.img});background-size: cover; background-position: center ${-scrolling*0.4}px;height: ${settings.height ?? 600}px;` : 
    style = settings.style+`;background-image: url(${settings.img});background-size: cover;height: ${settings.height ?? 600}px;`;
</script>
<style lang="scss">
    .intro-main-picture{
        display: flex;
        justify-content: center;
    }
    .intro-main-title{
        margin: auto;
    }
</style>
<svelte:window bind:scrollY={scrolling} bind:innerWidth={innerWidth}/>
<div class={"intro-main-picture" + settings.class  } style = {style}  >
    <div class="intro-main-title" >
        <slot/>
    </div> 
</div>