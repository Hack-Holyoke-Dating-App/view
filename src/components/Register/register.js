import Vue from 'vue';
import VeeValidate from 'vee-validate';
import { API_BASE } from '../../config/constants';
import axios from 'axios';

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
            username: "",
        },
        id: this.$route.params.id,
    };
  },
  mounted(){
    console.log("???? " + API_BASE)
    // axios.get(API_BASE + "/api/memes").then(resp => {
    //     console.log(resp)
    // }).catch(err => { console.log(err) });
  },
  methods: {
      register: function(e){
          console.log("register")
          const user = {
              name: this.$data.user.name,
              age: this.$data.user.age,
              location: this.$data.user.location,
              username: this.$data.user.username
          }

          if (e){
            const userWrapper = {"user": user};
            axios.post(API_BASE + "/api/users", userWrapper).
            then(resp => {
                console.log(resp)
                const resp_user = resp.data.user
                localStorage.setItem('user', JSON.stringify(resp_user));
                console.log(resp_user)
                this.$router.push("/meme");
            });
            
          }
      }
  }
});
