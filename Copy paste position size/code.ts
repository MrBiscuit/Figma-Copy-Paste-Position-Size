function absoluteX(layer) {
    return layer.absoluteTransform[0][2]
}

function absoluteY(layer) {
    return layer.absoluteTransform[1][2]
}

let selectedItems = figma.currentPage.selection
let root = figma.root;
if (selectedItems.length == 0) {
    figma.closePlugin('No object selected.')
}

if (figma.command == 'copy') {
    if (selectedItems.length > 1) {
        figma.closePlugin('Please select only 1 layer or group')
    }
    root.setPluginData("x", String(selectedItems[0].x))
    root.setPluginData("y", String(selectedItems[0].y))
    root.setPluginData("width", String(selectedItems[0].width))
    root.setPluginData("height", String(selectedItems[0].height))

    root.setPluginData("AbsX",String(absoluteX(selectedItems[0])))
    root.setPluginData("AbsY",String(absoluteY(selectedItems[0])))

    figma.closePlugin('Copy Success!')
}

if (figma.command == 'pastePosition') {
    const x = + root.getPluginData("x")
    const y = + root.getPluginData("y")
    selectedItems.forEach(element => {
        element.x = x
        element.y = y
    });
    figma.closePlugin('Position Pasted!')
}

if (figma.command == 'pasteSize') {
    const w = + root.getPluginData("width")
    const h = + root.getPluginData("height")

    selectedItems.forEach(element => {
        element.resize(w, h)
    });
    figma.closePlugin('Size Pasted!')
}

if (figma.command == 'pasteX') {
    const x = + root.getPluginData("x")
    selectedItems.forEach(element => {
        element.x = x
    });
    figma.closePlugin('X Pasted!')
}

if (figma.command == 'pasteY') {
    const y = + root.getPluginData("y")
    selectedItems.forEach(element => {
        element.y = y
    });
    figma.closePlugin('Y Pasted!')
}

if (figma.command == 'pasteWidth') {
    const w = + root.getPluginData("width")

    selectedItems.forEach(element => {
        element.resize(w, element.height)
    });
    figma.closePlugin('Width Pasted!')
}


if (figma.command == 'pasteHeight') {
    const h = + root.getPluginData("height")

    selectedItems.forEach(element => {
        element.resize(element.width, h)
    });
    figma.closePlugin('Height Pasted!')
}

if (figma.command == 'pasteAbsX') {
    const x = + root.getPluginData("AbsX")
    selectedItems.forEach(element => {
        element.x += x - absoluteX(element)
    });
    figma.closePlugin('Absolute X Pasted!')
}

if (figma.command == 'pasteAbsY') {
    const y = + root.getPluginData("AbsY")
    selectedItems.forEach(element => {
        element.y += y - absoluteY(element)
    });
    figma.closePlugin('Absolute Y Pasted!')
}

if (figma.command == 'pasteAbsPosition') {
    const x = + root.getPluginData("AbsX")
    const y = + root.getPluginData("AbsY")
    selectedItems.forEach(element => {
        element.x += x - absoluteX(element)
        element.y += y - absoluteY(element)
    });
   
    figma.closePlugin('Absolute Position Pasted!')
}

figma.closePlugin('Failed!')
