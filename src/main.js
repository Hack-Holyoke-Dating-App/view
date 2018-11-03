import Vue from 'vue';
import VueRouter from 'vue-router';

import { LoadingState } from 'src/config/loading-state';
import Navigation from 'components/Navigation/navigation';
import Loader from 'components/Loader/loader';

Vue.use(VueRouter);

import 'src/config/http';
import routes from 'src/routes';
import 'src/style.scss';

export const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('user')
  const user = JSON.parse(userStr);
  console.log(user);
  console.log(user==null);
  if (user == null){
    if (to.fullPath!=='/register'){
      next('/register')
    } else {
      next()
    }
  } else {
    next()
  }
})

new Vue({
  router,
  components: {
    Navigation,
    Loader
  },

  data(){
    return {
      isLoading: false
    };
  },

  created(){
    LoadingState.$on('toggle', (isLoading) => {
      this.isLoading = isLoading;
    });
  }
}).$mount('#app');
