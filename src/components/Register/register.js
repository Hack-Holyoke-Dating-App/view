import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

import template from './register.html';

export default Vue.extend({
  template,

  data() {
    return {
        user:{
            name: "",
            age: 0,
            location: "",
        },
        id: this.$route.params.id,
    };
  },
  methods: {
      register: function(e){
          console.log("register")
          const user = {
              name: this.$data.user.name,
              age: this.$data.user.age,
              location: this.$data.user.location
          }
          
          if (e){
            localStorage.setItem('user', JSON.stringify(user));
            console.log(user)
            this.$router.push("/meme");
          }
      }
  }
});
