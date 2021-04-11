<script lang="ts">
    import { randColor } from "./colors";    

    const { R, G, B } = randColor();
    const color = `#${R}${G}${B}4`;
</script>

<page style={`background:${color}`}>
    <div class="title">
        Color Page
    </div>
    <div class="color-code">{color}</div>
    <slot></slot>
</page>

<style>
    .title {
        font-size: 1.3em;
        color: black;
    }

    page {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 30px;
        width: 100%;
        height: 100%;
        border: 2px solid #555;
    }
</style>