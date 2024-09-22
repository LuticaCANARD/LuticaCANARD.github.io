<script>
    import Banner from '../../../../lib/components/banner.svelte'
    import { _ as i18n,isLoading } from 'svelte-i18n'

</script>
<style lang="scss">

</style>    

<div>
    <Banner settings={{
        img:'/img/introduce/network.png',
        style:'',
        class:''
    }}>
        <h1>{$i18n('about.network.title')}</h1>
        <h2>{$i18n('about.network.subtitle')}</h2>
    </Banner>
    <div class="main-class">
        <div class="content-desc">
            <h2>{$i18n('about.network.p1.title')}</h2>
            <p1>{$i18n('about.network.p1.content')}</p1>
        </div>
        <div class="content-desc">
            <h2>{$i18n('about.network.p2.title')}</h2>
            <p1>{$i18n('about.network.p2.content1')}</p1>
            <br>
            <p1>{$i18n('about.network.p2.content2')}</p1>
        </div>
        <div class="content-desc">
            <h2>{$i18n('about.network.p3.title')}</h2>
            <p1>{$i18n('about.network.p3.content1')}</p1>
            <br>
            <p1>{$i18n('about.network.p3.content2')}</p1>
        </div>
    </div>
</div>