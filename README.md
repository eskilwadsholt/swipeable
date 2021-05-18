# Swipeable (touch devices only)
This project is showcasing how to apply an event factory to a Svelte-component in order to control swipe events and event forwarding better.

## Demo
Here is a screenshot of a [live demo on Netlify](https://swipeable.netlify.app/)

<p align=center>
    <img src="./screenshots/screenshot1small.png" alt="Screenshot from Swipeable Mobile app">
</p>

## How it works
The swipeable event factory is found in the file [events.ts](./src/events.ts).

### Apply to Svelte component
To apply the swipeable events `swipeStart`, `swipeEnd`, `swipeLeft`, `swipeRight`, `swipeUp`, and `swipeDown` to a Svelte component, one must first import it inside the script tags:
```typescript
<script lang="ts">
    import { swipeable } from "./events";

    const swipeOptions = {
        minSwipe: 15,
        target: {
            up: 80,
            down: 80,
            left: 80,
            right: 80,
        },
        ratio: 3,
    }
    ...
    function handleSwipeStart(event) {
        // add your own code
    }
<script>
```
and then apply to an JSX element using the `use` keyword from Svelte like so:
```Svelte
<SomeComponent use:swipeable={swipeOptions} on:swipeStart={handleSwipeStart}>
    ...
</SomeComponent>
```

### Swipe options and event details

swipeOptions | Description
`minSwipe` | The minimum distance in pixels before on of the four directional swipeevents `swipeX` for `X=Up,Down,Left,Right` is potentially activated. Note that `ratio` also plays in
`target` | Sets how many pixels in each of the four directions `up,down,left,right` is the target distance to fully activate the swipe in the given direction
`ratio` | This sets the ratio between swiping vertically and swiping horizontally needed to activate one of the four swipe directions. If for instance `ratio=3`, this means that one must swipe 3 times as many pixels sideways as up-down to active a left or a right swipe

