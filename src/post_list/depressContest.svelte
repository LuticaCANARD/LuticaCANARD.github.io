<script>
export let darkmode
export let fontmode
import postsk from "./dppo.json"
</script> 
<head>
</head>
<body class={darkmode+fontmode}>
{#each postsk['post'] as Ddairy}
<hr>
<center>
    <h3> {Ddairy['time']}</h3>
</center>
<p1>{@html Ddairy['context']}</p1>
<br>
{/each}
</body>