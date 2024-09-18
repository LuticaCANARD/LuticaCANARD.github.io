<script>
  import { tick } from "svelte"

    /**
     * @type {{
     * src: string,
     * alt: string,
     * style: string,
     * class: string,
     * curve?:(s:number)=>{x:number,y:number}
     * }}
     */
    export let imageSettings;
    /**@type {{x:number,y:number}}*/
    export let trigging;

    let scrolly_;
    let last_scroll = 0;

    // 올라가면 -, 내려가면 +
    let direction_is_minus;

    let last_direction;
    const curveFunction = imageSettings.curve ?? (
        (s)=>{return{x:0,y:s}}
    );
    const onScrollInterrupt = (e) =>{
        if((scrolly_ - trigging.y) * (last_scroll - trigging.y) > 0 ){
            return;
        }
        if(last_scroll != undefined)
            direction_is_minus = scrolly_ - last_scroll < 0;
        last_scroll = scrolly_;

        if(last_direction !== direction_is_minus && last_direction !== undefined){
            // 이 경우, 방향이 바뀌었거나 처음일 때 실행된다.
                        
            return;
        }
        last_direction = direction_is_minus;

    }

</script>

<style lang="scss">
    img{
        width: 100%;
        height: 100%;
    }
    .img-wrapper{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

</style>
<svelte:window bind:scrollY={scrolly_} on:scroll={onScrollInterrupt} />

<div class="img-wrapper">
    <img src={imageSettings.src} 
    alt={imageSettings.alt} 
    style={imageSettings.style + `;transform:translate(${curveFunction(scrolly_ - trigging.y).x}px,${curveFunction(scrolly_ - trigging.y).y}px)`} 
    class={imageSettings.class} 
    loading="lazy"/>
</div>
