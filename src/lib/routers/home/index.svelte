<script>
    import Banner from "../../../lib/components/banner.svelte"
    import { _  as i18n,isLoading } from 'svelte-i18n'

</script>

<div>
    <Banner settings={{
        img:'/img/welcome.png',
        style:'',
        class:'',
        height: 550
    }}>
        <h1>{$i18n('landing.title')}</h1>
        <h2>{$i18n('landing.subtitle')}</h2>
    </Banner>
</div>