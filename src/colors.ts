const vals = "579BD".split('');
const colors:Color[] = [];

interface Color {
    R: string;
    G: string;
    B: string;
}

vals.forEach(R => {
    vals.forEach(G => {
        vals.forEach(B => {
            colors.push({ R, G, B });
        })
    })
})

shuffle(colors);

export function randColor(): Color {
    if (colors.length > 0) return colors.pop();
    return anyColor();
}

function shuffle(arr:Array<any>) {
    for (let i=arr.length - 1; i>0; i--) {
        const j = randInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function anyColor(): Color {
    const color:Color = {
        R: vals[randInt(vals.length)],
        G: vals[randInt(vals.length)],
        B: vals[randInt(vals.length)],
    }
    return color;
}

function randInt(max:number):number {
    return Math.floor(Math.random() * max);
}