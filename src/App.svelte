
<script>

import { onMount } from 'svelte';
import Router from 'svelte-spa-router';
import Header from './lib/global/header.svelte';
import routes from './lib/routers/route.js';
import Footer from './lib/global/footer.svelte';
import { _  as i18,isLoading } from 'svelte-i18n'
import { params } from "svelte-spa-router";
import { appInit } from './init.js';
import { routePath } from './store.js';
appInit();
onMount(() => {
    
});

</script>
<svelte:head>
    <title>{$i18('tab-name')}</title>
</svelte:head>
{#if $isLoading === true}
    <div>
        <p1>Loading...</p1>
    </div>
{:else}
    <Header/>
    <main>
        <Router 
            routes={routes}
            on:routeLoaded={(e) => {
                $routePath = (e.detail.location)
            }}
        />
    </main>
    <Footer/>
{/if}
