import {getToken, setToken, getUser, setUser, removeUser} from '@/utils/auth'
import {login, getUserInfo, logout} from '@/api/login'

const user = {
    state: {
        // 一旦刷新页面，这些值就会恢复到初始值
        token: getToken(), // getToken() 作为token的初始值，解决刷新页面之后token为null
        user: getUser()
    },
    mutations: {
        SET_TOKEN(state, token) {
            // 更新状态值
            state.token = token;
            // 保存token到浏览器中（持久化）
            setToken(token);
        },
        SET_USER(state, user) {
            // 更新状态值
            state.user = user;
            // 保存user到浏览器中
            setUser(user);
        }
    },
    actions: {
        // 通过commit调用mutations:   commit('', );
        // 通过dispatch触发actions:   this.$store.dispatch('Login')
        // 这里的form是载荷
        Login({commit}, form) {
            // 这里为何要实现一个Promise呢？原因是：我们需要通知调用了actions的组件，告知它一些信息
            // 我们自己封装了一个异步对象Promise（es6里面的知识），并将其返回给调用者
            // resolve触发成功后的处理，reject触发异常处理
            return new Promise((resolve, reject) => {
                login(form.username.trim(), form.password).then(response => {
                    const resp = response.data;
                    if (resp.flag) {
                        // 用户名密码验证成功
                        // 保存token
                        commit('SET_TOKEN', resp.data.token);
                        // 通知组件已经将token更新成功，并将resp传回
                        resolve(resp);
                    } else {
                        // 验证失败
                        this.$message({
                            type: 'warning',
                            message: resp.message
                        })
                    }
                }).catch(error => {
                    reject(error);
                })
            })
        },
        // 通过token获取用户信息
        // 注意：更改状态值成功之后，应该通知一下触发了这个action的地方，从而这个action就可以回调来处理后面的逻辑了
        // 注意：state不要写在载荷的位置上！
        GetUserInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(response => {
                    const resp = response.data;
                    // 触发mutations，更新用户信息状态值
                    commit('SET_USER', resp.data);
                    // 通知组件已更新用户信息状态值
                    resolve(resp);
                })
            }).catch(error => {
                reject(error);
            })
        },
        // 退出系统
        Logout({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(response => {
                    const resp = response.data;
                    // 触发mutations，清除状态值
                    commit('SET_TOKEN', '');
                    commit('SET_USER', null);
                    // 清除浏览器数据（token、userInfo）
                    removeUser();
                    // 通知
                    resolve(resp); 
                })
            }).catch(error => {
                reject(error);
            })
        }
    }
}

export default user