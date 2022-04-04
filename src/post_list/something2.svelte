<script>
    export let code
    export let darkmode
    export let font_mode
    import Depressful from "./depressContest.svelte"
    export let link_of_post
    import Nomal from "./nomallt.svelte"
    let caption = false
</script>
<style>
body{
    padding : 2em 2em 2em;
}
</style>
<head>

</head>
<body class ={darkmode+font_mode}>
{#if code >=1}
<div>
    <Nomal
    darkmode = {darkmode}
    fontmode = {font_mode}
    code = {code}/>
</div>
{:else if code==-1.12}
{#if caption == true }
<div>
    <Depressful
    darkmode = {darkmode}
    fontmode = {font_mode}/>
</div>
{:else}
<center>
<h2> 경고 : 우울한 내용 다수 포함되어있음 , 필요한 경우만 사용 </h2><br>
<p1> 기록 보존용임 </p1><br>
<button class= "btn btn-primary" on:click={function(){caption=true}}> 확인 </button>
</center>
{/if}
{/if}
</body>