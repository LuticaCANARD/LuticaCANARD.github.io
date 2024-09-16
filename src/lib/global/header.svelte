<script>
    import { darkmode } from '../../store.js';
    import { onMount } from 'svelte';
    import ko from '../../i18n/ko.json';
</script>
<style lang="scss">
    header {
        background: #171718;
        color: white;
        padding: 1rem;
        text-align: center;
        font-size: 1.5rem;
    }
    header div {
        display: inline-block;
    }
    header div:hover {
        cursor: pointer;

    }

</style>
<header>
    <div>
        Lutica
    </div>
</header>