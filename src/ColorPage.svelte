<script lang="ts">
    function randInt(max:number):number {
        return Math.floor(Math.random() * max);
    }

    let R = 80 + randInt(150);
    let G = 80 + randInt(150);
    let B = 80 + randInt(150);

    const color = `rgba(${R},${G},${B},0.3)`;
</script>

<page style={`background:${color}`}>
    <div class="title">
        Color Page
    </div>
    <slot></slot>
</page>

<style>
    .title {
        color: black;
    }

    page {
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