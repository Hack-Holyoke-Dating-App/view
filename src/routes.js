import Home from 'components/Home/home';
import Posts from 'components/Posts/posts';
import Post from 'components/Posts/post';
import Chat from 'components/Chat/chat';
import MemeSelect from 'components/MemeSelect/meme_select';
import Register from 'components/Register/register';
import CreatePost from 'components/Posts/createPost';
import EditPost from 'components/Posts/editPost';
import NotFound from 'components/NotFound/notFound';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/meme',
    component: MemeSelect
  },
  {
    path: '/chat',
    component: Chat
  },
  {
    path: '/posts',
    component: Posts
  },
  {
    path: '/posts/create',
    name: 'createPost',
    component: CreatePost
  },
  {
    path: '/post/:id',
    name: 'post',
    component: Post
  },
  {
    path: '/post/:id/edit',
    name: 'editPost',
    component: EditPost
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
