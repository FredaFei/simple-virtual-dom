function diff(oldTree, newTree) {
  const index = 0
  const patches = {}
  traverseTree(oldTree, newTree, index, patches)
  return patches
}
function traverseTree(oldNode, newNode, index, patches) {
  const currentPatch = []
  if (newNode === null) {
  } else if (_.isString(oldNode) && _.isString(newNode)) {
    // 字符串
    if (newNode !== oldNode) {
      currentPatch.push({ type: patch.TEXT, content: newNode })
    }
  } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
    // diff props
    const propsPatches = diffProps(oldNode, newNode)
    if (propsPatches) {
      currentPatch.push({ type: patch.PROPS, props: propsPatches })
    }
    
    // diff children
    if (!isIgnoreChildren(newNode)) {
      diffChildren(oldNode.children, newNode.children, index, patches, currentPatch)
    }
  } else {
    currentPatch.push({ type: patch.REPLACE, node: newNode })
  }
  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}
function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
  const diffs = listDiff(oldChildren, newChildren, 'key')
  newChildren = diffs.children
  if (diffs.moves.length) {
    currentPatch.push({ type: patch.RECORDER, moves: diffs.moves })
  }
  let leftNode = null
  let currentNodeIndex = index
  _.each(oldChildren, (child, i) => {
    let newChild = newChildren[i]
    currentNodeIndex = leftNode && leftNode.count ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1
    traverseTree(child, newChild, currentNodeIndex, patches)
    leftNode = child
  })
}
function diffProps(oldNode, newNode) {
  let count = 0,
    value
  const propsPatches = {}
  const { props: oldProps } = oldNode
  const { props: newProps } = newNode
  // edit props ?
  for (let key in oldProps) {
    value = oldProps[key]
    if (newProps[key] !== value) {
      count++
      propsPatches[key] = newProps[key]
    }
  }
  // add new props ?
  for (let key in newProps) {
    value = newProps[key]
    if (!oldProps.hasOwnProperty(key)) {
      count++
      propsPatches[key] = newProps[key]
    }
  }
  if (count === 0) {
    return null
  }
  return propsPatches
}
function isIgnoreChildren(node) {
  return node.props && node.props.hasOwnProperty('ignore')
}
