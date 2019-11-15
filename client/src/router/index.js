import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Enter from '@/components/Auth/Enter.vue'
import Signin from '@/components/Auth/Signin.vue'
import Signup from '@/components/Auth/Signup.vue'


Vue.use(VueRouter)

const routes = [
  
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/enter',
    name: 'Enter',
    component: Enter,
    children: [
      { path: '', component: Signin },
      { path: 'signin', component: Signin },
      { path: 'signup', component: Signup },
    ],
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
