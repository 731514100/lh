# enter-sell-store-front-end-v3

## 温馨提示：项目目前好像有点问题样
  1. 产品逻辑此项目目前是走不通的（具体走不通可能得捋捋了，但是项目代码逻辑是没得问题的，只不过这个项目肯定没法商用的了）
  2. v3的权限目前是 addRoute 方法添加的，这就导致了退出登录得刷新一下浏览器，不然之前使用 addRoute 添加的路由还在页面路由里面，导致权限不对的问题。（退出登录后在登录页目前并没有刷新页面-我没做。。。。）
  3. 操作员管理那块并没有添加角色管理，而是直接绑定模块权限，也并没有添加按钮级权限
## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
