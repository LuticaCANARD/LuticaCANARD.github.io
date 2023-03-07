<script>

    export let tact;

</script>

<div class="contact_warp">
    <div class="contact_img pointer">
        <a href={tact.link}>
            <img src={tact?.otherlink?tact.imglink:"https://cdn.simpleicons.org/"+tact.imglink} class={tact?.need_invert?"need_invert cont_pic":"cont_pic"}/>
        </a>
    </div>
    <div>
        <p1>{tact.desc}</p1>
    </div>
</div>