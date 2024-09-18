<script>
    import { onMount } from "svelte"
    
    /**
    * @type {{
    *  link: string,
    *  imglink: string,
    *  desc : string,
    *  need_invert? : boolean,
    *  other_link?: boolean
    * }}
    */
    export const contactInfo = null;
    
    onMount(()=>{
        console.log(contactInfo)
    })
</script>

<style lang="scss">
    .cont_pic{
        width: 100%;
    }
    .contact_img {
        height: 80px;
    }
    .contact_warp
    {
        max-width: 80px;
        display: flex;
        width:100%;
        flex-direction: column;
        margin: 0 auto;
        justify-content: space-between;
    }
</style>

<div class="contact_warp">
    <div class="contact_img pointer">
        <a href={contactInfo.link}>
            <img 
            src={contactInfo?.other_link ? contactInfo.imglink:"https://cdn.simpleicons.org/"+contactInfo.imglink} 
            class={contactInfo?.need_invert ? "need_invert cont_pic":"cont_pic"} 
            alt={contactInfo.desc}
            />
        </a>
    </div>
    <div>
        <p1>{contactInfo.desc}</p1>
    </div>
</div>