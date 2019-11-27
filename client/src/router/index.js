import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Enter from '@/components/Auth/Enter.vue'
import Signin from '@/components/Auth/Signin.vue'
import Signup from '@/components/Auth/Signup.vue'
import Profile from '@/components/Auth/Profile.vue'
import Target from '@/components/Target.vue'
import Targets from '@/components/Targets.vue'

import firebase from 'firebase'

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
      // { path: '', component: Signin },
      { path: 'signin', component: Signin },
      { path: 'signup', component: Signup },
    ],
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/targets',
    name: 'Targets',
    component: Targets,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/targets/add',
    name: 'Target',
    component: Target,
    meta: {
      requiresAuth: true,
    },
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    let user = firebase.auth().currentUser;
    if (user) {
      next();
    } else {
      next({ path: '/enter/signin' })
    }
  } else {
    next();
  }
})

export default router
