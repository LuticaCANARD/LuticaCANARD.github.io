<script>
    export let post
    let htmlText = '' 
    import { onMount } from 'svelte';

    const request = new XMLHttpRequest();
    let join_url = window.location.href 
    const url = join_url+'/posts/'+post.postlink+'.html'; 
    onMount(()=>
    {
        request.open('GET', url, true);
        request.onload = function () {
            htmlText = request.responseText;
        };
        request.send();
    })
   
</script>
<div id="document" class="article_type">
    {@html htmlText}
</div>