<script>

    export let stack;
    let is_desc = false;
    let hovered = null;
</script>
<div on:mouseover={()=>{hovered=true}} class= {hovered==null?"stack_init":"stack"} on:click={()=>{is_desc = !is_desc}}>
    <div class={is_desc?"card_show":"card_back"}>
        <div class="card_name">
            <h4>{stack.name}</h4>
        </div>
    </div>
    <div class={is_desc?"card_back":"card_show"}>
        <img src={"https://cdn.simpleicons.org/"+stack.name+"/"+stack.color} class={stack?.need_invert?"stack_image need_invert":"stack_image"} alt={stack.name}>
    </div>
</div>
