<template id="vue-folder-tree">
  <div class="vue-folder-tree">
    <div
      v-for="(item) in data"
      class="vue-folder-tree-item"
      :class="[ item.expand === true && 'open', item.id === value && 'selected' ]"
      @click.stop="selectFolder(item)">

      <!-- 基础信息 -->
      <div class="vue-folder-tree-item-base">
        <!-- 箭头 -->
        <div
          class="vue-folder-tree-item-arrow"
          :class="{ hide: !item.children || item.children.length === 0 }"
          @click.stop="toggleFolder(item)">
          <img :src="icon.arrow" alt="">
        </div>
        <!-- 图标 -->
        <div class="vue-folder-tree-item-icon">
          <img :src="icon.folder">
        </div>
        <!-- 名字 -->
        <div class="vue-folder-tree-item-name">
          {{ item.name }}
        </div>
      </div>

      <!-- 目录内容 -->
      <div
        class="vue-folder-tree-item-children"
        v-if="item.children && item.children.length">
        <vue-folder-tree
          :value="value"
          :data="item.children"
          :full-data="fullData || data"
          v-on="$listeners">
        </vue-folder-tree>
      </div>
    </div>
  </div>
</template>

<script>
  var ICON_ARROW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA1hJREFUeF7tmknITlEYx39fNixsSCJRLBSFMkTKEBJhJWTITPgWZE4hSqEMGZJ5HnckZYgFCdmYIlFKKSmxsTL0r/tuvt577n17n3Pu8b33bO/pnOf3u+ee5wy3iQYvTQ3OTymgHAENbqD8BBp8AJSToOUnsBVYDrwHzgBH/4fRZSVgHnCqBfB+YGXsEqwEXAcmV4G9BMwBfscqwkrAbmBNCuQ9YCHwKUYJVgLE9tcB+ApYBDyJTYKlALF9AHqmQH4FFgP6XKIp1gIEdhcY4yCUhOOxGPAhQGxKgQJNK5uAHTFI8CVAbBszIKNIkz4FSMJ04LLjTStNzixyJPgWILbhwEMHpNLk2KIkhBAgtt7A24w0KVE/Q4sIJUBcHYHnQA9HmhwNvAkpIaSACtd9YJQDcjxwO5SEIgSI7QSwwAGppfPJEBKKEiA2bZ+3OCD1bJtvCUUKEFszcMABeQxY4lNC0QLENgPQeiCt3AIm+pIQgwCxaR1wxwH5EujnQ0IsAsQ2ALgBdHOkyc7WEmISIDbBXwWGOUC7Al+sRMQmQFxtEwnVjtgq3EOAZxYSYhRQ4dI6YL4Dsq/FqjFmAWLfCaxLkXABmF3vKIhdwC5gbQrkEWBZaxZwGpjrANTG6UFrFNAeuAJMcMANSnaW9fJHdzeoE2WlwYEOsg7A97rJkwZimgOGJm++ewrcR6CXFXilnVgEKOfrzWsNUK3oqH2cNbzai0GA9v6uewIdsS/1AR+DgKyj8w3JWsAXf6EjYG/G9fk04Jo38oInwfPALN85Po+80HNAJ0BLWNeE1h94kSd4izohBWjzIngBVitKcyOBzxZgedsIJUDH4BeBLo40NwX4lTdwq3ohBGgyE3yblKC9prksUb4FrAAOOoLYDmzOCtLnc58Css79VwH7fMLladuXgMMZe3Vtc8/mCdB3HWsB7RKwqY7AJwE3fYPlbd9SgHZx54ARjjSnI6zHeYMLUc9SwFNgcErQj5J/Bd+FgKqlDysByvO69q5WdNmhm+BvtQQWqq6VAP0kfahK0DrX03b3TyigWvuxEtAHeN2i8z3A6loDCl3fSoDi1q+w64EfyX+CDfW7fOgXZ9af5QgwCypkQ6WAkLZj7KscATG+lZAxlSMgpO0Y+/oHZWhuQSeTTf0AAAAASUVORK5CYII='
  var ICON_FOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTEwLTI0VDEzOjE4OjI2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMC0yNFQxMzoyNTo1NCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0xMC0yNFQxMzoyNTo1NCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzA1NzkxRkVGNjFFMTFFOTlBMjhGODY5NjZCMjMwNjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzA1NzkxRkZGNjFFMTFFOTlBMjhGODY5NjZCMjMwNjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMDU3OTFGQ0Y2MUUxMUU5OUEyOEY4Njk2NkIyMzA2NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMDU3OTFGREY2MUUxMUU5OUEyOEY4Njk2NkIyMzA2NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpigwRYAAAJvSURBVHja7NtPa9NwHAbwJ22S2tpR6uZFB0M8eRAdiDgVBuJB9CKCgi9E8B3o0bfgSfCip52k4HwBbr6Dwk6i1FNr89cnfzrsJHFsabY2z288Yxmlye+Tb76/pGxGGIbQAGoiEIQgBCEIQQhCEEcc5tTWW+PvrVfMc2btmPv4ytxlhvu/cZlLF4Hzy8DYmd3sDM4numEcDKINoF4HfD9JEACPfmRAJINHh0/M9YIOZ535zNxhnHm6NN4XiDAZN5gvjDUvEI+ZezPa101mO6MKT1mPAB5ObQVp/ML2dyvGcNgzAl6khlHOLA/xYHkQ4lrUU+ClsZkWv51p8M3idyzisDYI24Ntv4mbVil1X+sjCL9xf/7hIAw099vZ6grQ7fIV7LRW4Zf2JnxvE46LmVbFpBI6nejnPYzH7zAcvYyrMRfC5ZfJtnGZK2a3kywzHuO6BS9raXGVdWnUOKeascoT+oJ5gMGv+8T4nt0sI6e1C1xAzwGj34jP2L94BZypkjthVBl+kJzYZvMqlpY+HOwb0xDLbWCFl8RwuLi3kB5Pbrt1myBPsyHaZ8O4bGdRBadlTAqhYT/Jhmi26vC88q7dk8QwzSvZEKZpc5mpxlNWiEY2RLU+0vb1GK7PIwQhiKNBWKZT2oPQibZJP5lrTkUEFSqCIA/CqBCEoR6hZikIQQhCEIIQhCAEIQhBCEIQghCEIAQhCEHMC4RVoblbeRCjCkGM8iB2KwSxmwexVSGIrTyIj0yvAgi9dK65q8YzZmeBEXbSOf53+fyJ5C/qXzP9BQLop3NaT+c4NQz9A6xuqAQhCEEIQhCCEMTxxh8BBgAuypcWVjuBbgAAAABJRU5ErkJggg=='

  export default {
    props: {
      // 选中的文件夹或者文件
      value: null,

      /**
       *  文件夹目录数据，用 .sync 语法糖双向绑定，内部会改变 expand 状态
       *  实现功能只需要 id、parentId、name、children
       *  parentId 为上一级的 ID，getPath 方法使用
       *  expand 是否展开子目录
       *  other 为其他数据，事件中会一并向上传递
       *  {
       *    id: Any,
       *    name: String,
       *    expand: Boolean
       *    other: Any,
       *    children: [
       *      {
       *        id: Any,
       *        name: String,
       *        parentId: String
       *        expand: Boolean
       *        other: Any
       *        children: [],
       *      }
       *    ],
       *  }
       **/
      data: {
        type: Array,
        default: function () {
          return []
        }
      },

      /**
       *  用于在嵌套组件逻辑中保持对总数据的访问
       *  注意：仅嵌套逻辑使用，项目中调用组件时不需要传这个参数
       **/
      fullData: {
        type: Array
      }
    },
    emits: {
      // v-model
      'input': null,
      // 单击目录或文件
      'on-click': null
    },
    data: function () {
      return {
        // 用到的图标图片
        icon: {
          arrow: ICON_ARROW,
          folder: ICON_FOLDER
        }
      }
    },
    methods: {
      // 打开/关闭文件夹
      toggleFolder: function (item) {
        var _this = this

        this.$emit('update:data', (function () {
          var _data = JSON.parse(JSON.stringify(_this.fullData || _this.data))

          // 将全部的项，降到一维数组
          var allItems = (function () {
            var results = []

            handler(_data)
            function handler (arr) {
              arr.forEach(function (item) {
                results.push(item)
                if (item.children && item.children.length) {
                  handler(item.children)
                }
              })
            }

            return results
          })()

          // 找到对应的项
          var _item = (function () {
            for (var i = 0; i < allItems.length; i++) {
              if (allItems[ i ].id === item.id) {
                return allItems[ i ]
              }
            }
          })()

          // 改变展开标识
          _item.expand = !_item.expand

          return _data
        })())
      },

      // 选中某个文件夹
      selectFolder: function (item) {
        this.$emit('input', item.id)
        this.$emit('on-click', item)
      },

      /**
       *  获取 id 对应的嵌套路径
       *  @param { String } [id=this.value] - 需要在 data 中存在
       *  @return { Array } 目录层级数据，从浅到深
       **/
      getPath: function (id) {
        var ID = id || this.value // 当前节点ID
        var resultList = []  // 结果
        var data = this.data // 树数据
        var topPid = undefined

        // 根据id取当前节点
        var getNode = function (data, id) {
          var result = null // 运行结果
          function getTreeItem (data, id) {
            data.forEach(function (item) {
              if (item.id === id) {
                result = item  // 结果赋值
              }
              else {
                if (item.children) {
                  getTreeItem(item.children, id)
                }
              }
            })
          }
          getTreeItem(data, id)
          return result
        }

        // 获取层级数据
        function getLevelList (id) {
          var currentId = id
          var node = getNode(data, currentId)
          resultList.push(node)
          if (node && node.parentId && node.parentId !== topPid) {
            getLevelList(node.parentId)
          }
        }

        getLevelList(ID)

        resultList.reverse()

        return resultList
      }
    }
  }
</script>

<style lang="scss" scoped>
  .vue-folder-tree {
    font-size: 14px;
  }
  .vue-folder-tree-item {
    cursor: pointer;
  }
  .vue-folder-tree-item:not(:last-child) {
    /*margin-bottom: 5px;*/
  }
  .vue-folder-tree-item-base {
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
  }
  .vue-folder-tree-item-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
  }
  .vue-folder-tree-item-arrow img {
    display: block;
    max-width: 14px;
  }
  .vue-folder-tree-item-arrow.hide {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
  .vue-folder-tree-item-icon {
    margin-right: 10px;
  }
  .vue-folder-tree-item-icon img {
    display: block;
    max-width: 30px;
  }
  .vue-folder-tree-item-name {
  }
  .vue-folder-tree-item-children {
    padding-left: 10px;
    /*padding-top: 5px;*/
  }

  /* 目录展开和收缩 */
  .vue-folder-tree-item-children {
    display: none;
  }
  .vue-folder-tree-item.open > .vue-folder-tree-item-base > .vue-folder-tree-item-arrow img {
    transform: rotate(90deg);
  }
  .vue-folder-tree-item.open > .vue-folder-tree-item-children {
    display: block;
  }

  /* 目录或文件的选中 */
  .vue-folder-tree-item.selected > .vue-folder-tree-item-base {
    background-color: #CDE5FE;
  }
</style>