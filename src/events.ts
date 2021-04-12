interface SwipeOptions {
    /* Number of pixels before swipe is activated */
    minSwipe: number;
    /* Targets in pixels for the four swipe directions */
    target:{
        up: number;
        down: number;
        left: number;
        right: number
    };
    /* Direction is activated when moving more than ratio times the perpendicular direction */
    ratio: number;
}

interface Point {
    x: number;
    y: number;
}

type Direction = null | "Up" | "Down" | "Left" | "Right";

interface SwipeInfo {
    start: Point;
    direction: Direction;
    distance: number;
    target: number;
    dx: number;
    dy: number;
    drag: number;
    progress: number;
    clampedDrag: number;
    clampedProgress: number;
}

export function swipeable(node, options:SwipeOptions) {
    // Resuable var
    let touch;

    // State vars
    const swipe:SwipeInfo = {
        start: { x: 0, y: 0 },
        direction: null,
        distance: 0,
        target: 0,
        dx: 0,
        dy: 0,
        drag: 0,
        progress: 0,
        clampedDrag: 0,
        clampedProgress: 0,
    };

	function handleStart(event) {
        event.stopPropagation();
        event.preventDefault();
        console.debug("Swipe start");

        touch = event.touches[0];
		swipe.start.x = touch.pageX;
		swipe.start.y = touch.pageY;

        node.dispatchEvent(new CustomEvent('swipeStart', {
			detail: { ...swipe.start }
		}));

		window.addEventListener('touchmove', handleMove);
		window.addEventListener('touchend', handleEnd);
	}

    function handleMove(event) {
        event.stopPropagation();
        event.preventDefault();

        touch = event.touches[0];
		swipe.dx = touch.pageX - swipe.start.x;
		swipe.dy = touch.pageY - swipe.start.y;
        swipe.distance = Math.sqrt(swipe.dx**2 + swipe.dy**2);

        // Determine direction if any
        if (!swipe.direction && swipe.distance > options.minSwipe) {
            if (Math.abs(swipe.dy) > options.ratio * Math.abs(swipe.dx)) {
                if (swipe.dy < 0) {
                    swipe.direction = "Up";
                    swipe.target = options.target.up;
                }
                else {
                    swipe.direction = "Down";
                    swipe.target = options.target.down;
                }
            } else if (Math.abs(swipe.dx) > options.ratio * Math.abs(swipe.dy)) {
                if (swipe.dx < 0) {
                    swipe.direction = "Left";
                    swipe.target = options.target.left;
                }
                else {
                    swipe.direction = "Right";
                    swipe.target = options.target.right;
                }
            }
        }

        // Update drag variable if direction is activated
        switch (swipe.direction) {
            case "Up": {
                swipe.drag = -swipe.dy;
                break;
            }
            case "Down": {
                swipe.drag = swipe.dy;
                break;
            }
            case "Left": {
                swipe.drag = -swipe.dx;
                break;
            }
            case "Right": {
                swipe.drag = swipe.dx;
                break;
            }
        }

        // Dispatch event with swipe info if direction is activated
        if (swipe.direction) {
            // Update swipe progress vars
            swipe.progress = swipe.drag / swipe.target;
            swipe.clampedDrag = clamp(swipe.drag, 0, swipe.target);
            swipe.clampedProgress = clamp(swipe.progress, 0, 1);

            // Dispatch either swipeUp, swipeDown, swipeLeft or swipeRight based on swipe.direction
            node.dispatchEvent(new CustomEvent("swipe" + swipe.direction, { detail: swipe }));
        }
    }

    function handleEnd(event) {
        event.stopPropagation();
        event.preventDefault();

        swipe.direction = null;
        node.dispatchEvent(new CustomEvent("swipeEnd"));

        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleEnd);
    }

    node.addEventListener('touchstart', handleStart);

    return {
		destroy() {
			node.removeEventListener('touchstart', handleStart);
		}
	};
}

export function clamp(val: number, min: number, max: number): number {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}