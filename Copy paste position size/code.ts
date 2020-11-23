function absoluteX(layer) {
    return layer.absoluteTransform[0][2]
}

function absoluteY(layer) {
    return layer.absoluteTransform[1][2]
}

function setData(node: SceneNode) {

    let br = getBoundingRect([node])
    root.setPluginData("AbsX", String(br.x))
    root.setPluginData("AbsY", String(br.y))
    root.setPluginData("RelativeX",String(node.x))
    root.setPluginData("RelativeY",String(node.y))
    root.setPluginData("AbsX2", String(br.x2))
    root.setPluginData("AbsY2", String(br.y2))
    root.setPluginData("width", String(selectedItems[0].width))
    root.setPluginData("height", String(selectedItems[0].height))
    console.log("y2 = " + br.y2)
    console.log("y1 = " + br.y)
}

let selectedItems = figma.currentPage.selection
let root = figma.root;
if (selectedItems.length == 0) {
    figma.closePlugin('No object selected.')
}

if (figma.command == 'copy') {

    if (selectedItems.length > 1) {
        // Clone everything into a temporary group 
        var tempNodes = []
        selectedItems.forEach(element => {
            let newNode = element.clone()
            newNode.x = absoluteX(element)
            newNode.y = absoluteY(element)
            tempNodes.push(newNode)
        });

        let tempGroup = figma.group(tempNodes, tempNodes[0].parent)
        setData(tempGroup)
        tempGroup.remove()
        figma.closePlugin('Copy Success!(Combined Layers)')

    } else if (selectedItems[0].absoluteTransform[0][0] != 1 || selectedItems[0].absoluteTransform[1][1] != 1) {
        setData(selectedItems[0])
        figma.closePlugin('Copy Success!(Transformed Layer) ')
    }
    else {
        setData(selectedItems[0])
        figma.closePlugin('Copy Success!')
    }

}

if (figma.command == 'pastePosition') {

    const x = + root.getPluginData("AbsX")
    const y = + root.getPluginData("AbsY")
    selectedItems.forEach(element => {
        let rect = getBoundingRect([element])
        let elementX = rect.x
        let elementY = rect.y
        element.x += x - absoluteX(element) + (absoluteX(element) - elementX)
        element.y += y - absoluteY(element) + (absoluteY(element) - elementY)
    });
    figma.closePlugin('Position Pasted!')
}

if (figma.command == 'pasteRP') {

    const x = + root.getPluginData("RelativeX")
    const y = + root.getPluginData("RelativeY")
    selectedItems.forEach(element => {
        element.x = x
        element.y = y
    });
    figma.closePlugin('Relative Position Pasted!')
}

if (figma.command == 'pasteX') {
    const x = + root.getPluginData("AbsX")
    selectedItems.forEach(element => {
        let elementX = getBoundingRect([element]).x
        element.x += x - absoluteX(element) + (absoluteX(element) - elementX)
    });
    figma.closePlugin('X Pasted!')
}

if (figma.command == 'pasteY') {
    const y = + root.getPluginData("AbsY")
    selectedItems.forEach(element => {
        let elementY = getBoundingRect([element]).y
        element.y += y - absoluteY(element) + (absoluteY(element) - elementY)
    });
    figma.closePlugin('Y Pasted!')
}

if (figma.command == 'pasteRX') {
    const x = + root.getPluginData("RelativeX")
    selectedItems.forEach(element => {
        element.x = x
    });
    figma.closePlugin('Relative X Pasted!')
}

if (figma.command == 'pasteRY') {
    const y = + root.getPluginData("RelativeY")
    selectedItems.forEach(element => {
        element.y = y
    });
    figma.closePlugin('Relative Y Pasted!')
}

if (figma.command == 'pasteVC') {
    const y2 = +root.getPluginData("AbsY2")
    const y1 = +root.getPluginData("AbsY")

    const centerY = y1 + ((y2 - y1) / 2)

    selectedItems.forEach(element => {
        let rect = getBoundingRect([element])
        let elementHeight = rect.height
        let elementY = rect.y
        element.y += (centerY - (elementHeight / 2)) - absoluteY(element) + (absoluteY(element) - elementY)
    });
    figma.closePlugin('Vertical Center Pasted!')
}

if (figma.command == 'pasteHC') {
    const x2 = +root.getPluginData("AbsX2")
    const x1 = +root.getPluginData("AbsX")

    const centerX = x1 + ((x2 - x1) / 2)

    selectedItems.forEach(element => {
        let rect = getBoundingRect([element])
        let elementWidth = rect.width
        let elementX = rect.x
        element.x += (centerX - (elementWidth / 2)) - absoluteX(element) + (absoluteX(element) - elementX)
    });
    figma.closePlugin('Horizontal Center Pasted!')
}
if (figma.command == 'pasteSize') {
    const w = + root.getPluginData("width")
    const h = + root.getPluginData("height")

    selectedItems.forEach(element => {
        if (w <= 0.1) { figma.closePlugin("width must be >= 0.01"); return }
        if (h <= 0.1) { figma.closePlugin("height must be >= 0.01"); return }
        if (element.width <= 0.1) { figma.closePlugin("width must be >= 0.01"); return }
        if (element.width <= 0.1) { figma.closePlugin("width must be >= 0.01"); return }
        if (element.name.includes('advanced') || element.name.includes('live-area')) {
            (element as FrameNode).verticalPadding = h / 2;
            (element as FrameNode).horizontalPadding = w / 2;
            return
        }

        element.resize(w, h)
    });
    figma.closePlugin('Size Pasted!')
}
if (figma.command == 'pasteWidth') {
    const w = + root.getPluginData("width")
    if (w <= 0.1) { figma.closePlugin("Width must be >= 0.01 to paste"); }

    selectedItems.forEach(element => {

        if (element.height <= 0.1) { changeWidthWithZeroHight(element as FrameNode | ComponentNode | InstanceNode | VectorNode | RectangleNode, w); return }
        if (element.name.includes('advanced')) {
            if (w - element.width < 0) { (element as InstanceNode).horizontalPadding = (element as InstanceNode).masterComponent.horizontalPadding }
            (element as FrameNode).itemSpacing += w - element.width;
            return
        } else if (element.name.includes('live-area')) {

            (element as FrameNode).horizontalPadding = w / 2; return
        }

        element.resize(w, element.height)

    });
    figma.closePlugin('Width Pasted!')
}

if (figma.command == 'pasteHeight') {
    const h = + root.getPluginData("height")

    if (h <= 0.1) { figma.closePlugin("Height must be >= 0.01 to paste"); }
    selectedItems.forEach(element => {
        if (element.width <= 0.1) { changeHeightWithZeroWidth(element as FrameNode | ComponentNode | InstanceNode | VectorNode | RectangleNode, h); return }
        if (element.name.includes('advanced') || element.name.includes('live-area')) { (element as FrameNode).verticalPadding = h / 2; return }

        element.resize(element.width, h)
    });

    figma.closePlugin('Height Pasted!')
}


figma.closePlugin('Failed!')

function changeWidthWithZeroHight(node: FrameNode | ComponentNode | InstanceNode | VectorNode | RectangleNode, newWidth: number) {
    let tempFrame = figma.createFrame()
    tempFrame.x = absoluteX(node)
    tempFrame.y = absoluteY(node)

    tempFrame.resize(node.width, 1)
    let originalParent = node.parent

    originalParent.appendChild(tempFrame)
    tempFrame.appendChild(node)

    node.constraints = { horizontal: "STRETCH", vertical: node.constraints.vertical }
    tempFrame.resize(newWidth, 1)


    originalParent.appendChild(node)
    tempFrame.remove()
}

function changeHeightWithZeroWidth(node: FrameNode | ComponentNode | InstanceNode | VectorNode | RectangleNode, newHeight: number) {
    let tempFrame = figma.createFrame()
    tempFrame.x = absoluteX(node)
    tempFrame.y = absoluteY(node)

    tempFrame.resize(1, node.height)
    let originalParent = node.parent

    originalParent.appendChild(tempFrame)
    tempFrame.appendChild(node)

    node.constraints = { horizontal: node.constraints.horizontal, vertical: "STRETCH" }
    tempFrame.resize(1, newHeight)


    originalParent.appendChild(node)
    tempFrame.remove()
}


function applyMatrixToPoint(matrix: number[][], point: number[]) {
    return [
        point[0] * matrix[0][0] + point[1] * matrix[0][1] + matrix[0][2],
        point[0] * matrix[1][0] + point[1] * matrix[1][1] + matrix[1][2]
    ]
}

function getBoundingRect(nodes: SceneNode[]) {
    const boundingRect = {
        x: 0,
        y: 0,
        x2: 0,
        y2: 0,
        height: 0,
        width: 0
    }

    if (nodes.length > 0) {
        const xy = nodes.reduce(
            (rez, node) => {
                const halfHeight = node.height / 2
                const halfWidth = node.width / 2

                const [[c0, s0, x], [s1, c1, y]] = node.absoluteTransform
                const matrix = [
                    [c0, s0, x + halfWidth * c0 + halfHeight * s0],
                    [s1, c1, y + halfWidth * s1 + halfHeight * c1]
                ]

                // the coordinates of the corners of the rectangle
                const XY = {
                    x: [1, -1, 1, -1],
                    y: [1, -1, -1, 1]
                }

                // fill in
                for (let i = 0; i <= 3; i++) {
                    const a = applyMatrixToPoint(matrix, [
                        XY.x[i] * halfWidth,
                        XY.y[i] * halfHeight
                    ])
                    XY.x[i] = a[0]
                    XY.y[i] = a[1]
                }

                XY.x.sort((a, b) => a - b)
                XY.y.sort((a, b) => a - b)

                rez.x.push(XY.x[0])
                rez.y.push(XY.y[0])
                rez.x2.push(XY.x[3])
                rez.y2.push(XY.y[3])

                return rez
            },
            { x: [], y: [], x2: [], y2: [] }
        )

        const rect = {
            x: Math.min(...xy.x),
            y: Math.min(...xy.y),
            x2: Math.max(...xy.x2),
            y2: Math.max(...xy.y2)
        }

        boundingRect.x = rect.x
        boundingRect.y = rect.y
        boundingRect.x2 = rect.x2
        boundingRect.y2 = rect.y2
        boundingRect.width = rect.x2 - rect.x
        boundingRect.height = rect.y2 - rect.y
    }

    return boundingRect
}