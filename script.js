function forEachPixel(x0, y0, x1, y1, action) {
    x0 = Math.round(x0)
    y0 = Math.round(y0)
    x1 = Math.round(x1)
    y1 = Math.round(y1)
    const dx = x1 - x0
    const dy = y1 - y0
    action(x0, y0)
    if (dx == 0 && dy == 0) {return}
    const maxDiff = Math.max(Math.abs(dx), Math.abs(dy))
    let x = x0
    let y = y0
    for (let i = 0; i < maxDiff; i++) {
        x += dx / maxDiff
        y += dy / maxDiff
        action(x, y)
    }
}


onload = () => {
    // CANVAS
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // ПАРАМЕТРЫ
    let color = 'black'
    black_c.onclick = function() {color = 'black'}
    white_c.onclick = function() {color = 'white'}
    blue_c.onclick = function() {color = 'blue'}
    red_c.onclick = function() {color = 'red'}
    yellow_c.onclick = function() {color = 'yellow'}
    green_c.onclick = function() {color = 'green'}
    document.getElementById('color').oninput = function() {color = this.value}
    let size = 10
    document.getElementById('width').oninput = function() {size = this.value}
    let opacity = 255
    document.getElementById('opacity').oninput = function() {
        ctx.globalAlpha = this.value / 100
        opacity = Math.round(this.value * 255)
    }

    // TOOLS
    var TOOL = 'b_c'
    var Metod1 = function(x, y) {
        if (TOOL == 'b_r') {
            Brush_rect(x, y)
        }
        else if (TOOL == 'b_c') {
            Brush_circle(x, y)
        }
        else if (TOOL == 's') {
            Spray(x, y)
        }
        else if (TOOL == 'e_r') {
            Eraser_rect(x, y)
        }
        else if (TOOL == 'e_c') {
            Eraser_circle(x, y)
        }
        // else if (TOOL == 'l') {
        //     Line(x, y)
        // }
        // else if (TOOL == 'r') {
        //     Rect(x, y)
        // }
        // else if (TOOL == 'c') {
        //     Circle(x, y)
        // }
        // else if (TOOL == 'e') {
        //     Ellipse(x, y)
        // }
    }
    var Metod2 = function(x, y) {
        if (TOOL == 'l') {
            Line(x, y)
        }
        else if (TOOL == 'r') {
            Rect(x, y)
        }
        else if (TOOL == 'c') {
            Circle(x, y)
        }
        else if (TOOL == 'e') {
            Ellipse(x, y)
        }
    }

    const Brush_circle = (x, y) => {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, size / 2, 0, Math.PI * 2, false);
        ctx.fill()
        ctx.closePath()
    }
    const Brush_rect = (x, y) => {
        ctx.fillStyle = color
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
    }
    const Spray = (x, y) => {
        for (let i = 0; i < size*2; i++) {
            let offset = function() {
                let random_angle = Math.random() * (2 * Math.PI)
                let random_radius = Math.random() * size
                return {x: Math.cos(random_angle) * random_radius,
                        y: Math.sin(random_angle) * random_radius}
            }
            let Ox = x + offset.x
            let Oy = y + offset.y
            ctx.fillStyle = color
            ctx.fillRect(Ox, Oy, 1, 1)
        }
    }
    const Eraser_circle = (x, y) => {
        ctx.fillStyle = 'rgb(255, 255, 255)'
        ctx.beginPath()
        ctx.arc(x, y, size / 2, 0, Math.PI * 2, false);
        ctx.fill()
        ctx.closePath()
    }
    const Eraser_rect = (x, y) => {
        ctx.fillStyle = 'rgb(255, 255, 255)'
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
    }
    const Download_canvas = () => {
        let lnk = document.createElement('a'), e
        lnk.download = 'canvas.png'
        lnk.href = canvas.toDataURL()
        if (document.createEvent) {
            e = new MouseEvent("click", {})
            lnk.dispatchEvent(e)
        } else if (lnk.fireEvent) {
            lnk.fireEvent("onclick")
        }
    }
    const Fill = (x, y) => {
        let ImageData = ctx.createImageData(canvas.width, canvas.height)
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        let width = imageData.width
        let height = imageData.height
        let stack = [[x, y]]
        let pixel = 0
        let point = 0
        while (stack.length > 0) {
            pixel = stack.pop()
            if (pixel[0] < 0 || pixel[0] >= width) {continue}
            if (pixel[1] < 0 || pixel[1] >= height) {continue}
            point = pixel[1] * 4 * width + pixel[0] * 4 + 3
            if (imageData.data[point] != opacity && imageData.data[point] != 255 &&
               (imageData.data[point] > 255 || imageData.data[point] < 5)) {
                imageData.data[point] = opacity
                imageData.data[point - 3] = r
                imageData.data[point - 2] = g
                imageData.data[point - 1] = b

                stack.push([pixel[0] - 1, pixel[1]])
                stack.push([pixel[0] + 1, pixel[1]])
                stack.push([pixel[0], pixel[1] - 1])
                stack.push([pixel[0], pixel[1] + 1])
            }
        }
        ctx.putImageData(imageData, 0, 0)
    }
    const Pipette = () => {
    }
    const Clear = () => {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    const Line = (x, y) => {
        ctx.strokeStyle = color
        ctx.lineWidth = size
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.closePath()
    }
    const Rect = (x, y) => {
        let Ox = Math.min(x, startX)
        let Oy = Math.min(y, startY)
        let width = Math.abs(x - startX)
        let height = Math.abs(y - startY)
        ctx.strokeStyle = color
        ctx.lineWidth = size
        ctx.strokeRect(Ox, Oy, width, height)
    }
    const Circle = (x, y) => {
        let Ox = (x + startX) / 2
        let Oy = (y + startY) / 2
        let radius = Math.max(Math.abs(Ox - startX),
                              Math.abs(Oy - startY)) / 2
        ctx.strokeStyle = color
        ctx.lineWidth = size
        ctx.beginPath()
        ctx.arc(Ox, Oy, radius, 0, Math.PI * 2, false)
        ctx.stroke()
        ctx.closePath()
    }
    const Ellipse = (x, y) => {
        let Ox = Math.min(x, startX)
        let Oy = Math.min(y, startY)
        let w = Math.abs(x - startX)
        let h = Math.abs(y - startY)
        let k = .5522848,
            ox = (w / 2) * k,
            oy = (h / 2) * k,
            xe = Ox + w,
            ye = Oy + h,
            xm = Ox + w / 2,
            ym = Oy + h / 2
        ctx.strokeStyle = color
        ctx.lineWidth = size
        ctx.beginPath()
        ctx.moveTo(Ox, ym)
        ctx.bezierCurveTo(Ox, ym - oy, xm - ox, Oy, xm, Oy)
        ctx.bezierCurveTo(xm + ox, Oy, xe, ym - oy, xe, ym)
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
        ctx.bezierCurveTo(xm - ox, ye, Ox, ym + oy, Ox, ym)
        ctx.closePath()
        ctx.stroke()
    }

    // МЫШЬ
    const getMouseCoords = e => {
        const rect = canvas.getBoundingClientRect()
        return [e.clientX - rect.x, e.clientY - rect.y]
    }
    let prevX = null
    let prevY = null
    let startX = null
    let startY = null
    canvas.onmousedown = e => {
        if (e.button != 0) {return}
        [prevX, prevY] = getMouseCoords(e)
        startX = prevX
        startY = prevY
        Metod1(prevX, prevY)
    }
    onmousemove = e => {
        if (prevX === null) {return}
        [x, y] = getMouseCoords(e)
        forEachPixel(prevX, prevY, x, y, Metod1)
        prevX = x
        prevY = y
    }
    onmouseup = e => {
        if (e.button !== 0) {return}
        Metod2(prevX, prevY)
        prevX = null
        prevY = null
        startX = null
        startY = null
    }

    // КНОПКИ
    b_download.onclick = function() {
        Download_canvas()
    }
    // b_fill.onclick = function() {
    //     Fill(x, y)
    // }
    b_brush_r.onclick = function() {
        TOOL = "b_r"
    }
    b_brush_c.onclick = function() {
        TOOL = "b_c"
    }
    // b_pipette.onclick = function() {
    //     Pipette()
    // }
    // spray.onclick = function() {
    //     TOOL = "s"
    // }
    b_eraser_r.onclick = function() {
        TOOL = "e_r"
    }
    b_eraser_c.onclick = function() {
        TOOL = "e_c"
    }
    b_clear.onclick = function() {
        Clear()
    }
    line.onclick = function() {
        TOOL = "l"
    }
    rect.onclick = function() {
        TOOL = "r"
    }
    // circle.onlick = function() {
    //     TOOL = "c"
    // }
    ellipse.onclick = function() {
        TOOL = "e"
    }
}
