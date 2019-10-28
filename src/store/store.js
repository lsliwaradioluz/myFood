import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { router } from '../router'

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		myDate: new Date(),
		CPM: 0,
		tokenId: null, 
		userId: null, 
		user: null, 
		signInError: 0, 
		signUpError: null
	},
	getters: {
  	myDate: state => state.myDate,
  	user: state => state.user, 
  	token: state => state.tokenId, 
  	signInError: state => state.signInError, 
  	signUpError: state => state.signUpError
	}, 
	mutations: {
		authUser(state, data) {
			state.tokenId = data.tokenId;
			state.userId = data.userId;
		},
		storeUser(state, user) {
			state.user = user;
		}, 
		logOut(state) {
			state.tokenId = null;
			state.userId = null;
			state.user = null;
			router.push({ path: '/' });
			localStorage.removeItem('expiresIn');
		    localStorage.removeItem('token');
		    localStorage.removeItem('userId');
		    localStorage.removeItem('userEmail');
		},
		passUserToLocalStorage(state, data) {
			const now = new Date();
			const expirationTime = new Date(now.getTime() + data.expiresIn * 1000); 
			localStorage.setItem('token', data.tokenId);
			localStorage.setItem('expiresIn', expirationTime);
			localStorage.setItem('userId', data.userId);
			localStorage.setItem('userEmail', data.email);
		}, 
		storeUserInDb(state, userData) {
			if (!state.tokenId) {
				return
			}
			axios.post('https://calorie-counter-2af66.firebaseio.com/users.json' + '?auth=' + state.tokenId, userData)
				.then(res => console.log(res))
				.catch(err => console.log(err));
		}, 
		manageSignInError(state, action) {
			if (action == 'correct') {
				state.signInError = 0;
			} else if (action == 'incorrect') {
				state.signInError = 1;
			}
		}, 
		manageSignUpError(state, message) {
			if (message) {
				state.signUpError = message;
			} else {
				state.signUpError = null;
			}
		}
	},
	actions: {
		signUp({commit, dispatch}, newUserData) {
			const authData = {
				email: newUserData.email, 
				password: newUserData.password, 
			};
			axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDQ01pBadNm9DTmauNGcXFv4ouglwBDkqI', {
					email: authData.email, 
					password: authData.password, 
					returnSecureToken: true
				})
			  .then(res => {
			    console.log(res);
			    const data = {
						tokenId: res.data.idToken, 
						userId: res.data.localId,
						email: res.data.email,  
						expiresIn: res.data.expiresIn
					};

					commit('authUser', data);
					commit('storeUser', authData);
					router.push({ path: '/Start' });
					dispatch('autoLogOut', data.expiresIn);
					commit('passUserToLocalStorage', data);
					commit('manageSignUpError');
			  })
			  .catch(error => {
			    console.log(error.response);
			    commit('manageSignUpError', error.response.data.error.message);
			  })
		},
		signIn({commit, dispatch}, authData) {
			axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDQ01pBadNm9DTmauNGcXFv4ouglwBDkqI', {
				email: authData.email, 
				password: authData.password, 
				returnSecureToken: true
			})
			.then(res => {
		    console.log(res);
		    const data = {
					tokenId: res.data.idToken, 
					userId: res.data.localId,
					email: res.data.email,  
					expiresIn: res.data.expiresIn
				};
				commit('authUser', data);
				commit('storeUser', authData);
				router.push({ path: '/Start' });
				dispatch('autoLogOut', data.expiresIn);
				commit('passUserToLocalStorage', data);
				commit('manageSignInError', 'correct');
		  })
		  .catch(error => {
		    console.log(error);
		    commit('manageSignInError', 'incorrect');
		  });
		}, 
		autoLogOut({ commit }, expirationTime) {
			setTimeout(() => {
				commit('logOut');
			}, expirationTime * 1000);
		}, 
		autoLogin({commit}) {
      const token = localStorage.getItem('token');
      if (!token) {
          return 
      }
      const now = new Date();
      const expirationDate = localStorage.getItem('expiresIn');

      if (now >= expirationDate) {
          return
      }
      const userId = localStorage.getItem('userId');
      const userEmail = localStorage.getItem('userEmail');
      commit('authUser', {
          tokenId: token, 
          userId: userId
      });
      commit('storeUser', {
      	email: userEmail
      });
    } 
	}
});