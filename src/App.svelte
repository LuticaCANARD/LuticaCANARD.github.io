
<script>
let scrolling;
let toolbar_on= false;
let bar_width =0;
function open_close_toolbar(){
	if(toolbar_on==false){
		// open tool bar
		return{
			css : t=>{
				return
				width : 0;
			}
		}
	}else{
		//close tool bar
	}
}
const toolbar_menu = [
	{label : "logo",href : "#",onclick : {}},
	{label : "menu",href : "# "},
	{label : "post",href : "#"},
	{label : "About", href : "#" },
	{label : "contect", href : "#"}
]
</script>

<style type="text/scss">
	.Cbox{
	position: absolute;
	top: 0px;
	left: 0;
	width: 100%;
	bottom: 1500px;
	height: 1500px;
	background-color: black;
	}
	.Cbox .formal{
	padding-left: 50%;
	padding-top: 10%;
	color :antiquewhite;
	font-size: large;
	}
	.foreground {
		position: absolute;
		top: 3000px;
		left: 0;
		bottom:3200px;
		width: 100%;	
		height: 200px;
		background-color: rgb(0, 0, 0);
		color: white;
		padding: 0% 0% 0% 0%;
	}
	.foreground .text{
		padding: 0% 0% 0% 50%;
		font-size: large;
	}
	 .runch{
		left : 20%;
		bottom : 30%;
		width :auto;
		height : auto;
		position: absolute;
		padding-left: 50%;
		padding-top:10%;
		color : red
	}
	.main_set{
		position: absolute;
		top : 1500px;
		left : 0px;
		right: 100%;
		bottom: 3000px;
		width : 100%;
		height: 1500px;
		color: antiquewhite;
		background-color: goldenrod;
	}
	.main_set .textofmain{
		top:50%;
		left : 50%;
		right : calc(50% + 100px);
		width: 100%;
		height: 10%;
		padding-left: 50%;
		padding-top: 50%;
	}
	.toolbar{
		position: sticky;
		top : 50%;
		left :0;
		width: {bar_width} ;
	}

</style>
<svelte:window bind:scrollY={scrolling}></svelte:window>


 <!-- 스크롤이 덜 된경우 => propic으로 -->	
<!--img style=""--> 
<div   class="Cbox">
	<div class = "formal">
		<p1> Lutica's field</p1>
	</div>
</div>



<!-- 스크롤이 다 된 경우 Layout으로-->
<div class= "runch">
	<p1> Runch </p1>
</div>

<div class = "main_set">

	<p1 class="textofmain">this is main</p1>

</div>
{#if toolbar_on==true}
<div class = "toolbar">
	<button on:click={open_close_toolbar()}> toolbar</button>
</div>
{/if}

<div class="foreground">
	<br><br><br>
	<p1 class = "text"> twitter : @presan100 </p1>
	<p1 class = "text">scrolled : {scrolling}</p1>

</div>

