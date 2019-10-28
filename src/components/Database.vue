<template>
	<div>
		<app-functions></app-functions>
		<div id="database">
			<div class="container-fluid">
				<div class="row">
					<transition name="fade" mode="out-in">
						<div class="col-md-6 offset-md-3" v-if="addingFood" key="addFood">
							<form>
								<div class="form-group"> 
									<transition-group name="fade">
										<label key="1" :class="{addMessage: showNewFood}">Nazwa produktu &nbsp;</label>
										<label key="2" v-if="!$v.food.name.startsWithUppercase" class="error">musi rozpoczynać się wielką literą &nbsp;</label>
										<label key="3" v-if="!$v.food.name.minLength" class="error">musi zawierać co najmniej dwa znaki</label>
										<label key="4" v-if="submitted && !$v.food.name.required" class="error">jest wymagana</label>
									</transition-group>
									<input class="form-control" type="text" v-model="food.name" :class=" {'is-invalid': $v.food.name.$error}" :disabled="showNewFood" ref="foodName" @focus="showList = true" @blur="showList = false">
									<ul class="list-group" v-if="showList">
										<li 
											class="list-group-item" 
											v-for="food in filterAddedFoods">
											{{ food.name }}</li>
									</ul>
								</div>
								<div class="form-group"> 
									<label :class="{carbs: showNewFood}">Węglowodany (g/100g) &nbsp;</label>
									<transition name="fade">
										<label v-if="submitted && !$v.food.carbs.required" class="error">są wymagane</label>
									</transition>
									<input class="form-control" type="number" step="0.1" v-model="food.carbs" :class=" {'is-invalid': $v.food.carbs.$error}" :disabled="showNewFood">
								</div>
								<div class="form-group"> 
									<label :class="{protein: showNewFood}">Białko (g/100g) &nbsp;</label>
									<transition name="fade">
										<label v-if="submitted && !$v.food.proteins.required" class="error">jest wymagane</label>
									</transition>
									<input class="form-control" type="number" step="0.1" v-model="food.proteins" :class=" {'is-invalid': $v.food.proteins.$error}" :disabled="showNewFood">
								</div>
								<div class="form-group"> 
									<label :class="{fat: showNewFood}">Tłuszcze (g/100g) &nbsp;</label>
									<transition name="fade">
										<label v-if="submitted && !$v.food.fats.required" class="error">są wymagane</label>
									</transition>
									<input class="form-control" type="number" step="0.1" v-model="food.fats" :class=" {'is-invalid': $v.food.fats.$error}" :disabled="showNewFood">
								</div>
								<div class="row">
									<div class="col-md-6">
										<button type="button" class="btn btn-success" v-if="!showNewFood" @click="handleSubmit">Dodaj</button>
										<button type="button" class="btn btn-success" v-if="showNewFood" @click="returnToForm">Dodaj kolejny produkt</button>
									</div>
									<div class="col-md-6">
										<button type="button" class="btn btn-danger" @click="returnToDatabase">Wróc do bazy</button>
									</div>
								</div>
							</form>
						</div>
						<div class="col-md-6 offset-md-3" v-if="!addingFood" key="database">
							<div class="row">
								<div class="col-md-8">
									<div class="form-group">
										<input class="form-control" v-model="search" type="text" placeholder="Filtruj listę istniejących produktów">	
									</div>
								</div>
								<div class="col-md-4">
									<button class="btn btn-success" @click="addingFood = true">Dodaj nowy produkt</button>
								</div>
							</div>
							<ul class="list">
								<li 
									class="list-item"
									v-for="(product, key) in products"
									:key="key"
									v-if="!filteredFoodList"
									style="border-bottom: 0.5px solid white"> 
										<div class="row">
											<div class="col-md-6">
												{{ product.name }}
											</div>
											<div class="col-md-4">
												<span style="color: #ffc700;">W: {{ product.carbs }}g </span><span style="color: #29AF62;">B: {{ product.proteins }}g </span><span style="color: #EE393C;"> T: {{ product.fats }}g</span>
											</div>
											<div class="col-md-2 text-right">
												<i class="far fa-times-circle" @click="deleteFoodFromList(key)"></i>
											</div>
										</div>
									</li>
								<li 
									class="list-item" 
									v-for="(food, index) in filteredFoodList"
									style="border-bottom: 0.5px solid white">
									<div class="row">
										<div class="col-md-6">
											{{ food[1].name }}
										</div>
										<div class="col-md-4">
												<span style="color: #ffc700;">W: {{ food[1].carbs }}g </span><span style="color: #29AF62;">B: {{ food[1].proteins }}g </span><span style="color: #EE393C;"> T: {{ food[1].fats }}g</span>
											</div>
										<div class="col-md-2 text-right">
											<i class="far fa-times-circle" @click="deleteFoodFromList(food[0])"></i>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>

<script> 
	import { required, minLength } from 'vuelidate/lib/validators';
	import { startsWithUppercase } from '../customValidators.js';

	export default {
		name: 'Database',
		data() {
			return {
				test: [],
				testGetValue: '',
				myDate: new Date(),
				showList: false,
				products: {}, 
				search: '', 
				addingFood: false,
				confirmQuestion: 'Czy na pewno chcesz usunąć ten element z bazy?',
				confirmOptions: {
				    okText: 'Tak',
				    cancelText: 'Nie',
				    animation: 'zoom', 
				    verification: 'continue',
				    backdropClose: true
				},
				food: {
					name: '', 
					carbs: '', 
					proteins: '', 
					fats: ''
				}, 
				foodAdded: { 
					name: '', 
					carbs: '', 
					proteins: '', 
					fats: ''
				},
				submitted: false, 
				showNewFood: false, 
				backToDb: false
			}
		}, 
		computed: {
			filteredFoodList() {
				if (this.search.length > 0) {
					return Object.entries(this.products).filter(product => {
						return product[1].name.toLowerCase().includes(this.search.toLowerCase());
					});
				}
			}, 
			filterAddedFoods() {
				if (this.food.name.length > 0) {
					return Object.values(this.products).filter(product => {
						return product.name.toLowerCase().includes(this.food.name.toLowerCase());
					});
				}			
			}, 
			user() {
				console.log(this.$store.getters.user);
				return this.$store.getters.user;
			}
		},
		methods: {
			deleteFoodFromList(key) {
				this.$dialog.confirm(this.confirmQuestion, this.confirmOptions)
					.then((dialog) => {
				    	this.$http.delete('https://calorie-counter-2af66.firebaseio.com/foods/' + key + '.json')
							.then(response => {
								console.log('Item deleted');
								this.refreshList();
							});
				  	})
			  		.catch(() => {
			    		console.log('Clicked on cancel');
			  		});
			},
			refreshList() {
				this.$http.get('')
					.then(response => {
						return response.json();
					})
					.then(data => {
						this.products = data;
					})
			}, 
			displayNewFood() {
				this.foodAdded.name = this.food.name;
				this.foodAdded.carbs = this.food.carbs;
				this.foodAdded.proteins = this.food.proteins;
				this.foodAdded.fats = this.food.fats;
			},
			addFoodToList() {
				this.$http.post('', this.food)
					.then(response => {
						console.log(response.statusText);
					}, error => {
						console.log(error);
					});
			},
			refreshList() {
				this.$http.get('')
					.then(response => {
						return response.json();
					})
					.then(data => {
						this.products = data;
						console.log(this.products);
					});
			},
			returnToForm() {
				this.refreshList();
				this.showNewFood = false;
				this.submitted = false;
				this.clearInputs();
				setTimeout(() => {
					this.$refs.foodName.focus();
				}, 0);
			},
			clearInputs() {
				this.food.name = '';
				this.food.carbs = '';
				this.food.proteins = '';
				this.food.fats = '';
				setTimeout(() =>{
					this.$v.$reset();
				}, 0);				
			},
			handleSubmit() {
        this.submitted = true;
        this.$v.$touch();
        
        if (this.$v.$invalid) {
            return;
        } else {
        	this.showNewFood = true;
					this.displayNewFood();
					this.addFoodToList();
        }
      }, 
      returnToDatabase() {
      	this.submitted = false;
      	this.addingFood = false;
      	this.showNewFood = false;
      	this.clearInputs();
      	this.$http.get('')
      		.then(response => {
						return response.json();
					})
					.then(data => {
						this.products = data;
						this.$emit('food-added', this.backToDb);
			      			this.$emit('database-updated', this.products);
					});
      }
		},
		validations: {
			food: {
				name: {
					required, 
					minLength: minLength(2), 
					startsWithUppercase
				}, 
				carbs: {
					required
				}, 
				proteins: {
					required
				}, 
				fats: {
					required
				}
			}
		},
		created() {
			this.refreshList();
		}
	};

</script>

<style scoped> 

	* {
		font-size: large;
	}
	
	#database {
		height: 80vh;
		padding-top: 10vh;
	}

	.error {
		color: red;
	}

	.list {
		max-height: 50vh;
		overflow-y: scroll;
		overflow-x: hidden;
		list-style-type: none;
		padding-left: 0;
	}

	.list-item {
		transition: ease-in 0.5s;
		font-size: large;
	}

	.form-control,  {
		opacity: 0.8;
	}

	.btn-success {
		width: 100%;
		opacity: 0.9;
	}

	.fa-times-circle {
		cursor: pointer;
		margin-right: 1vw;
		transition: color ease-in-out 0.2s;
	}
	
	.fa-times-circle:hover {
		color: rgb(206, 72, 72);
	}

	.list-group-item {
		opacity: 0.9;
		border-bottom: 1px white;
		list-style-type: none;
		color: black;
	}

	.list-group {
		overflow-y: scroll;
		max-height: 8vh;
		border-radius: 5px;
	}

	button {
		width: 100%;
		opacity: 0.9;
	}

	input {
		opacity: 0.8;
		color: black;
	}

	/*TEXT COLOR CLASSES*/

		.error {
			color: red;
		}

		.addMessage {
			color: #2f36ef;
		}

		.carbs {
			color: #ffc700;
		}

		.protein {
			color: #29AF62;
		}

		.fat {
			color: #EE393C;
		}
	/*ANIMATIONS*/
	    @keyframes fade-in {
	        from {
	            opacity: 0;
	        }
	        to {
	            opacity: 1;
	        }
	    }

	    @keyframes fade-out {
	        from {
	            opacity: 1;
	        }
	        to {
	            opacity: 0;
	        }
	    }

	    .fade-enter-active {
	        animation: fade-in ease-in 0.4s;
	    }

	    .fade-leave-active {
	        animation: fade-out ease-out 0.4s;
	    }
	/*SCROLLBAR*/

		/* width */
		::-webkit-scrollbar {
		  width: 5px;
		}

		/* Track */
		::-webkit-scrollbar-track {
		  background: transparent;
		}
		 

		::-webkit-scrollbar-thumb {
		  background: #c4c4c4; 
		  border-radius: 5px;
		}

		::-webkit-scrollbar-thumb:hover {
		  background: #99a39d; 
		}

</style>