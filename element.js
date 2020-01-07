function Element(node, props, children) {
  this.node = node
  this.props = props
  this.children = children
}
Element.prototype.render = function() {
  const el = document.createElement(this.node)
  for (let key in this.props) {
    el.setAttribute(key, this.props[key])
  }
  const children = this.children || []
  children.forEach(child => el.appendChild(child instanceof Element ? child.render() : document.createTextNode(child)))
  return el
}

const el = (node, props, children) => new Element(node, props, children)
