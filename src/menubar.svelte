<script>

let menu_listsk = [
                {id : 1 , label : "Home",href : "#"},
                {id : 2 , label : "Blog",href : "#"},
                {id : 3 , label : "Posts",href : "#"},
                {id : 4, label : "Contact" , href : "#"},
                {id : 5,label : "profile" , href:"#"},
                {id : 6, label : "Other Site",href : "#"} ];   
</script>
<ul>
	{#each menu_listsk as item, i}
		<li>
			<slot item={item}></slot>
		</li>
	{/each}	
</ul>
