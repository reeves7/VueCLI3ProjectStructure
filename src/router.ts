import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);
/**
 * 路由懒加载方法
 * @param  component_name 路由组件name
 * @return 返回一个加载当前name组件的匿名函数
 */
const getComponent = (componentName: string) => () => import(`./views/${componentName}.vue`);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/user',
      component: Home,
      meta: {
          auth: true,
      },
      children: [
        {
          path: '/pluginmarket',
          name: 'plugin_market',
          component: getComponent('PluginMarket'),
        },
        {
          path: '/user',
          name: 'user',
          component: getComponent('User'),
          meta: {
              auth: true,
          },
        },
        {
          path: '/team',
          name: 'team',
          component: getComponent('Team'),
          meta: {
              auth: true,
          },
        },
        {
          path: '/accountmanagement',
          name: 'account_management',
          component: getComponent('AccountManagement'),
          meta: {
              auth: true,
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: getComponent('Login'),
    },
    {
      path: '*',
      name: 'not_found',
      component: getComponent('404NotFound'),
    },
  ],
});

/**
 * 路由拦截
 */
router.beforeEach((to, from, next) => {
  // 校验
  if (to.meta.auth) {
    console.log('please login.');
    next();
  }
  next();
});

export default router;
