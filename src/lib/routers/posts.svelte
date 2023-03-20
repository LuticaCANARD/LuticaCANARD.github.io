<script>
import postarray from '../../assets/posts.json'
import BigCartegoryCard from '../sub-lib/postcards/bigcategory.svelte'
let scy = 0;
let inner_height = 0;
let card;
let posts_postion = 0;
var posts_object;
/*/ 여기서 제어.
// postarray : {
// "대 분류" :[
//      "소분류"
//]
//}*/
//let postarray = import.meta.glob('/Posts')
let bigcar_open = false;
</script>
<svelte:window bind:scrollY={scy} bind:innerHeight={inner_height}/>
<!--대분류 !-->
<div id="posts" bind:clientHeight={posts_postion} bind:this={posts_object}>

    {#each Object.keys(postarray) as _dist} 
        <BigCartegoryCard big_car={postarray[_dist]} name={_dist}/>
    {/each}
</div>

<!-- innerHeight를 조사해서 위치가 그 안이면 처음에 렌더링, 그 이후면 scroll Y를 조사하여 그값에 다다르면 업데이트 한다.-->
