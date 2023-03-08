<script>
    export let params;
    let htmlText = '' 
    import { onMount } from 'svelte';
    // 여기서 현시
    const request = new XMLHttpRequest();
    const url = '/posts/'+params.id+'.html'; 
    // md vs html 
    onMount(()=>
    {
        request.open('GET', url, true);
        request.onload = function () {
            htmlText = request.responseText;
        };
        request.send();

    })
   
</script>
<!--token : *^*MET*^*-->

<!--token : *^*ADV*^*-->
<div id="document" class="article_type">
    {@html htmlText}
</div>