import Vue from 'vue';
import VeeValidate from 'vee-validate';
import axios from 'axios';
import { API_BASE } from '../../config/constants';
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

export const SocketInstance = socketio(API_BASE);

Vue.use(VueSocketIO, SocketInstance)
Vue.use(VeeValidate);

// import { postsResource } from 'src/util/resources';
import template from './chat.html';

export default Vue.extend({
  template,

  data() {
    const mock =  []
    return {
      post: {},
      message: null,
      users:[],
      messages: mock,
      mock: mock,
      currentUserIdx: 0,
      currentConvoId: null,
      me: {name: ""},
      id: this.$route.params.id,
      txtInput: '',
      sentiment: null,

    };
  },
  mounted: function(){
    var userStr = localStorage.getItem("user");
    this.$data.me = JSON.parse(userStr);
    const matchURL = API_BASE + "/api/users/" + this.$data.me._id + "/matches";
    axios.get(matchURL).then(resp => {
        console.log("MATCHES");
        if (resp){
            console.log(resp.data)
            this.$data.users = resp.data.users;
        }
    });
    
  },
  computed: {
    getCurrentUser: function(){
        if (this.$data.users.length > 0){
          return this.$data.users[this.$data.currentUserIdx];
        }
        return "No One :("
    }
  },
  watch: {
    currentConvoId: function(convo_id){
        const self = this;
        if (convo_id){

            const topic = "/conversations/" + convo_id + "/new_message";
            const user_me = this.$data.me;
            this.$options.sockets[topic] = (data) => {
                const message = data.message;
                const user_you = this.$data.users[this.$data.currentUserIdx];
                const wrappedMsg = {
                    name: message.sending_user_id == user_you._id ? user_you.name : "You",
                    text: message.text,
                    time: message.time
                }
                var messages = self.$data.messages;
                messages.push(wrappedMsg);

                self.$data.messages = messages;
            }

            const insight_topic = "/conversations/" + convo_id + "/user/" + user_me._id + "/new_insight";
            console.log("insight: " + insight_topic);
            this.$options.sockets[insight_topic] = (data) => {
                console.log(data);
                this.$data.sentiment = data.data;
            }
        }  
    }
  },
  sockets: {
    connect: function(){
        console.log("socket connected");
    }
  },
  methods: {
    selectUser: function(index){
        const user = this.$data.users[index];
        console.log(user.name);
        this.$data.currentUserIdx = index;
        this.reloadChat();
    },
    addMessage: function(){
        const convo_id = this.$data.currentConvoId;
        const me = this.$data.me;
        if (convo_id){
            const msgWrap = {
                message:{
                    conversation_id: convo_id,
                    sending_user_id: me._id,
                    time: new Date().getTime(),
                    text: this.txtInput
                }
            }
            console.log("NEW MSG" + JSON.stringify(msgWrap));
            axios.post(API_BASE + "/api/conversations/" + convo_id + "/messages", msgWrap).then(resp => {
                if (resp){
                    console.log("RECV" + JSON.stringify(resp.data.message));
                }
            });
            // this.$socket.emit("/conversations/" + convo_id + "/new_message", this.txtInput)
            // var newMessages = this.$data.messages;
            // newMessages.push({name: this.$data.me.name, text: this.txtInput})
            // this.$data.messages = newMessages;
            this.$data.txtInput="";
        }
        
    },
    reloadChat: function(){
      const user_me = this.$data.me;
      const user_you_idx = this.$data.currentUserIdx;
      const user_you = this.$data.users[user_you_idx];

      console.log("RELOAD:\n" + JSON.stringify(user_me) + "\n" + JSON.stringify(user_you));
      axios.get(API_BASE+"/api/users/"+user_me._id+"/conversations").then(resp => {
        console.log("MATCHES");
        console.log(resp.data)
        const convos = resp.data.conversations;
        var user_you_found = false;
        for(var i in convos){
          const convo = convos[i];
          if (convo.user_a_id == user_you._id || convo.user_b_id == user_you._id){
            user_you_found = true;
            this.$data.currentConvoId = convo._id;
            axios.get(API_BASE+"/api/conversations/" + convo._id + "/messages").then(resp => {
              const messages = resp.data.messages;
              var wrappedMsgs = [];
              for (var j in messages){
                const message = messages[j];
                const wrappedMsg = {
                  name: message.sending_user_id == user_you._id ? user_you.name : "You",
                  text: message.text,
                  time: message.time
                }
                wrappedMsgs.push(wrappedMsg);
              }
              if (wrappedMsgs.length == 0){
                this.$data.messages = [{name: "SERVER", text: "Conversation found " + convo._id}]
              } else {
                  this.$data.messages = wrappedMsgs;
              }
            });
          } 
          if (user_you_found) break;
        }
        if (!user_you_found){
            const newConvo = {
                "conversation": {
                    "user_a_id": user_me._id,
                    "user_b_id": user_you._id
                }
            }
            axios.post(API_BASE + "/api/conversations", newConvo).then(resp => {
                if (resp){
                    console.log("NEW CONVO " + JSON.stringify(resp.data));
                    const convo = resp.data.conversation;
                    this.$data.currentConvoId = convo._id;
                    this.$data.messages = [{name: "SERVER", text: "Conversation created " + convo._id}]
                }
            })
        }
        
      });
    }
  },
});
