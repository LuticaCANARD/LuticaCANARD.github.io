<script>
    export let code
    export let darkmode
    export let font_mode
    import Depressful from "./depressContest.svelte"
    export let link_of_post
    import Nomal from "./nomallt.svelte"
</script>
<style>
body{
    padding : 2em 2em 2em;
}
</style>
<head>

</head>
<body class ={darkmode+font_mode}>
{#if code ==1}
<div>
    <Nomal
    darkmode = {darkmode}
    fontmode = {font_mode}
    code = {code}/>
</div>
{:else if code==-1.12}
<div>
    <Depressful
    darkmode = {darkmode}
    fontmode = {font_mode}/>
</div>
{/if}
</body>