// figma.root.setPluginData("x", String(figma.currentPage.selection[0].x))
// figma.root.setPluginData("y", String(figma.currentPage.selection[0].y))
// figma.root.setPluginData("width", String(figma.currentPage.selection[0].width))
// figma.root.setPluginData("height", String(figma.currentPage.selection[0].height))


// const x = + figma.root.getPluginData("x")

// figma.currentPage.selection[0].x = x
// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.



    let selectedItems = figma.currentPage.selection
        if (selectedItems.length == 0){
             figma.closePlugin('No object selected.')
          } 

    if (figma.command == 'copy') {
        if (selectedItems.length > 1) {
            figma.closePlugin('Please select only 1 layer or group')
        }
          figma.root.setPluginData("x", String(figma.currentPage.selection[0].x))
figma.root.setPluginData("y", String(figma.currentPage.selection[0].y))
figma.root.setPluginData("width", String(figma.currentPage.selection[0].width))
figma.root.setPluginData("height", String(figma.currentPage.selection[0].height))
 figma.closePlugin('Copy Success!')
    }

    if (figma.command == 'pastePosition') {
        const x = + figma.root.getPluginData("x")
        const y = + figma.root.getPluginData("y")
        figma.currentPage.selection.forEach(element => {
            element.x = x
            element.y = y
        });
        figma.closePlugin('Position Pasted!')
    }

    if (figma.command == 'pasteSize') {
        const w = + figma.root.getPluginData("width")
        const h = + figma.root.getPluginData("height")

        figma.currentPage.selection.forEach(element => {
            element.resize(w,h)
        });
        figma.closePlugin('Size Pasted!')
    }
    
    if (figma.command == 'pasteX') {
        const x = + figma.root.getPluginData("x")
        figma.currentPage.selection.forEach(element => {
            element.x = x
        });
        figma.closePlugin('X Pasted!')
    }

    if (figma.command == 'pasteY') {
        const y = + figma.root.getPluginData("y")
        figma.currentPage.selection.forEach(element => {
            element.y = y
        });
        figma.closePlugin('Y Pasted!')
    }

    if (figma.command == 'pasteWidth') {
        const w = + figma.root.getPluginData("width")

        figma.currentPage.selection.forEach(element => {
            element.resize(w,element.height)
        });
        figma.closePlugin('Width Pasted!')
    }


    if (figma.command == 'pasteHeight') {
        const h = + figma.root.getPluginData("height")

        figma.currentPage.selection.forEach(element => {
            element.resize(element.width,h)
        });
        figma.closePlugin('Width Pasted!')
    }

    figma.closePlugin('Failed!')
