# virtual-dom原理与实现

### 背景
在jQ时代，页面数据更新是通过直接操作DOM，改变其html/text/attribute。当数据变更较多时，引发重绘/重排，页面更新卡顿，加载缓慢，代码不易维护，手动操作DOM频繁。

### 解决方案

基于以上背景，想到能不能用js对象模拟DOM结构，起名虚拟DOM，再将它渲染到页面，当页面数据改变时，重新生成新的虚拟DOM，然后比较前后两个虚拟DOM，
主要比较的有标签，属性，子节点，文本内容等，记录其差异。再将差异应用到真正的DOM树上，视图更新。

```
  //伪代码
  UI=render(data)
```

### 实现思路

1. 用JS对象模拟DOM树
2. 比较两棵虚拟DOM树的差异
3. 把差异应用到真正的DOM树上

[预览](https://fredafei.github.io/simple-virtual-dom/)

### 参考

[如何理解虚拟DOM?](https://www.zhihu.com/question/29504639?sort=created)