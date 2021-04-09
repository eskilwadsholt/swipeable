interface SwipeOptions {
    start:number;
    target:{
        up:number;
        down:number;
        left:number;
        right:number
    };
    ratio:number;
}

enum Direction {
    Unset, None, Up, Down, Left, Right
}

export function clamp(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

export function swipeable(node, options:SwipeOptions) {
    let direction = Direction.Unset;
    let touch;
    let startX;
	let startY;
    let dragX;
    let dragY;
    let drag;
    let clampedDrag;
    let dir;
    let target;
    let dist;
    let detail;

	function handleStart(event) {
        event.stopPropagation();
        console.debug("Swipe start");

        touch = event.touches[0];
		startX = touch.pageX;
		startY = touch.pageY;

        node.dispatchEvent(new CustomEvent('swipeStart', {
			detail: { dir: "None", x: startX, y: startY }
		}));

		window.addEventListener('touchmove', handleMove);
		window.addEventListener('touchend', handleEnd);
	}

    function handleMove(event) {
        event.stopPropagation();

        touch = event.touches[0];
		dragX = touch.pageX - startX;
		dragY = touch.pageY - startY;
        dist = Math.sqrt(dragX**2 + dragY**2);

        // Determine direction if any
        if (direction == Direction.Unset) {
            if (dist > options.start) {
                if (Math.abs(dragY) > options.ratio * Math.abs(dragX)) {
                    if (dragY < 0) direction = Direction.Up;
                    else direction = Direction.Down;
                } else if (Math.abs(dragX) > options.ratio * Math.abs(dragY)) {
                    if (dragX < 0) direction = Direction.Left;
                    else direction = Direction.Right;
                } else {
                    direction = Direction.None;
                }
            }
        }

        // Prepare details if direction has been determined
        switch (direction) {
            case Direction.Up: {
                dir = "Up";
                drag = -dragY;
                target = options.target.up;
                clampedDrag = clamp(drag, 0, target);
                break;
            }
            case Direction.Down: {
                dir = "Down";
                drag = dragY;
                target = options.target.down;
                clampedDrag = clamp(drag, 0, target);
                break;
            }
            case Direction.Left: {
                dir = "Left";
                drag = -dragX;
                target = options.target.left;
                clampedDrag = clamp(drag, 0, target);
                break;
            }
            case Direction.Right: {
                dir = "Right";
                drag = dragX;
                target = options.target.right;
                clampedDrag = clamp(drag, 0, target);
                break;
            }
        }

        if (direction != Direction.Unset && direction != Direction.None) {

            // Pack details
            detail = {
                dir,
                drag,
                progress: drag / target,
                clampedDrag,
                clampedProgress: clampedDrag / target,
            }

            node.dispatchEvent(new CustomEvent("swipe" + detail.dir, { detail }));
        }
    }

    function handleEnd(event) {
        event.stopPropagation();
        direction = Direction.Unset;

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