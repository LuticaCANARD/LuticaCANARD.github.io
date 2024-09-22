<script>

    /**
     * @type {{
     * style: string,
     * class: string,
     * curve?:(s:number)=>{x:number,y:number},
     * }}
     */
    export let componentSettings;
    /**@type {{x:number,y:number}}*/
    export let trigging;
    let scrollY_;
    $: ItWasShown = false;
    const curveFunction = componentSettings.curve ?? (
        (s)=>{return{x:0,y:s}}
    );
    const onScrollInterrupt = (e) =>{
        console.log(scrollY_);
        console.log(ItWasShown)
        if(scrollY_ > trigging.y && !ItWasShown){
            ItWasShown = true;
        }
    }

</script>

<style lang="scss">
    .spr-wrapper{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

</style>
<svelte:window bind:scrollY={scrollY_} on:scroll={onScrollInterrupt} />

<div class="spr-wrapper">
    <div>
        <div style={ !ItWasShown ? componentSettings.style + `;transform:translate(${curveFunction(scrollY_ - trigging.y).x}px,${curveFunction(scrollY_ - trigging.y).y}px)` 
            : componentSettings.style 
        } >
            <slot/>
        </div>
    </div>
</div>