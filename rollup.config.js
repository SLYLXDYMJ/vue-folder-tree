import _ from 'lodash'

/**
 *  解析 .vue 文件
 *  作用和 vue-loader 相同
 *  https://www.npmjs.com/package/rollup-plugin-vue
 **/
import vue from 'rollup-plugin-vue'

/**
 *  将 css 部分提取为文件
 *  可以通过 output 参数指定 css 文件名称
 *  https://www.npmjs.com/package/rollup-plugin-css-only
 **/
import css from 'rollup-plugin-css-only'

/**
 *  解析图片类型文件
 *  将其通过 base64 的形式打包进项目中
 *  https://www.npmjs.com/package/@rollup/plugin-image
 **/
import image from '@rollup/plugin-image'

/**
 *  2022.02.10
 *  babel 的配置真实太难搞了....
 *  配置参考自：https://blog.csdn.net/wu_xianqiang/article/details/117898118
 **/
import babel from 'rollup-plugin-babel'

/**
 *  用于使 rollup 更方便的查找模块
 **/
import { nodeResolve } from '@rollup/plugin-node-resolve'

/**
 *  rollup 推崇使用 ES6 的模块化风格
 *  这个插件使 commonjs 方式的模块也可以正常使用
 **/
import commonjs from '@rollup/plugin-commonjs'

/**
 *  压缩代码
 **/
import { terser } from 'rollup-plugin-terser'

/**
 *  打包后文件的名称
 *  umd iife 对外暴露的 window 属性名
 *  TODO: 请指定库名称，驼峰命名
 **/
const NAME = 'vueFolderTree'

const isPro = process.env.NODE_ENV === 'production'
const isDev = !isPro

export default {
  /**
   *  入口文件
   **/
  input: 'src/index.js',
  
  /**
   *  打包后的文件
   *  可以指定一个数组
   *  指定打包不同的风格
   *    ems  - ES6 风格
   *    cjs  - commonJS 风格
   *    umd  - 通用模块定义，以amd，cjs 和 iife 为一体
   *    amd  - requireJS 风格
   *    iife - 适合于 script 标签的方式
   *      若不指定 name 属性，则会是一个自调用的匿名函数
   **/
  output: [
    {
      format: 'esm',
      file: `dist/${ _.kebabCase(NAME) }.esm.js`
    },
    {
      name: NAME,
      format: 'iife',
      file: `dist/${ _.kebabCase(NAME) }.js`
    }
  ],
  
  plugins: [
    commonjs(),
    nodeResolve({
      browser: true,
      extensions: [ '.js', '.vue' ]
    }),
    vue({
      css: false,
      
      /**
       *  解决打包后部分 .vue 相关 ES6 代码没有被 babel 转换的问题
       *  https://github.com/lljj-x/vue-json-schema-form/issues/29
       *  https://github.com/rollup/rollup-plugin-babel/issues/260
       **/
      normalizer: '~vue-runtime-helpers/dist/normalize-component.js'
    }),
    babel({
      runtimeHelpers: true,
      externalHelpers: true,
      exclude: /node_modules\/(?!(@lljj)\/).*/,
      
      /**
       *  解决打包后部分 .vue 相关 ES6 代码没有被 babel 转换的问题
       *  https://github.com/lljj-x/vue-json-schema-form/issues/29
       *  https://github.com/rollup/rollup-plugin-babel/issues/260
       **/
      extensions: [ '.js', '.jsx', '.es6', '.es', '.mjs', '.vue', '.jpg', '.png', '.webp', '.bmp' ]
    }),
    css({
      output: `${ _.kebabCase(NAME) }.css`
    }),
    image(),
    
    // 生产环境压缩代码
    (function () {
      if (isPro) {
        return terser()
      }
    })()
  ]
}