/**
 * 权限校验
 * 通过Vue Router 中的前置钩子函数 beforeEach(to, from, next)
 * to：即将要进入的目标路由对象（访问哪个路由）
 * from：即将要离开的路由对象（从哪里访问）
 * next：是一个方法，可以指定一个路由地址进行路由跳转
 */
import router from './router'
import {getUserInfo} from '@/api/login'
router.beforeEach((to, from, next) => {
    // 1、获取token
    //   1.1、未获取到，还要访问非登录页面，则不让访问，回到登录页面 /login
    //   1.2、获取到了
    //     1.2.1 请求的路由还是/login，那就去登录页面
    //     1.2.2 请求路由是非登录页面，则先获取本地是否有用户信息，若有则直接进入非登录页面，若无则需要通过token去获取用户信息
    //       1.2.2.1 如果获取到了用户信息，则进入非登录页面
    //       1.2.2.2 如果未获取到（可能是token过期），则回到登录页面
    const token = localStorage.getItem('mxg-msm-token');
    if ( !token ) {
        // 未获取到
        if (to.path != '/login') {
            next({path: '/login'});
        } else {
            // 请求的是登录页面，则就是回到登录页面，这里用next();就是指放行
            next();
        }
    } else {
        // 获取到了
        if (to.path == '/login') {
            next();
        } else {
            // 获取本地用户信息
            const user = localStorage.getItem('mxg-msm-user');
            if (user) {
                // 获取到，则放行
                next();
            } else {
                // 未获取到，则通过token去获取用户信息
                getUserInfo(token).then(response => {
                    const resp = response.data;
                    if (resp.flag) {
                        // 通过token获取到用户信息后，则需要保存到本地
                        localStorage.setItem('mxg-msm-user', JSON.stringify(resp.data));
                        next();
                    } else {
                        // 未获取到，可能是token失效了，则需要重新登录
                        next({path: '/login'});
                    }
                })
            }
        }
    }
})