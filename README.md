## vue-folder-tree
> VUE 组件 - 文件夹目录结构

### Demo
> https://github.com/q-jason/vue-folder-tree/docs/

### 安装
```bash
npm i --save vue-folder-tree
```
```javascript
import FolderTree from 'vue-folder-tree'
import 'vue-folder-tree/dist/vue-folder-tree.css'

Vue.use(FolderTree)
```
or
```html

<link rel="stylesheet" href="../dist/vue-folder-tree.css">
<script src="../dist/vue-folder-tree.js"></script>
```
### 使用
```html
<vue-folder-tree
  ref="folder-tree"
  v-model="selectedFolderId"
  :data.sync="folderData"
  @on-click="clickFolder">
</vue-folder-tree>
```
```js
var TEST_DATA = [
  {
    id: '全部收藏',
    name: '全部收藏',
    expand: true,
    children: [
      {
        id: '1',
        name: '第一级',
        parentId: '全部收藏',
        expand: false,
        children: [
          {
            id: '1-1',
            name: '第二级',
            parentId: '1'
          }
        ]
      },
      {
        id: '2',
        name: '第一级',
        parentId: '全部收藏',
        children: [
          {
            id: '2-1',
            name: '第二级',
            parentId: '2'
          }
        ]
      }
    ]
  }
]

new Vue({
  data: function () {
    return {
      folderData: null,
      selectedFolderId: null
    }
  },
  methods: {
    clickFolder: function (folder) {
      console.log('点击了文件夹：' + folder.name)
      console.log(folder)
    }
  },
  created: function () {
    this.folderData = TEST_DATA
    
    // 如果需要使用 getPath 方法则需要等待 folder-tree 组件渲染后再赋值 value
    // 否则会报错
    this.$nextTick(function () {
      this.selectedFolderId = this.folderData[ 0 ].id
    })
  },
  computed: {
    path: function () {
      if (!this.selectedFolderId || !this.$refs[ 'folder-tree' ]) return null
      
      var result = ''
      var pathData = this.$refs[ 'folder-tree' ].getPath(this.selectedFolderId)
      
      pathData.forEach(function (item, i) {
        result += item.name
        if (i !== pathData.length - 1) {
          result += ' > '
        }
      })
      
      return result
    }
  }
}).$mount('.root')
```

### prop
- value，可以用 v-model 双向绑定，会高亮选中的目录。
- data，目录数据，建议用 .sync 双向绑定，仅会改变数据中的 expand 字段（是否展开）

### event
- input，v-model
- update:data，data.sync
- on-click，点击目录后会通知该事件，参数为点击条目的数据
