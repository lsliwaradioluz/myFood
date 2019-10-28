import Vue from 'vue'
import VueRouter from 'vue-router'
import Diary from './components/Diary.vue';
import FoodChoice from './components/FoodChoice.vue';
import BmrCounter from './components/BmrCounter.vue';
import Database from './components/Database.vue';
import Start from './components/Start.vue';
import Users from './components/Users.vue';
import { store } from './store/store.js'

Vue.use(VueRouter);

const routes = [
	{ path: '', component: Users },
	{ path: '/Start', component: Start },
	{ path: '/Diary', component: Diary, name: 'Diary' }, 
	{ path: '/chooseFood', component: FoodChoice }, 
	{ path: '/BMR', component: BmrCounter, name: 'BmrCounter'}, 
	{ 
		path: '/Database', 
		component: Database, 
		beforeEnter: (to, from, next) => {
			if (store.state.user.email == 'admin@myfood.com') {
				next();
			} else {
				alert('Nie masz uprawnień');
			}
		} 
	}
];

export const router = new VueRouter({
	routes
});

router.beforeEach((to, from, next) => {
	if (store.state.tokenId != null || store.state.tokenId == null && to.fullPath == '/' || store.state.tokenId == null && localStorage.getItem('token')) {
		next();
	} else {
		router.push({ path: '/' });
	}
});