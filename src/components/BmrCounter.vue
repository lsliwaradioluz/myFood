<template>
	<div>
		<app-functions></app-functions>
		<div id="bmrCounter">
			<div class="container-fluid">
				<div class="row">
					<transition name="blind" mode="out-in">
						<div class="col-md-4 offset-md-4" v-if="!showResult" key="form">
								<div class="row">
									<div class="col-md-6 text-right">
										<input type="radio" id="female" value="Female" v-model="sex">
										<label for="female">Jestem kobietą</label>
									</div>
									<div class="col-md-6">
										<input type="radio" id="male" value="Male" v-model="sex">
										<label for="male">Jestem mężczyzną</label>
									</div>
								</div>
								<div class="row">
									<div class="col-md-12">
										<input
											ref="age"
											:class=" {'is-invalid': $v.age.$error}"
											class="form-control" 
											type="number"
											min="3"
											max="100"
											placeholder="Wiek (lata)"
											v-model="age">
										<div class="error">
											<span v-if="submitted && !$v.age.required">To pole jest wymagane</span>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-md-12">
										<input
											:class=" {'is-invalid': $v.height.$error}"
											class="form-control" 
											type="number" 
											min="100"
											max="220"
											placeholder="Wzrost (cm)"
											v-model="height">
										<div class="error">
											<span v-if="submitted && !$v.height.required">To pole jest wymagane</span>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-md-12">
										<input
											:class=" {'is-invalid': $v.weight.$error}"
											class="form-control" 
											type="number"
											min="20"
											max="150"
											placeholder="Waga (kg)"
											v-model="weight">
										<div class="error">
											<span v-if="submitted && !$v.weight.required">To pole jest wymagane</span>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-md-12">
										<select class="form-control" v-model="activity" :class=" {'is-invalid': $v.activity.$error}">
											<option value="" disabled selected class="text-center">Jaka jest moja codzienna aktywność fizyczna?</option>
				  							<option value="1.2">Brak aktywności, praca siedząca (ani jednego treningu w tygodniu)</option>
				  							<option value="1.4">Niska aktywność (praca siedząca i 1-2 treningi w tygodniu)</option>
				  							<option value="1.6">Średnia aktywność (praca siedząca i treningi 3-4 razy w tygodniu)</option>
				  							<option value="1.8">Wysoka aktywność (praca fizyczna i 3-4 treningi w tygodniu)</option>
				  							<option value="2.2">Bardzo wysoka aktywność (zawodowi sportowcy, osoby codziennie trenujące)</option>
										</select>
										<div class="error">
											<span v-if="submitted && !$v.activity.required">To pole jest wymagane</span>
										</div>
									</div>
								</div>
								<div class="row" v-if="!showResult">
									<div class="col-md-12 text-center">
										<button class="btn btn-success" @click="calculateCPM">Oblicz CPM</button>
									</div>
									<div class="col-md-12 text-center">
										<transition name="fade" mode="out-in">
											<p key="one" v-if="!showInfo" style="display: inline-block; cursor: pointer;" @click="showInfo = true">Czym jest tajemnicze CPM?</p>
											<p key="two" v-if="showInfo" @click="showInfo = false" style="cursor: pointer">CPM to skrót od "Całkowitej Przemiany Materii". Informuje nas o tym, ile kalorii powinniśmy spożywać każdego dnia, jako osoby w danych wieku, o danym wzroście, wadze i przy określonej aktywności fizycznej.</p>
										</transition>
									</div>
								</div>
						</div>
						<div class="col-md-4 offset-md-4" v-if="showResult" key="result">
							<div class="row">
								<div class="col-md-12 text-center">
									<p>Z podanych przez Ciebie danych wynika, że tylko leżąc i pachnąc zużywasz <span style="color: red;">{{ PPM }}</span> kcal każdego dnia.</p>
									<p>Żyjąc normalnie i angażując się w aktywność fizyczną na wskazanym przez Ciebie poziomie, powinieneś spożywać <span style="color: red;">{{ CPM }}</span> kcal każdego dnia.</p>
									<div class="row">
										<div class="col-md-6">
											<router-link to="/Diary" exact><button class="btn btn-success" @click="saveCPM">Zapisz wynik</button></router-link>
										</div>
										<div class="col-md-6">
											<button class="btn btn-danger" @click="recalculateCPM">Policz od nowa</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</transition>
				</div>
			</div> 
		</div>
	</div>	
</template>

<script>
	import { required } from 'vuelidate/lib/validators';

	export default {
		name: 'BmrCounter',
		data() {
			return {
				sex: 'Female',
				age: '', 
				height: '', 
				weight: '', 
				activity: '', 
				PPM: 0,
				CPM: 0,
				showResult: false,
				showInfo: false,
				submitted: false
			}
		},
		methods: {
			calculateCPM() {
				this.submitted = true;
				this.$v.$touch();
				if (this.sex == 'Female' && this.$v.$invalid == false) {
					this.showResult = true;
					this.PPM = Math.round((9.99 * this.weight) + (6.25 * this.height) - (4.92 * this.age) - 161);
					this.CPM = Math.round(this.PPM * this.activity);
				} else if (this.sex == 'Male' && this.$v.$invalid == false) {
					this.showResult = true;
					this.PPM = Math.round((9.99 * this.weight) + (6.25 * this.height) - (4.92 * this.age) + 5);
					this.CPM = Math.round(this.PPM * this.activity);
				} else {
					return
				}
			}, 
			recalculateCPM() {
				this.showResult = false;
				this.$v.$reset();
				this.submitted = false;
				this.age = ''; 
				this.height = ''; 
				this.weight = ''; 
				this.activity = ''; 
			}, 
			saveCPM() {
				this.$store.state.CPM = this.CPM;
			}
		}, 
		validations: {
			age: { required }, 
			height: { required },
			weight: { required }, 
			activity: { required }
		},
		mounted() {
			this.$refs.age.focus();
		}
	};
</script>

<style scoped>

	* {
		font-size: large;
	}

	#bmrCounter {
		height: 90vh;
		transition: ease-in 0.5s;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.error {
		height: 1.5rem;
		text-align: center;
	}

	.error span {
		color: red;
	}

	input, select, option {
		opacity: 0.8;
		text-align: center;
		color: black;
	}

	button {
		opacity: 0.9;
		width: 100%;
	}
</style>