
<script>
    let MainbarArray = [
        {name:'profile',link:'Profile'},
        {name:'posts',link:'Posts'},
        {name:'webasm',link:'webasm'}
    ]
    import { darkmode } from '../store.js';
    let darkmode_on=window.matchMedia('(prefers-color-scheme: dark)').matches;
    darkmode.subscribe((darkmode) => {if(darkmode != null)darkmode_on = darkmode})
    function darkmode_toggle() {
        darkmode_on = !darkmode_on
        darkmode.update(data=>darkmode_on)
    }
    let mobiletag = false;
    let scys;
</script>
<svelte:window bind:scrollY = {scys} />
<div class="navbar dark-mode-toolbar" style={scys<=15?"position:relative":"position:fixed;top:0;"}>
    <div on:click={()=>{location.href="/#/"}} style="width: 27%;text-align: center;padding-top: 0px;" class="pointer">
        <h3 style="margin-top:10px">Lutica's bar</h3></div>
    <div class="container" >
        <il class="navitem"  >
            <div style ='text-decoration:none; width:100%;height:100%;margin-top:0px' on:click={()=>{darkmode_toggle()}}  class="pointer">
                <div style="padding-top:calc(50% - 2em);">
                    <p1>
                    mode
                    </p1>
                </div>
            </div>
        </il>
    {#each MainbarArray as menu}
        <il class="navitem"  >
           <div style ='text-decoration:none; width:100%;height:100%;margin-top:0px' on:click={()=>{location.href="/#/"+menu.link}}  class="pointer">
                <div style="padding-top:calc(50% - 2em);">
                    <p1>
                    {menu.name}
                    </p1>
                </div>
            </div>
        </il>
    {/each}
    </div>
</div>

<div class="mobile_navbar dark-mode-toolbar" style={scys<1?"position:relative":"position:fixed;top:0;"}>
    {#if mobiletag==true}
    <div on:click={()=>mobiletag=false} class="pointer" style="width: 20%;text-align: center;padding-top: 10px;">OFF</div>
    <div class="container_m">
        <il style="height:100px;border-bottom:1px gray solid" >
            <div class="navitem_m" style="display:flex"  on:click={()=>{darkmode_toggle()}}>
                <p1 style="margin:auto">
                change mode
                </p1>
            </div>
        </il>
    {#each MainbarArray as menu}
        <il class="navitem_m">
            <div on:click={()=>{mobiletag = false;location.href="/#/"+menu.link}} style ='text-decoration:none; width:100%;height:30px; padding-top:10px' class="pointer"> <p1>
                {menu.name}
            </p1></div>
        </il>
    {/each}
    <il>

    </il>
    </div>
    {:else}
    <div on:click={()=>mobiletag=true} class="pointer mu_off" style="width: 20%;text-align: center;padding-top: 10px;">ON</div>
    {/if}
</div>