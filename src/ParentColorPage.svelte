<script>
    import ColorPage from "./ColorPage.svelte";
    import PageSelector from "./PageSelector.svelte";
</script>


<ColorPage>
    <div class="subpages">
        <PageSelector on:swipeUp on:swipeEnd
            ID="small PageSelector"
            pages={[
            ColorPage, ColorPage
        ]}/>
    </div>
</ColorPage>

<style>
    .subpages {
        display: flex;
        width: 60%;
        height: 60%;
    }
</style>