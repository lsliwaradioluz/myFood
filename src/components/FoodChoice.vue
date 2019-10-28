<template>
	<div>
		<app-functions></app-functions>
		<div class="container-fluid">
			<br>
			<div class="row" >
				<div class="col-md-12">
					<div class="row">
						<div class="col-md-6">
							<div class="product-list-container">
								<div id="foodNameInput" ref="inputBox">
									<input 
										ref="foodName"
										type="text"
										autocomplete="off"
										placeholder="Co dziś zjadłeś?"
										v-model="search"
										class="form-control">
									<ul class="product-list" v-if="showList">
										<li 
											class="food-name" 
											v-for="product in filteredFoodList"
											@click="chooseFood(product.index)">
											{{ product.name }}</li>
									</ul>
								</div>
							</div>
						</div>
						<transition name="fade">
							<div class="col-md-3" v-if="showCharts">
								<input 
									type="text" 
									id="foodQuantityNumber" 
									v-model="foodWeight" 
									ref="foodQuantity"
									autocomplete="off"
									class="form-control">
							</div>
						</transition>
						<transition name="fade">
							<div class="col-md-3" v-if="showCharts">
								<select id="foodQuantityUnit" v-model="unit" class="form-control">
									<option>g</option>
									<option>ml</option>
								</select>
							</div>
						</transition>
					</div>
				</div>
			</div>
			<div class="row" v-if="showCharts">
				<div class="col-md-3 chart">
	        		<apexchart type="pie" width="300" :options="chartData.chartOptions" :series="chartData.series"></apexchart>
	        	</div>
	        	<div class="col-md-3 chart-caption">
	        		<p><i class="fas fa-square" style="color: #ffc700; margin-right: 1%"></i>Węglowodany: {{ carbohydrates }}g</p>
	        		<p><i class="fas fa-square" style="color: #29AF62; margin-right: 1%"></i>Białko: {{ proteins }}g</p>
	        		<p><i class="fas fa-square"  style="color: #EE393C; margin-right: 1%"></i>Tłuszcz: {{ fats }}g</p>
	        		<p><i class="fas fa-square" style="color: #2f36ef; margin-right: 1%"></i>Kalorie: {{ calories }}kcal</p>	        		
	        	</div>
	        	<div class="col-md-6 chart-caption">
	        		<h4>Czy wiesz, że...</h4>
	        		<p>Aby spalić kalorie zawarte w tym produkcie, potrzeba:</p> 
	        		<p>- {{ bikingTime }} minut jazdy na rowerze</p>
	        		<p>- {{ fitnessTime }} minut treningu fitness</p>
	        		<p>- {{ runningTime }} minut joggingu</p>
	        		<div class="row">
		        		<div class="col-md-6 button-wrapper">
							<router-link to="/Diary" exact><button class="btn btn-secondary">Wróć</button></router-link>
						</div>
						<div class="col-md-6 button-wrapper">
							<router-link to="/Diary" exact><button class="btn btn-danger" @click="disableButton = true" :disabled="disableButton">Dodaj produkt</button></router-link>
						</div>
					</div>
	        	</div>
	        </div>
		</div>
	</div>
</template>

<script> 
	export default {
		name: 'FoodChoice',
		data() {
			return {
				disableButton: false,
				showList: false,
				showCharts: false,
				search: '', 
				foodWeight: 0,
				unit: 'g',
				products: [],
				activities: {
					biking: 292,
					running: 606, 
					fitness: 365
				},
				carb: 0, 
				protein: 0, 
				fat: 0,
				calorie: 0,
				chartData: {
					series: [],
			        chartOptions: {
			        	labels: ['Węglowodany %', 'Białko %', 'Tłuszcz %'],
			        	colors: ['#ffc700', '#29AF62', '#EE393C'],
			        	legend: {
			                show: false
			              }
			        }
				}
			}
		}, 
		computed: {
			filteredFoodList() {

				const namesArray = [];
				this.products.forEach((cur, index) => {
					namesArray.push({name: cur.name, index: index});
				});
				
				return namesArray.filter(product => {
					return product.name.toLowerCase().includes(this.search.toLowerCase());
				});
			}, 
			carbohydrates() {
				return (this.carb * this.foodWeight / 100).toFixed(1);
			}, 
			proteins() {
				return (this.protein * this.foodWeight / 100).toFixed(1);
			}, 
			fats() {
				return (this.fat * this.foodWeight / 100).toFixed(1);
			},
			calories() {
				return Math.round(this.calorie * this.foodWeight / 100);
			},
			bikingTime() {
				return Math.round(((this.calorie * this.foodWeight / 100) * 60) / this.activities.biking);
			},
			runningTime() {
				return Math.round(((this.calorie * this.foodWeight / 100) * 60) / this.activities.running);
			},
			fitnessTime() {
				return Math.round(((this.calorie * this.foodWeight / 100) * 60) / this.activities.fitness);
			}
		}, 
		watch: {
			search() {
				if (this.search == '') {
					this.unanimateInput();
					return this.showList = false;
				} else {
					return this.showList = true;
				}
			} 
		}, 
		methods: {
			chooseFood(index) {

				this.animateInput();
				let percentageCarbs, percentageProtein, percentageFat, macrosArray;
				
				new Promise((resolve, reject) => {
					this.search = event.target.innerText;
					resolve();
				}).then(() => {
					this.showList = false;
					this.foodWeight = 100;
				});

				this.carb = parseFloat(this.products[index].carbs);
				this.protein = parseFloat(this.products[index].proteins);
				this.fat = parseFloat(this.products[index].fats);
				this.calorie = Math.round(this.carb*4 + this.protein*4 + this.fat*9);

				percentageCarbs = (this.carb*4/this.calorie)*100; 
				percentageProtein = (this.protein*4/this.calorie)*100;
				percentageFat = (this.fat*9/this.calorie)*100;
				macrosArray = [percentageCarbs, percentageProtein, percentageFat];

				this.chartData.series = macrosArray;
				setTimeout(() => {
					this.$refs.foodQuantity.focus();
				},0);
			},
			animateInput() {
				this.showCharts = true;
				this.$refs.inputBox.style.transform = "translateX(0)";
			}, 
			unanimateInput() {
				this.showCharts = false;
				this.$refs.inputBox.style.transform = "translateX(25vw)";
			}, 
			addFood() {
            	const date = this.$store.state.myDate.toLocaleDateString().split('.').join("");
            	const user = localStorage.getItem('userId');
            	const foodData = [
            		this.search, 
            		this.foodWeight, 
            		(this.carb*this.foodWeight)/100, 
            		(this.protein*this.foodWeight)/100, 
            		(this.fat*this.foodWeight)/100, 
            		(this.calorie*this.foodWeight)/100, 
            		this.unit
            	];

            	return this.$http.post('https://calorie-counter-2af66.firebaseio.com/diary/' + user + '/' + date + '.json', foodData)
            		.then(response => {
						console.log(response);
					}, error => {
						console.log(error);
					});
            }
		}, 
		created() {
			this.$http.get('')
				.then(response => {
					return response.json();
				})
				.then(data => {
					let resultArray = [];
					for (let key in data) {
						resultArray.push(data[key]);
					}
					this.products = resultArray;
				})
		}, 
		mounted() {
			this.$refs.foodName.focus();
		},
		beforeRouteLeave(to, from, next) {
			if (this.disableButton == true) {
				this.addFood()
					.then(() => {
						next();
					})
					.catch(error => {
						console.log(error);
					})
			} else {
				next();
			} 
		}
	};
</script>

<style scoped>
	
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
	        animation: fade-in ease-in 0.3s;
	    }

	    .fade-leave-active {
	        animation: fade-out ease-out 0.3s;
	    }

	/*ALL THE REST*/

		.chart {
			opacity: 0.8;
		}

		.button-wrapper {
			opacity: 0.9;
		}

		.chart-caption {
			font-size: large;
		}

		#foodNameInput {
			height: 7vh;
			transform: translateX(25vw);
			transition: ease-in 0.5s;
		}

		#foodNameInput input {
			height: 7vh;
			width: 100%;
			padding: 1vh;
			outline-color: red;
			opacity: 0.8;
		}

		.product-list-container {
			height: 24vh;
		}

		.product-list {
			background-color: white;
			border: 1px solid black;
			max-height: 15vh;
			overflow-y: scroll;
			list-style-type: none;
			padding: 0;
			display: block;
		}

		.product-list li {
			text-decoration: none;
			width: 100%;
			padding: 1vh;
			text-decoration: none;
			color: black;
			display: flex;
			transition: background-color ease-in-out 0.2s;
			cursor: pointer;
		}
		/*tu zmienić kolor hover!*/
		.product-list li:hover {
			background-color: grey;
		}

		.button-wrapper button {
			width: 100%;
		}

		#foodQuantityNumber, #foodQuantityUnit  {
			height: 7vh;
			padding: 1vh;
			width: 100%;
			background: white;
			opacity: 0.8;
		}

		#foodQuantityUnit {
			cursor: pointer;
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