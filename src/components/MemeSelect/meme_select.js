import Vue from 'vue';
import VeeValidate from 'vee-validate';


Vue.use(VeeValidate);

import template from './meme_select.html';

export default Vue.extend({
  template,

  data() {
    return {
        memes:[
            {image: "https://img-9gag-fun.9cache.com/photo/a5MP40O_700bwp.webp"},
            {image: "https://img-9gag-fun.9cache.com/photo/aWYWzo3_700bwp.webp"},
            {image: "https://img-9gag-fun.9cache.com/photo/aGZwm87_700bwp.webp"},
        ],
        currentMemeIdx: 0,
        id: this.$route.params.id,
    };
  },
  methods: {
      postMeme: function(vote){
        console.log(vote);
        const memes = this.$data.memes;
        const N = memes.length;
        console.log(memes);
        console.log(N);
        if (this.$data.currentMemeIdx >= N-1){
            this.$router.push("/chat");
        }
        if (this.$data.currentMemeIdx < N){
            this.$data.currentMemeIdx  += 1;
        } 
        console.log(this.$data.currentMemeIdx);
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
