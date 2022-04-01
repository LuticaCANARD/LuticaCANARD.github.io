<script>
    export let context_mode;
    export let bg_mode;
    export let font_mode;
    export let size_all;
    export let size_bar;
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
            {else if context_mode =="Posts"}
            <div>
                
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


