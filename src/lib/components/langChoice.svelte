<script>
    import { onMount } from 'svelte'
    import { locale, locales,isLoading } from 'svelte-i18n'
    const onChange = (e) =>{
        locale.set(e.target.value)
    }
    $: currentLocale = $locale
    onMount(()=>{
        locale.subscribe((val)=>{
            currentLocale = val.slice(0,2)
        })
        
    })
</script>

<div>
{#key currentLocale}
<select bind:value={$locale}>
    {#each $locales as locale}
    {#if locale === currentLocale}
    <option value={locale} selected>{locale}</option>

    {:else}
    <option value={locale} selected={ currentLocale === locale }>{locale}</option>
    {/if}
    {/each}
</select>
{/key}
</div>