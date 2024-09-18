<script>
    import { onMount } from 'svelte';
    import { _ as i18n,isLoading } from 'svelte-i18n'
    import { darkMode } from '../../store.js'
    const setDarkMode = () => {
        darkMode.update((value) => !value)
    }
    onMount(() => {
        darkMode.subscribe((val)=>{

        })
    })
</script>

<style lang="scss">

</style>

<div>
    <button on:click={setDarkMode}>{$i18n('settings.darkMode')}</button>
</div>