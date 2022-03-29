
<script>
	let name = 'world';
	let image_test_src = "https://pbs.twimg.com/media/FOwLE96aQAAqBzU?format=jpg&name=large";
	let image_test_src_2 = "https://pbs.twimg.com/media/FOwLEJbaAAEgzcG?format=jpg&name=large";
	let testpic_list = [image_test_src,image_test_src_2]
	let buttoncount = 0;
	function change_pic(to_pic_src,id){
		to_pic_src = id;
	}
	function button_fun(list_of_src,count){
		if (count == list_of_src.lenght){
			count = 0;
		}else{
			count++;
		}
	}

</script>

<head>
	
</head>
<body>
	<img id="image_test" src={testpic_list[buttoncount]} alt="..." >
	<button on:click={button_fun(testpic_list,buttoncount)}/>
</body>
