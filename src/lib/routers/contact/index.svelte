<script>
    import { onMount } from "svelte"
    import ContactItem from "../../components/contactItem.svelte";
    import contactInfos from "../../../assets/contacts.json";
    import { _ as i18n,isLoading } from "svelte-i18n";
    import Loading from "../../components/loading.svelte"
    import { MOBILE_MAX_WIDTH } from "../../../constants";
    import Banner from "../../../lib/components/banner.svelte"

    let innerWidth;
    let scrolling;
</script>
<style lang="scss">
    a{
        color: var(--text-color);
    }
    .contact-div{
        display: grid;
        grid-gap: 20px;
    }
    .send-email{
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
</style>
<svelte:window bind:scrollY={scrolling} bind:innerWidth={innerWidth}/>
<Banner settings={{
    img:'/img/introduce/contact.jpg',
    style:'',
    class:''
}}>
    <h1>{$i18n('contact.title')}</h1>
    <h2>{$i18n('contact.subtitle')}</h2>
</Banner>
<div class="main-class">
    <h1>
        Contact
    </h1>
    <div class="contact-div" style= {`grid-template-columns: repeat(${innerWidth > MOBILE_MAX_WIDTH ? 4 : 2}, 1fr)`}>
        {#each contactInfos['body'] as contact }
            <ContactItem contactInfo={contact}/>
        {/each}
    </div>
    {#if $isLoading}
        <Loading />
    {:else}
    <div class="send-email">
        <a href="mailto:presan100@gmail.com" class="linknone">
            <h2>{$i18n('contact.toemail')}</h2>
        </a>
    </div>
    {/if}


</div>