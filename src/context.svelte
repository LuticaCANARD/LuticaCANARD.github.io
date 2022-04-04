<script  src="../post_list\postList.json" type="text/javascript">
    export let context_mode = "Home";
    export let bg_mode;
    export let font_mode;
    export let size_all;
    export let size_bar;
    let readmode = false;

    let post_tree=[
    {"id" : 1 ,"name" : "something","tree" : "something.html","time" : "2022.04.01", "readmode" : false},
    {"id" : 2 ,"name" : "something?","tree" : "something2.svelte","time" : "2022.04.01","readmode" : false}]
    let SNSs = 
        [{"SNS_name": "Twitter : @presan100", "href" : "https://twitter.com/presan100"},
        {"SNS_name": "Instargram : @presan100", "href" : "https://www.instagram.com/lutica_canard"},
        {"SNS_name": "Github : LuticaCANARD ", "href" : "https://github.com/LuticaCANARD"}]
    import Page1 from"./post_list/something2.svelte"
    let code_on =1;
    const code_list = ["nomal post","tech post","test post"]
    const code_book = {"nomal post" :1,"tech post":2,"test post":3}

</script>
<style>
.Lutica_post{
    padding : 5em 5em 5em 5em;
    margin : 3em 3em 3em 3em;
    margin-right : 3em ;
}

</style>

<head>
    <style>
        body {
            width : "device-width";
            height : "device-height"
        }
        table {
    width: 100%;
    border: 1px solid #444444;
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
<body class = {bg_mode+font_mode} >
    <div  id = "all_wrap" >
        <div>
            {#if context_mode == "Home"}
            <center>
            <div><br>
                <b><h1> Welcome to my field!</h1></b><br>
                <br><p1>Here is my playground for learning svelte! a static blog, by GitHub.io</p1>
                <br><p1> I used <a href = "https://startbootstrap.com/template/simple-sidebar">this template</a></p1>
            </div></center>
            {:else if context_mode=="Contact"}
            <div>
                <center>
                    <h3>  Lutica's contact Line :  </h3>
                    <ul class="ul">
                    {#each SNSs as SNSone}
                    <il class = "il"><a href = {SNSone.href}><p1 class = ""> {SNSone.SNS_name}</p1></a></il> <br>
                    {/each}
                    </ul>
                    </center>
            </div>
            {:else if context_mode=="Profile"}
            <div>
                <center>
                    <br>
                    <h2> About Lutica </h2>
                    <br>
                    <img width = "50%" height = "50%"src = "../src/KakaoTalk_20220322_200232462.png">
                    <br>
                    <hr>
                    <p1 class = "p-1"> 
                        I was studied Railroad engineering<br>I'm working on Game company.<br>I'm seeking VRgame develop<br><hr> 
                     </p1>

                </center>
            </div>
            {:else if context_mode =="Posts"}
            <div>
            <center>
                <br><h1> Posts <br></h1><br>
                {#each code_list as codenate}
                <button id="change_button" type="button" class="btn btn-outline-primary" on:click = {()=>code_on = code_book[codenate]} href ="#">{codenate}</button> 
                {/each}
            </center>
            <Page1
            code = {code_on}
            darkmode = {bg_mode}
            font_mode = {font_mode}
            />

            </div>
            {:else}
            <div> <br>
                <center>
                <p1> Welcome! , Buildeing in progress</p1>
                </center>
            </div>
            {/if}

        </div> 
    </div>
</body>


