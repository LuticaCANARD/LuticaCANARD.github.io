
<script>
let scrolling;
</script>
<style>
	.Cbox{
		box-sizing:content-box;
		width: auto;
		height: 200px;
		background-color: black;


	}
	.formal{
	background-color: black;
	color :antiquewhite;
}

</style>
<svelte:window bind:scrollY={scrolling}></svelte:window>

{#if scrolling<=200}
 <!-- 스크롤이 덜 된경우 => propic으로 -->	
<!--img style=""--> 
<div   class="Cbox">
	<div class = "formal">
		<p1 class="formal"> Lutica's field</p1>
	</div>
</div>

{:else}
<!-- 스크롤이 다 된 경우 Layout으로-->

{/if}	

