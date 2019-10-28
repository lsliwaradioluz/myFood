<template>
	<div class="main">
		<div class="background">
			<div class="general-container">
				<div class="header-container">
					<h1 class="title">Dodaj. Policz. Szybko</h1>
					<p class="subtitle">Z kalkulatorem makroskładników myFood masz kontrolę nad swoim odżywianiem. Już dziś wypróbuj nasze darmowe narzędzie do monitorowania spożywanych kalorii.</p>
				</div>
				<transition name="blind" mode="out-in">
					<div class="form-container" v-if="showSignInInput" key="sign-in">
						<div class="sign-in">
							<div class="inputs">	
								<input v-model="checkEmail" type="email" class="form-control" placeholder="E-mail" :class=" {'is-invalid': signInError == 1}">
								<div class="error"><span v-if="signInError == 1">Niepoprawny email lub hasło</span></div>
								<input v-model="checkPassword" type="password" class="form-control" placeholder="Hasło" :class=" {'is-invalid': signInError == 1}">
								<button class="btn btn-signin btn-success" @click="signIn">Zaloguj</button>
							</div>
						</div>
						<p class="no-account" @click="switchForm('signup')" v-if="showSignInInput" key="sign-in">Nie masz jeszcze konta?</p>
					</div>
					<div class="form-container" v-if="!showSignInInput" key="sign-up">
						<div class="sign-up">
							<div class="inputs">
								<input 
									v-model="email" 
									type="email" 
									class="form-control" 
									placeholder="E-mail" 
									:class=" {'is-invalid': submitted && !$v.email.email || submitted && !$v.email.required || signUpError == 'EMAIL_EXISTS'}"
									@keyup="clearSignUpError">
								<div class="error">
									<span v-if="submitted && !$v.email.email">Niepoprawny adres email</span>
									<span v-if="submitted && !$v.email.required">Adres email jest wymagany</span>
									<span v-if="signUpError == 'EMAIL_EXISTS'">Konto o podanym adresie email już istnieje</span>
								</div>
								<input 
									v-model="password" 
									type="password" 
									class="form-control" 
									placeholder="Hasło" 
									:class=" {'is-invalid': submitted && !$v.password.required || submitted && !$v.password.minLength || submitted && !$v.repeatPassword.sameAsPassword && $v.password.minLength}">
								<div class="error">
									<span v-if="submitted && !$v.password.required">Hasło jest wymagane</span>
									<span v-if="submitted && !$v.password.minLength">Hasło musi mieć co najmniej 6 znaków</span>
									<span v-if="submitted && !$v.repeatPassword.sameAsPassword && $v.password.minLength">Podane hasła nie są takie same</span>
								</div>
								<input 
									v-model="repeatPassword" 
									type="password" 
									class="form-control" 
									placeholder="Powtórz Hasło" 
									:class=" {'is-invalid': submitted && !$v.repeatPassword.sameAsPassword && $v.password.minLength}">
								<button class="btn btn-signup btn-success" @click="signUp">Utwórz konto</button>
							</div>
						</div>
						<p class="no-account" @click="switchForm('signin')" v-if="!showSignInInput" key="sign-up">Mam już konto, chcę się zalogować</p>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
	import { required, minLength, maxLength, sameAs, email } from 'vuelidate/lib/validators';

	export default {
		data() {
			return {
				email: '',
				password: '', 
				repeatPassword: '',
				checkEmail: 'gosc@myfood.com',
				checkPassword: 'gosc123', 
				showSignInInput: true, 
				submitted: false
			}
		},
		computed: {
			signInError() {
				return this.$store.getters.signInError;
			}, 
			signUpError() {
				return this.$store.getters.signUpError;
			}
		},
		methods: {
			signUp() {
				this.submitted = true;
				if (this.$v.repeatPassword.sameAsPassword) {
					this.$store.dispatch('signUp', {
						email: this.email, 
						password: this.password
					});
				}
			}, 
			signIn() {
				this.$store.dispatch('signIn', {
					email: this.checkEmail, 
					password: this.checkPassword
				});
			}, 
			switchForm(to) {
				if (to == 'signup') {
					this.showSignInInput = false;
					this.$store.commit('manageSignInError', 'correct');
				} else if (to == 'signin') {
					this.showSignInInput = true;
				}
			}, 
			clearSignUpError() {
				this.$store.commit('manageSignUpError');
			}
		}, 
		validations:{
			email: {
				email,
				required
			},
			password: {
				required, 
				minLength: minLength(6)
			}, 
			repeatPassword: {
				sameAsPassword: sameAs('password')
			}
		}
	};
</script>

<style scoped>

	@import url('https://fonts.googleapis.com/css?family=Amatic+SC:700&display=swap');

	* {
		color: rgb(232, 222, 222);
	}
	
	.main {
		height: 100vh;
		background: url('../../IMG/kobieta_obiad.jpg');
		background-size: cover;
	}

	.background {
		height: 100vh;
		width: 100vw;
		background-color: rgb(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
	}

	.general-container {
		padding: 10% 0;
		width: 100vw;
		height: 100vh;
	}

	.form-container {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.header-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.registration-container {
		width: 50vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.title {
		font-size: 4rem;
		font-weight: 800;
		width: 40%;
		margin-bottom: 5vh;
		font-family: 'Amatic SC', cursive;
		text-align: center;
	}

	.subtitle {
		width: 40%;
		margin-bottom: 5vh;
		text-align: center;
	}

	.sign-up, .sign-in {
		width: 40%;
	}

	.form-control {
		background-color: rgb(255, 255, 255, 0.6);
		border: rgb(255, 255, 255, 0.6);
		color: initial;
	}

	.btn-signup, .btn-signin {
		width: 100%;
		margin-top: 2%;
	}

	.no-account {
		cursor: pointer;
	}

	.no-account:hover {
		text-decoration: underline;
	}

	.error {
    height: 1.5rem;
  }

  .error span {
  	color: red;
  }

</style>