
<script>
    export let MainbarArray;
    export var changename;
    export let mobiletag;
    let scys;
</script>
<svelte:window bind:scrollY = {scys} />
<div class="navbar dark-mode-toolbar" style={scys<=15?"position:relative":"position:fixed"}>
    <div style="width: 27%;text-align: center;padding-top: 0px;" on:click={changename('')} >
        <h3 style="margin-top:10px">Lutica's bar</h3></div>
    <div class="container" >
    {#each MainbarArray as datak}
        <il class="navitem"  >
           <div style ='text-decoration:none; width:100%;height:100%;margin-top:0px' on:click={()=>{location.href="/#/"+datak.link}}  class="pointer">
                <div style="padding-top:calc(50% - 2em);">
                    <p1>
                    {datak.name}
                    </p1>
                </div>
            </div>
        </il>
    {/each}
    </div>
</div>

<div class="mobile_navbar dark-mode-toolbar" style={scys<=15?"position:relative":"position:fixed"}>
    {#if mobiletag==true}
    <div on:click={()=>mobiletag=false} style="width: 20%;text-align: center;padding-top: 10px;">OFF</div>
    <div class="container_m">
    {#each MainbarArray as datak}
        <il class="navitem_m">
            <div on:click={changename(datak.link)} style ='text-decoration:none; width:100%;height:30px; padding-top:10px' class="pointer"> <p1>
                {datak.name}
            </p1></div>
        </il>
    {/each}
    </div>
    {:else}
    <div on:click={()=>mobiletag=true} style="width: 20%;text-align: center;padding-top: 10px;">ON</div>
    {/if}
</div>