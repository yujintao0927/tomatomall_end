import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/',
        redirect: '/login',
    }, {
        path: '/login',
        component: () => import('../views/Login.vue'),
        meta: {title: '用户登录'}
    }, {
        path: '/register',
        component: () => import('../views/Register.vue'),
        meta: {title: '用户注册'}
    }, {
        path: '/home',
        component: () => import('../views/user/Home.vue'),
        meta: {title: 'home页'}
    }, {
        path: '/404',
        name: '404',
        component: () => import('../views/NotFound.vue'),
        meta: {title: '404'}
    }, {
        path: '/admin/home',
        name: 'adminHome',
        component: () => import('../views/admin/Home.vue'),
        meta: {title: 'adminHome'}
    }, {
        path: '/user/advertisement',
        name: 'advertisement',
        component: () => import('../views/user/Advertisement.vue'),
        meta: {title: 'advertisement'}
    }, {
        path: '/products/:id',
        name: 'productDetail',
        component: () => import('../views/product/ProductDetail.vue'),
        meta: {title: 'productDetail'}
    }]
})

router.beforeEach((to, _, next) => {
    const token: string | null = sessionStorage.getItem('token');
    const role: string | null = sessionStorage.getItem('role')

    if (to.meta.title) {
        document.title = to.meta.title
    }

    if ('45') {
        if (to.meta.permission) {
            if (to.meta.permission.includes(role!)) {
                next()
            } else {
                next('/404')
            }
        } else {
            next()
        }
    } else {
        if (to.path === '/login') {
            next();
        } else if (to.path === '/register') {
            next()
        } else {
            next('/login')
        }
    }
})

export {router};
