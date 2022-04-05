<script>
    import postsk from "./postList.json"
    //import TEST_bed from "../src/TESTpost.svelte"
    export let darkmode
    export let fontmode
    export let code
    let input_text;

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
    <TEST_bed
    dark = {darkmode}
    font = {fontmode}/>
    {:else if code==4}
    <center>
        <br>
        <h1> Write Post! </h1>
        <br>
        <textarea cols = "55" row="55" bind:value = {input_text}></textarea>
        <br>
        <h3> return : </h3>
        <br>
        <input type = "search" bind:value={input_text} size="60%"><br>
        <p1> put in the json! </p1>
    </center>
    {/if}
    </body>