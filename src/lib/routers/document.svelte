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
    import { Utterances } from 'utterances-svelte-component'    
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
            element.setAttribute('alt','if you want to see it, please click here')

        }
        
        }}></SvelteMarkdown>
    <!--광고영역!-->
    <center>
        광고
    </center>
    {/each}
   
</div>
{/key}
<div class="article_type">
    <div class="comment_warp">
        <center><h1>COMENT<h1></center>
        <p1>If you want write comment, plase login with github first please</p1>
    </div>
    <hr>
    {#key metadata}
    <div class="comment">
        { metadata}
    <Utterances
    repo="LuticaCANARD/LuticaCANARD.github.io"
    theme="preferred-color-scheme"
    issueTerm="COMMENTS on {metadata}"
    label="COMENT"
    crossorigin="anonymous"/>
    </div>  
    {/key}  
</div>

{/if}
