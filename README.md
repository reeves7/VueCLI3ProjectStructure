# VueCLI3ProjectStructure
  一个简单的基于Vue+TypeScript+iView的Vue CLI3.x项目结构设计.个人博客文章地址：[blog.wangx.me](https://blog.wangx.me/#/posts/vue-cli3-typescript-project-structure)

## Run
```
yarn install
yarn run serve

```

&emsp;&emsp;之前在vue-cli3正式版还没有发布的时候就已经在安利下尝过鲜了，但之前对于vue-cli的设计和typescript等知识了解不多，项目结构设计的不太好。借着做另外一个项目的机会学习了vue-cli3的相关知识，根据自己的理解设计了一个前端项目结构。

&emsp;&emsp;项目的技术选型用vue+typescript，脚手架使用vue-cli3，UI框架主要在ElementUI和iView之间选择。因为项目是PC中后台类型的，作为对比的就是活跃度、组件库这些，确实ElementUI是饿了么团队做的，然后活跃star这些iView也不少，明显的bug的话ELementUI比iView要多很多，也可能是使用iView的人少一点。但是iView的组件库要优于饿了么，iView是基于ant-design，个人觉得iView的UI优于饿了么。所以最后选择了iView作为UI框架，iView是基于less开发的，所以我也选用了less。这就是大概的技术选型。包管理工具这些根据个人喜好选择，我用的是yarn。

##### 创建vue-cli3项目

```shell
# 没有安装的@vue-cli3的使用下面命令安装
npm install -g @vue/cli
# OR
yarn global add @vue/cli
# 安装完之后使用下面的命令检查是否安装正确,出版本号即正确安装
vue --version
# 使用vue create <project_name>
vue create my-project
```

&emsp;&emsp;会提示你使用默认配置还是手动设置，通过上下键切换回车选择。接着使用空格进行选择，选上Babel、TypeScript、Router、Vuex、CSS Pr-processors、Linter/Formatter，测试可以不选，回车下一步。

![step1](https://i.loli.net/2018/10/17/5bc69dc6dbf6d.png)

![step2](https://i.loli.net/2018/10/17/5bc69dc73dbb0.png)

![step3](https://i.loli.net/2018/10/17/5bc69dc79e4a8.png)

&emsp;&emsp;创建好的项目结构：

![项目结构](https://i.loli.net/2018/10/17/5bc6a69993d88.png)

&emsp;&emsp;vue-cli3的最大特点就是零配置，相关配置都隐藏在@vue/preload-webpack-plugin，默认配置已经可以满足大部分需求了，针对不了解webpack的比较友好。熟悉webpack的也可以进行定制。想要修改或拓展webpack配置可以新增```vue.config.js```文件进行配置，这部门vue-cli文档很详细。

```shell
# 在当前项目下查看webpack 详细配置
vue inspect
```



##### 添加iView、axios

&emsp;&emsp;iView推出了支持Vue CLI 3的插件，安装插件使用更方便。可以通过命令行安装或使用图形界面安装。注意安装时选择Fully import，因为这样才可以定制主题，选择添加一个less来overwrite主题色。

```shell
# 命令行安装
vue add vue-cli-plugin-iview
```

&emsp;&emsp;个人觉得添加插件使用图形界面安装方便，除了可以检查是否能正确安装之外还能看到插件的下载数等信息，图形界面也可以直接创建vue-cli项目。

```shell
# 打开vue-cli图形界面
vue ui
```

![vue-ui](https://i.loli.net/2018/10/17/5bc6b382a4f51.png)

&emsp;&emsp;在搜索插件搜索安装就行了，插件的配置项在安装的时候也已选择。

&emsp;&emsp;Vue CLI 3默认没有安装axios，需要我们手动安装：

```shell
yarn add axios
```

&emsp;&emsp;iView插件安装好之后，选择添加一个iview-variables.less来覆盖主题色或者其他iView的配置，例如覆盖主题色：

```less
// Here are the variables to cover, such as:
@primary-color: #8c0776;
```

&emsp;&emsp;这个less文件需要在入口文件main.ts引入，目前的vuecli3项目这样引入会报error。

![less error](https://i.loli.net/2018/10/17/5bc6d560932c6.png)

&emsp;&emsp;不过比较人性化的是提示了你如何去解决，可以去这个链接寻找解决方案。我使用的方案是将less版本降到3.x以下，2.7.3。这样就没问题了。

##### 全局引用less

&emsp;&emsp;iview-variables.less只能重写iview中定义的less变量，如果需要我们自己定义一些变量类似背景色和其他公用的变量，就需要引一个base.less了，这部分在vue-cli-3的文档中也说明的很详细。我采用的是使用vue-cli-plugin-resources-loader。使用vue ui搜索添加这个插件。安装成功项目目录下会多一个vue.config.js，在里面进行配置就好了，这个插件会给我初始化一些内容，我们只需要引入我们需要的less文件即可。

```javascript
const path = require('path');

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'src/assets/common/base.less'),
      ]
    }
  }
}
```

##### 路由设计

&emsp;&emsp;通过对项目的简单分析设计了路由，包括路由结构，路由懒加载路由前置检查。

```typescript
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
```

##### 全局过滤器

&emsp;&emsp;项目有的地方可能会用到全局过滤器，在src下新建一个filter文件夹，新建filter.ts文件。依次添加全局过滤器，然后在main.ts引入filter.ts，就可以在组件中使用全局过滤器了。比较简单就不贴代码了。

##### localstorage管理

&emsp;&emsp;项目中肯定会涉及到localstorage的使用，如果比较多的话，统一进行管理。在src下新建storage文件夹，新建storage.ts，实现localstorage的一些方法如get、set、remove等。

```typescript
/**
 * localStorage
 */

export default class Storage {
  public static getItem(key: any, defaultValue: any): any {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else if (defaultValue) {
      return defaultValue;
    }
    return null;
  }

  public static setItem(key: any, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public static removeItem(key: any): void {
    localStorage.removeItem(key);
  }
}
```

&emsp;&emsp;然后在根据自己需要新建tokenStorage、userStorage等。以tokenStorage和userStorage为例：

```typescript
/**
 * tokenStorage
 */
import storage from './storage';

const StorageKey = 'Token';

export default class TokenStorage {

  public static getToken(): any {
    return storage.getItem(StorageKey, '');
  }

  public static setToken(value: any): void {
    storage.setItem(StorageKey, JSON.stringify(value));
  }

  public static removeItem(): void {
    storage.removeItem(StorageKey);
  }
}
```

```typescript
/**
 * userStorage
 */
import storage from './storage';

const UserInfoKey = 'user_info';

export default class UserStorage {

  public static saveUserInfo(user: any): any {
    return storage.setItem(UserInfoKey, user);
  }

  public static getUserInfo(): any {
    return storage.getItem(UserInfoKey, '');
  }
}
```

##### api设计

&emsp;&emsp;项目必定会设计和后端交互请求接口，在src下新建一个service文件夹来保存api方便管理。以前用ajax请求可以对http请求进行二次封装，我项目中使用的是async函数，虽然会有很多重复代码，但是看起来也会很简洁，初步没有涉及二次封装。关于拦截器的相关内容没有设计进来。

&emsp;&emsp;结构目录：

![service结构](https://i.loli.net/2018/10/17/5bc6e948af72a.png)

```typescript
// http.ts
import axios from 'axios';

const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

export default http;
```

```typescript
// user.ts
import http from '../http';

export interface ResponseData {
  message: string;
  payload: any;
}

export const ToolList = async (requestParam: any): Promise<any> => {
  try {
    const response = await http.get<ResponseData>('/user', { params: requestParam });
    return response.data.payload;
  } catch (e) {
    throw e;
  }
};
```
