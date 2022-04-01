<script  src="../post_list\postList.json" type="text/javascript">
    export let context_mode;
    export let bg_mode;
    export let font_mode;
    export let size_all;
    export let size_bar;

    let post_tree=[
    {"id" : 1 ,"name" : "something","tree" : "something.html"},
    {"id" : 2 ,"name" : "something?","tree" : "somethingj   .html"}

]
</script>

<head>
    <style>
        body {
            width : "device-width";
            height : "device-height"
        }
    </style>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>Simple Sidebar - Start Bootstrap Template</title>
    <!-- Favicon-->
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
    <!-- Core theme CSS (includes Bootstrap)-->
    <link href="../build/styles.css" rel="stylesheet"/>
</head>
<body class = {"form-control"+" "+bg_mode+font_mode} >
    <div  id = "all_wrap" >
        <div>
            {#if context_mode == "Home"}
            <div>

            </div>
            {:else if context_mode=="Contact"}
            <div>
                <center>
                    <h3>  Lutica's contact Line :  </h3>
                    <a href = "https://twitter.com/presan100"><p1> Twitter : @presan100</p1></a> <br>
                    <a href = "https://www.instagram.com/lutica_canard"><p1> instagram : @lutica_canard </p1></a>
                    </center>
            </div>
            {:else if context_mode=="Profile"}
            <div>
                <center>
                    <h1> About Lutica </h1>
                </center>
            </div>
            {:else if context_mode =="Posts"}
            <div>
                <h1> Posts</h1>
                <center>
                    {#each post_tree as post}
                    <a class ="" href = {"../src/post_list/"+post.tree}><p1></p1>{post.name}</a><br>
                    {/each}
                </center>

            </div>
            {:else}
            <div> 
                <center>
                <p1> Welcome!</p1>
                </center>
            </div>
            {/if}

        </div> 
    </div>
</body>


