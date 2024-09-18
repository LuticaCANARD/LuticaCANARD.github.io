<script>
    import { locale, locales } from 'svelte-i18n'
    
    const onChange = (e) =>{

        locale.set(e.target.value)
    }
    $: currentLocale = $locale
</script>

<select bind:value={$locale}>
    {#each $locales as locale}
    <option value={locale} selected={ currentLocale === locale }>{locale}</option>
    {/each}
</select>