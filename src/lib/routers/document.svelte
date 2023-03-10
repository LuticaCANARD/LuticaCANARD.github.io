<script>
    export let params;
    let htmlText = '' 
    import { onMount } from 'svelte';
    // 여기서 현시
    const request = new XMLHttpRequest();
    const url = '/Posts/'+params.id+'.md'; 
    // md vs html 
    let metadata = ''
    let adv_applied_desc = []
    let met_token = '*^*MET*^*'
    let adv_token = '*^*ADV*^*'
    onMount(()=>
    {
        request.open('GET', url, true);
        request.onload = function () {
            if(request.status !=200){
                adv_applied_desc = ["ERROR! - "+request.status]
                return
            }
            htmlText = request.responseText;
            let sc = htmlText.split(met_token)
            metadata = sc[0]
            //console.log(sc)
            adv_applied_desc = sc[1].split(adv_token)
        };
        request.send();
        //console.log(params.id)

    })
    import SvelteMarkdown from 'svelte-markdown'
    import 'code-prettify'
    import 'code-prettify/styles/Desert.css'
</script>

<svelte:head>

    {#key metadata}
    <title>{metadata!=''?'Lutica\'s bar :: '+metadata:'Lutica\'s bar'}</title>
    {/key}
</svelte:head>
{#if params.id=='undefined' || params.id==undefined || params.id==''}
<center>
    <div>
        <!--비정상적인 접근-->
        <h1>OOPS!, There is an ERROR!</h1>
    </div>
</center>
{:else}
{#key adv_applied_desc}

<div id="document" class="article_type">
    <div>
        <h1>
        {metadata}
        </h1>
    </div>
    {#each adv_applied_desc as desc}
    <SvelteMarkdown source={desc} on:parsed={()=>{
        PR.prettyPrint()
        let imgs=document.getElementsByTagName('img')

        for(let i=0; i<imgs.length; i++){
            let element = imgs[i]
            element.setAttribute('onclick','window.open(this.src, \'_blank\')')

        }
        
        }}></SvelteMarkdown>
    <!--광고영역!-->
    <center>
        광고
    </center>
    {/each}
</div>
{/key}
{/if}