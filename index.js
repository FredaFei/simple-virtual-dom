function generateTree(length = 3) {
  const items = []
  const color = length % 2 === 0 ? 'black' : 'blue'
  for (let i = 0; i < length; i++) {
    items.push(i)
  }
  return el('ul', { id: 'list', style: 'color: ' + color }, items.map(i => el('li', { key: `uid-${i}` }, [`item-${i}`])))
}

let tree = generateTree()
let root = tree.render()
document.body.appendChild(root)

setTimeout(() => {
  const newTree = generateTree(4)
  const patches = diff(tree, newTree)
  patch(root, patches)
  root = newTree
}, 2000)
