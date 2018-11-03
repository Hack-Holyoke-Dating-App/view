import Vue from 'vue';
import template from './navigation.html';

export default Vue.extend({
  template,
  methods:{
    logout: function(){
      localStorage.clear();
      this.$router.push("/register");
    }
  }
});
