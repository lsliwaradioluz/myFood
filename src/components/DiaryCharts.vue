<template> 
	<div>
		<div class="row charts">
			<div class="col-md-12 chart-container">
				<apexchart type="pie" width="300" :options="chartData.chartOptions" :series="chartSeries[0]"></apexchart>
			</div>
		</div>
		<div class="row" >
			<div class="col-md-12 text-center">
				<div>
		    		<p><i class="fas fa-square" style="color: #ffc700; margin-right: 1%"></i>Węglowodany: {{ chartSeries[1][0] | oneDecimal }}g</p>
		    		<p><i class="fas fa-square" style="color: #29AF62; margin-right: 1%"></i>Białko: {{ chartSeries[1][1] | oneDecimal }}g</p>
		    		<p><i class="fas fa-square"  style="color: #EE393C; margin-right: 1%"></i>Tłuszcz: {{ chartSeries[1][2] | oneDecimal }}g</p>
		    		<p><i class="fas fa-square" style="color: #2f36ef; margin-right: 1%"></i>Energia: {{ chartSeries[1][3] }} {{ calorieTarget }} kcal</p>
		    	</div>	        		  	
			</div>
		</div>
	</div>

</template>

<script> 
	export default {
		props: ['diaryItems'], 
		data() {
			return {
				chartData: {
			        chartOptions: {
			        	labels: ['Węglowodany (kcal)', 'Białko (kcal)', 'Tłuszcz (kcal)'],
			        	colors: ['#ffc700', '#29AF62', '#EE393C'],
			        	legend: {
			                show: false
			              }
			        }
				}
			}
		},
		computed: {
			chartSeries() {
				let carb, protein, fat, calorie, carbEnergy, proteinEnergy, fatEnergy;
				carb = 0;
				protein = 0;
				fat = 0;
				calorie = 0;

				if (this.diaryItems.length > 0) {
					this.diaryItems.forEach((cur) => {	
						carb += cur[2];
						protein += cur[3];
						fat += cur[4];
						calorie = Math.round(calorie + cur[5]);
					});
				
					return [[carb*4, protein*4, fat*9], [carb, protein, fat, calorie]];
				} else {
					return [[carb, protein, fat], [carb, protein, fat, calorie]];
				}
			}, 
			calorieTarget() {
				if (this.$store.state.CPM !== 0) return ' / ' + this.$store.state.CPM;
			}
		}
	};
</script>

<style scoped>

	* {
		color: white;
		font-size: large;
	}
	
	.chart-container {
		opacity: 0.8;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>