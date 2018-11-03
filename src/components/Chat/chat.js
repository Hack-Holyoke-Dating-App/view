import Vue from 'vue';
import VeeValidate from 'vee-validate';
// import axios from 'axios';

Vue.use(VeeValidate);

// import { postsResource } from 'src/util/resources';
import template from './chat.html';

export default Vue.extend({
  template,

  data() {
    const mock =  [
      { name: 'Bruce Wayne', text: "Hey spiderman"},
      { name: 'Peter Parker', text: "Hey Badman" }
    ]
    return {
      post: {},
      message: null,
      users:[
        { name: 'Bruce Wayne' },
        { name: 'Peter Parker' }
      ],
      messages: mock,
      mock: mock,
      currentUserIdx: 0,
      me: {name: ""},
      id: this.$route.params.id,
      txtInput: ''
    };
  },
  mounted: function(){
    console.log("hello world");
    var userStr = localStorage.getItem("user");
    this.$data.me = JSON.parse(userStr);
  },
  computed: {
    // onSelectUser: function(user){
      
    // },
    
    getCurrentUser: function(){
        if (this.$data.users.length > 0){
          return this.$data.users[this.$data.currentUserIdx];
        }
        return "No One :("
    }
  },
  methods: {
    selectUser: function(index){
        const user = this.$data.users[index];
        console.log(user.name);
        this.$data.currentUserIdx = index;
        this.reloadChat();
    },
    reloadChat: function(){
      const mock =  [
        { name: 'Bruce Wayne', text: "Hey spiderman"},
        { name: 'Peter Parker', text: "Hey Badman" }
      ];
      this.$data.messages = mock;
    },
    addMessage: function(){
      console.log(this.txtInput);
      var newMessages = this.$data.messages;
      newMessages.push({name: this.$data.me.name, text: this.txtInput})
      this.$data.messages = newMessages;
      this.$data.txtInput="";
    }
  },
});
