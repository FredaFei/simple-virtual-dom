const REPLACE = 0
const RECORDER = 1
const PROPS = 2
const TEXT = 3

function patch(node, patches) {
  deepTraverseTree(node, { index: 0 }, patches)
}
function deepTraverseTree(node, walker, patches) {
  const currentPatches = patches[walker.index]
  const len = node.childNodes ? node.childNodes.length : 0
  for (let i = 0; i < len; i++) {
    let child = node.childNodes[i]
    walker.index++
    deepTraverseTree(child, walker, patches)
  }
  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}
function applyPatches(node, currentPatches) {
  _.each(currentPatches, currentPatch => {
    switch (currentPatch.type) {
      case REPLACE:
        let newNode = typeof currentPatch.node === 'string' ? document.createTextNode(currentPatch.node) : currentPatch.node.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case RECORDER:
        recorderChildren(node, currentPatch.moves)
        break
      case PROPS:
        setProps(node, currentPatch.props)
        break
      case TEXT:
        if (node.textContent) {
          node.textContent = currentPatch.content
        } else {
          // ie
          node.nodeValue = current.content
        }
        break

      default:
        throw new Error(`Unknown patch type ${currentPatch.type}`)
    }
  })
}
function setProps(node, props) {
  for (let key in props) {
    if (props[key] === undefined) {
      node.removeAttribute(key)
    } else {
      _.setAttr(node, key, props[key])
    }
  }
}
function recorderChildren(node, moves) {
  const staticNodeList = _.toArray(node.childNodes)
  const maps = {}
  _.each(staticNodeList, node => {
    if (node.nodeType === 1) {
      let key = node.getAttribute('key')
      if (key) {
        maps[key] = node
      }
    }
  })
  _.each(moves, move => {
    let index = move.index
    if (move.type === 0) {
      // remove item
      if (staticNodeList[index] === node.childNodes[index]) {
        node.removeChild(node.childNodes[index])
      }
      staticNodeList.splice(index, 1)
    } else if (move.type === 1) {
      let mapsItem = maps[move.item.key]
      let insertNode = mapsItem ? mapsItem.cloneNode(true) : typeof move.item === 'object' ? move.item.render() : document.createTextNode(move.item)
      staticNodeList.splice(index, 0, insertNode)
      node.insertBefore(insertNode, node.childNodes[index] || null)
    }
  })
}
patch.REPLACE = REPLACE
patch.RECORDER = RECORDER
patch.PROPS = PROPS
patch.TEXT = TEXT
