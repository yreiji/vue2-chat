import Vue from "vue";
import VueRouter from "vue-router";
// import HomeView from '../views/HomeView.vue'
// import UserList from "../views/UserList.vue";
import RoomList from "../views/RoomList.vue";
import ChatBoard from "../views/ChatBoard.vue";
import Login from "../views/LoginView.vue";
import SignUp from "../views/SignUp.vue";

Vue.use(VueRouter);

//ルーティング
const routes = [
  {
    path: "/", // /でアクセスするとUserListコンポーネントが表示される
    name: "RoomList",
    component: RoomList,
    meta: { requiresAuth: true }, //ユーザ認証が必要なページであると示す
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/chat",
    name: "ChatBoard",
    component: ChatBoard,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// //ページを開くごとに実行される
// router.beforeEach((to, from, next) => {
//   //認証が必要なページとその判定を取得
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
//   if (requiresAuth) {
//     const user = sessionStorage.getItem("user") //セッションからユーザ情報を取得
//     console.log(JSON.parse(user)) //JSONからObject変換

//     if(!user) {
//       next({
//         path: "/login",
//         query: { redirect: to.fullPath },
//       });
//     } else {
//       next(); // next() を常に呼び出すようにしてください!
//     }
//   }
// });

export default router;
