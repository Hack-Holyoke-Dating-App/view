import Vue from 'vue';
import VeeValidate from 'vee-validate';
import { API_BASE } from '../../config/constants';
import axios from 'axios';


Vue.use(VeeValidate);

import template from './meme_select.html';

export default Vue.extend({
  template,

  data() {
    return {
        memes:[],
        currentMemeIdx: 0,
        id: this.$route.params.id,
    };
  },
  mounted(){
    axios.get(API_BASE + "/api/memes").then(resp => {
        const memes = resp.data.memes;
        const newMemes = []
        for(var i in memes){
            const meme = memes[i];
            meme.image = API_BASE + meme.image_path
            newMemes.push(meme)
        }
        console.log(newMemes);
        this.$data.memes = newMemes;
    });
    
  },
  methods: {
      postMeme: function(vote){
        const memes = this.$data.memes;
        const N = memes.length;
        const idx = this.$data.currentMemeIdx ;
        const meme = memes[idx];
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("postMeme" + JSON.stringify(user));
        console.log("postMeme" + JSON.stringify(meme));
        const memeRatingWrapper = {
            "meme_rating": {
                "user_id": String(user._id),
                "meme_id": String(meme._id),
                "liked": vote
            }
        };
        const url = API_BASE + "/api/memes/" + meme._id;
        console.log(url);
        console.log(memeRatingWrapper);
        axios.post(url, memeRatingWrapper).then(resp => {
            console.log(resp);
            if (this.$data.currentMemeIdx >= N-1){
                this.$router.push("/chat");
            }
            if (this.$data.currentMemeIdx < N){
                this.$data.currentMemeIdx  += 1;
            } 
            console.log(this.$data.currentMemeIdx);
        })
      },
      voteYea: function(e){
          console.log("select voteYea")
          if (e){
            this.postMeme(true)
          }
      },
      voteNay: function(e){
        console.log("select voteNay")
        if (e){
            this.postMeme(false)
        }
    }
  }
});
