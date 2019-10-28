<template>
	<div>
		<app-functions></app-functions>
	  <div class="welcome">
			<br>
			<h1 class="title">Twoja idealna dieta na wyciągnięcie ręki</h1>
			<p class="title">Dodaj produkt i rozpocznij tworzenie dziennika</p>
			<router-link to="/chooseFood" exact><i class="fas fa-cart-plus"></i></router-link>
		</div>
	</div>
</template>

<script>

    export default {
    	computed: {
    		token() {
    			return this.$store.getters.token;
    		}
    	},
    	methods: {
    		/*fetchUser() {
    			if (!this.token) {
    				return 
    			}

    			axios.get('https://calorie-counter-2af66.firebaseio.com/users.json' + '?auth=' + this.token)
					  .then(res => {
					    console.log(res);
					    const data = res.data;
	     				let finalUser;
	     				for (let key in data) {
	     					const user = data[key];
	     					const currentEmail = localStorage.getItem('userEmail');
	     					if (user.email == currentEmail) {
	     						user.id = key;
	     						finalUser = user;
	     					}
	     				}
	     				this.$store.commit('storeUser', finalUser);
					  })
					  .catch(err => {
					    console.log(err);
					  });
    		}*/
    	},
      	created() {
     		//this.fetchUser();
    	}
    };
</script>

<style scoped>

	.welcome {
		height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}

	.fa-cart-plus {
		font-size: 200%;
		cursor: pointer;
		animation: pulse 1s infinite;
	}

</style>
