
<script>
	let name = 'world';
	let image_test_src = "https://pbs.twimg.com/media/FOwLE96aQAAqBzU?format=jpg&name=large";
	let image_test_src_2 = "https://pbs.twimg.com/media/FOwLEJbaAAEgzcG?format=jpg&name=large";
	let testpic_list = [image_test_src,image_test_src_2]
	let buttoncount = 0;
	function change_pic(to_pic_src,id){
		to_pic_src = id;
	}
	function button_fun(){
		if (buttoncount == testpic_list.lenght){
			buttoncount = 0;
		}else{
			buttoncount++;
		}
	}

</script>

<h1> Lutica's test field!</h1>
<div id = "test">
	<img id="image_test" src={testpic_list[buttoncount]} alt="..." >
	<button on:click={button_fun}/>
</div>
