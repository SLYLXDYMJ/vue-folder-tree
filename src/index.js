import FolderTree from './vue-folder-tree'

const plugin = {
  install (Vue) {
    Vue.component('vue-folder-tree', FolderTree)
  }
}

if (window.Vue) {
  plugin.install(window.Vue)
}

export default plugin