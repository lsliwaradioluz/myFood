<template>
	<div>
		<app-functions></app-functions>
		<div id="food-diary">
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-8">
						<li class="date"> 
							<div class="row">
								<div class="col-md-4" style="font-size: 130%">
									<i class="fas fa-caret-left arrow left" @click="dateChange('dec')"></i>
									{{ this.$store.state.myDate | displayDate  }}
									<i class="fas fa-caret-right arrow right" @click="dateChange('inc')"></i>
								</div>
							</div>
						</li>
						<ul class="list-container">
							<li v-for="(diaryItem, index) in diaryItems" id="food-element" :key="diaryItem[0] + index">
								<div class="row">
									<div class="col-md-4">
										{{ diaryItem[0] }}
									</div>
									<div class="col-md-5 ">
										<div class="row">
											<div class="col-md-2">
												{{ diaryItem[1] }}{{ diaryItem[6] }}
											</div>
											<div class="col-md-10">
												<span style="color: #ffc700;">W: {{ diaryItem[2] | oneDecimal }}g </span><span style="color: #29AF62;">B: {{ diaryItem[3] | oneDecimal}}g </span><span style="color: #EE393C;"> T: {{ diaryItem[4] | oneDecimal }}g</span>
											</div>
										</div>
									</div>
									<div class="col-md-3 energy">
										{{ diaryItem[5] | noDecimals }} kcal
										<i class="far fa-times-circle" @click="deleteDiaryItem(index)"></i>
									</div>
								</div>
							</li>
							<transition name="fade" mode="out-in" appear>
								<li v-if="listLoaded && diaryItems.length == 0" key="info">Nie dodałeś żadnych produktów tego dnia.</li>
							</transition>
						</ul>
					</div>
					<div class="col-md-4">
						<br><br>
						<app-diarycharts :diaryItems="diaryItems" v-if="diaryItems.length > 0"></app-diarycharts>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script> 
	import DiaryCharts from './DiaryCharts.vue';

	export default {
		name: 'Diary',
		data() {
			return {
				listLoaded: false,
				diaryItems: [],
				diaryItemsKeys: [], 
				user: localStorage.getItem('userId')
			}
		},
		methods: {
			deleteDiaryItem(index) {
				const date = this.$store.state.myDate.toLocaleDateString().split('.').join("");
				this.$http.delete('https://calorie-counter-2af66.firebaseio.com/diary/' + this.user + '/' + date + '/' + this.diaryItemsKeys[index] + '.json')
					.then(response => {
						console.log(response);
						this.getDiary();
					})
			  		.catch(() => {
			    		console.log('Something went wrong');
			  		});
			}, 
			dateChange(action) {
				if (action == 'dec') {
					this.$store.state.myDate = new Date(this.$store.state.myDate.setDate(this.$store.state.myDate.getDate() - 1));
            		this.getDiary();      
				} else if (action == 'inc') {
					this.$store.state.myDate = new Date(this.$store.state.myDate.setDate(this.$store.state.myDate.getDate() + 1));
            		this.getDiary();
				}    	
      }, 
      getDiary() {
      	this.listLoaded = false;
      	const date = this.$store.state.myDate.toLocaleDateString().split('.').join("");
      	return this.$http.get('https://calorie-counter-2af66.firebaseio.com/diary/' + this.user + '/' + date + '.json')
					.then(response => {
						return response.json();
					})
					.then(data => {
						if (data == null) {
							this.listLoaded = true;
							this.diaryItems = '';
						} else {
							this.listLoaded = true;
							this.diaryItemsKeys = Object.keys(data);
							this.diaryItems = Object.values(data);
						}
					})
					.catch(() => {
						console.log('something went wrong');
					});
      } 
		},
		mounted() {
			this.getDiary();
		},
		filters: {
			displayDate(value) {
				return value.toLocaleDateString();
			}
		},
		components: {
			'app-diarycharts': DiaryCharts 
		}
	};

</script>

<style scoped>

	.date {
		border-bottom: 1.5px solid white;
		list-style-type: none;
	}

	.arrow {
		cursor: pointer;
		transition: color 0.2s ease-in-out;
		font-size: 100%;
	}

	.arrow:hover {
		color: rgb(206, 72, 72);
	}
	
	#food-diary {
		height: 90vh;
		padding-top: 5vh;
	}

	.list-container {
		list-style-type: none;
		padding-left: 0;
		max-height: 75vh;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	#food-element {
		padding: 4vh 1vh 1vh 1vh;
		border-bottom: 1px solid #e0e0e0;
		transition: ease-in-out .2s;
	}

	.energy {
		text-align: right;
	}

	.fa-times-circle {
		margin-left: 1vw;
		margin-right: 1vw;
		cursor: pointer;
		transition: color 0.2s ease-in;
	}

	.fa-times-circle:hover {
		color: rgb(206, 72, 72);
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
		animation: fade-in ease-in .2s;
	}

	.fade-leave-active {
		animation: fade-out ease-out .2s;
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
