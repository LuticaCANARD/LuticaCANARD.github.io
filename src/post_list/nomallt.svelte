<script>
    import postsk from "./postList.json"
    export let darkmode
    export let fontmode
    export let code
    </script> 
    <head>
    </head>
    <body class={darkmode+fontmode}>
    <hr>
    {#if code == 1}
    {#each postsk['post_nomal'] as post}

    <center>
       <strong> <h3> {post['title']} </h3></strong>
        </center>
        <p1> {@html post['context']} </p1>
        <hr>
    {/each}
    {:else if code == 2}
    {#each postsk['post_tech'] as post}
    <center>
        <strong><h3> {post['title']} </h3></strong>
    </center>
    <p1> {@html post['context']} </p1>
    <hr>
    {/each}
    {:else if code==3}
    
    {/if}
    </body>