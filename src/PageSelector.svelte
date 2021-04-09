<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { swipeable, clamp } from "./events";
    
    const dispatch = createEventDispatcher();

    export let pages;
    export let ID;

    let currentPage = 0;
    let drag = 0;
    let newPage = currentPage;
    let dragging = false;

    const swipeOptions = {
		start: 15,
		target: {
			up: 150,
			down: 70,
			left: 80,
			right: 80,
		},
		ratio: 2,
	}

    function handleSwipeLeft(e) {
        dragging = true;
        newPage = clamp(currentPage + Math.round(e.detail.clampedProgress), 0, pages.length - 1);
        drag = -e.detail.drag;
        console.debug(`${ID}: ${JSON.stringify(e.detail)}`);
    }

    function handleSwipeRight(e) {
        dragging = true;
        newPage = clamp(currentPage - Math.round(e.detail.clampedProgress), 0, pages.length - 1);
        drag = e.detail.drag;
        console.debug(`${ID}: ${JSON.stringify(e.detail)}`);
    }

    function handeSwipeEnd(e) {
        dispatch("forwardEnd");
        dragging = false;
        currentPage = newPage;
        drag = 0;
    }

    function handleSwipeUp(e) {
        dispatch("forwardUp", { ...e.detail });
        console.debug(`${ID}: ${JSON.stringify(e.detail)}`);
    }
</script>

<main
    class:dragging
    use:swipeable={swipeOptions}
    on:swipeLeft={handleSwipeLeft}
    on:swipeRight={handleSwipeRight}
    on:swipeEnd={handeSwipeEnd}
    on:swipeUp={handleSwipeUp}
    >
    <div class="progress-bar">
        {#each pages as _, i}
            <div class="ball" class:selected={i == newPage}></div>
        {/each}
    </div>
    {#each pages as page, i}
        <div class="page" style={`left:calc(${(i - currentPage) * 100}% + ${drag}px)`}>
            <svelte:component this={page} on:forwardUp={handleSwipeUp} on:forwardEnd={handeSwipeEnd}/>
        </div>
    {/each}
</main>

<style>
    main {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #8884;
        border: 2px solid #333;
    }

    .page {
        position: absolute;
        width: 100%;
        height: 100%;
        transition: 200ms;
    }

    .dragging .page {
        transition: none;
    }

    .progress-bar {
        position: absolute;
        left: 50%;
        display: flex;
        height: 20px;
        transform: translate(-50%);
        z-index: 1;
    }

    .ball {
        width: 12px;
        height: 12px;
        background: #555;
        border-radius: 50%;
        margin: 4px;
    }

    .ball.selected {
        background: #333;
    }
</style>