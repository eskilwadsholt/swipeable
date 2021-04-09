<script lang="ts">
import ColorPage from "./ColorPage.svelte";
import PageSelector from "./PageSelector.svelte";
import ParentColorPage from "./ParentColorPage.svelte";

let activated = false;

let height = 0;
let percent = "0%";

function handleForwardUp(e) {
	activated = true;
	height = e.detail.clampedDrag;
	percent = (e.detail.clampedProgress * 100).toFixed(0) + "%";
}

function handleForwardEnd(e) {
	activated = false;
	height = 0;
	percent = "0%";
}
</script>

<main>
	<PageSelector on:forwardUp={handleForwardUp} on:forwardEnd={handleForwardEnd} ID="outer" pages={[
		ParentColorPage, ColorPage, ColorPage
		]}/>
	<div class="overlay" class:activated style={`height:${height}px`}>
		Swipe Up {percent}
	</div>
</main>

<style>
	.overlay {
		position: fixed;
		width: 100%;
		bottom: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 2em;
		background: #FFFA;
		color: black;
		visibility: hidden;
		z-index: 10;
	}

	.activated {
		visibility: visible;
	}

	main {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 375px;
		height: 545px;
		background: #666;
		color: #FFF;
		box-shadow: 0 0 5px #FFF;
		overflow: hidden;
	}
</style>