/**
 * 定义全局过滤器
 */
import Vue from 'vue';

/**
 * reSize File
 */
Vue.filter('reSizeFile', (bytes: number) => {
 const sizeName: string[] = ['B', 'K', 'M', 'G', 'T'];
 if (bytes) {
   const e = Math.floor(Math.log(bytes) / Math.log(1024));
   return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + ' ' + sizeName[e];
 } else {
   return '';
 }
});
