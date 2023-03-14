<script>
    export let params;
    let htmlText = '';
    //let metadata = params.metadata;
    import { onMount } from 'svelte';
    // 여기서 현시
    const request = new XMLHttpRequest();
    const url = '/Posts/'+params.id+'.md'; 
    // md vs html 
    let adv_applied_desc = []
    let met_token = '*^*MET*^*'
    let metadata = params.id
    let adv_token = '*^*ADV*^*'
    let get_err = false
    onMount(()=>
    {
        request.open('GET', url, true);
        request.onload = function () {
            if(request.status !=200){
                adv_applied_desc = ["ERROR! - "+request.status]
                get_err = true
                return
            }
            htmlText = request.responseText;
            let sc = htmlText.split(met_token)
            if (sc.length==1){
                adv_applied_desc = sc[0].split(adv_token)
            }
            else{
                metadata = sc[0];
                adv_applied_desc = sc[1].split(adv_token)
            }
            //console.log(sc)
        };
        request.send();
        //console.log(params.id)

    })
    import SvelteMarkdown from 'svelte-markdown'
    import 'code-prettify'
    import 'code-prettify/styles/Desert.css'
    import { Utterances } from 'utterances-svelte-component'
    import katex from 'katex'
    import 'katex/dist/katex.css'
 
</script>


<svelte:head>

    {#key metadata}
    <title>{metadata!=''?'Lutica\'s bar :: '+metadata:'Lutica\'s bar'}</title>
    {/key}
</svelte:head>
{#key params.id}
{#if params.id=='undefined' || params.id==undefined || params.id=='' || get_err==true}
<center>
    <div>
        <!--비정상적인 접근-->
        <h1>OOPS!, There is an ERROR!</h1>
        {#if get_err==true}
        <p1> {adv_applied_desc[0]}</p1>
        {/if}
    </div>
</center>
{:else}
{#key adv_applied_desc}

<div id="document" class="article_type">
    {#each adv_applied_desc as desc}
    <SvelteMarkdown source={desc} on:parsed={()=>{
        document.body.innerHTML=document.body.innerHTML.replace(/\$\$(.+?)\$\$/g, (match, p1) => {
        try {
            return katex.renderToString(p1, { displayMode: true });

        } catch {
            return match;
        }
        });
        PR.prettyPrint()
        let imgs=document.getElementsByTagName('img')
        for(let i=0; i<imgs.length; i++){
            let element = imgs[i]
            element.setAttribute('onclick','window.open(this.src, \'_blank\')')
            if (element.alt==null){
                element.setAttribute('alt','if you want to see it, please click here')
            }
            element.class+=' pointer'

        }

        
        }}/>
    <!--광고영역!-->
    <center>
        $$  $$
        광고
    </center>
    {/each}
   
</div>
{/key}
<div class="article_type">
    <div class="comment_warp">
        <center>
            <h1>COMMENT</h1>
            <p1>If you want write comment, plase login with github first.</p1>
        </center>
    </div>
    <hr>
    {#key params.id}
    <div class="comment">
    <Utterances
    repo="LuticaCANARD/LuticaCANARD.github.io"
    theme="preferred-color-scheme"
    issueTerm="COMMENTS on {params.id}"
    label="COMENT"
    crossorigin="anonymous"/>
    </div>  
    {/key}  
</div>

{/if}
{/key}
