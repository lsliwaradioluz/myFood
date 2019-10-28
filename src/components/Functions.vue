<template>
    <div>
        <div id="food-diary-buttons">
            <div class="container-fluid">
                <div class="row">
                	<div class="col-md-5">
                		<div class="row">
		                    <div class="col-md-6">
		                        <div class="button">
		                            <router-link to="/Diary" tag="p" exact><i class="fas fa-book"></i>Dziennik żywieniowy</router-link>
		                        </div>
		                    </div>
		                    <div class="col-md-6">
		                        <div class="button">
		                            <router-link to="/chooseFood" tag="p" exact><i class="fas fa-apple-alt"></i>Dodaj produkt do dziennika</router-link>
		                        </div>
		                    </div>
		                </div>
		            </div>
		            <div class="col-md-2 text-center">
                		<h2 class="logo">myFood<router-link to="/Database" tag="span" exact v-if="this.$store.state.user.email == 'admin@myfood.com'"><i class="fas fa-plus-circle" style="cursor: pointer"></i></router-link></h2>
                	</div>
		            <div class="col-md-5">
		            	<div class="row">
		                    <div class="col-md-6">
		                        <div class="button">
		                            <router-link to="/BMR" tag="p" exact><i class="fas fa-tachometer-alt"></i>Ile kalorii potrzebujesz?</router-link>
		                        </div>
		                    </div>
		                    <div class="col-md-6">
	                        <div class="button" @click="logOut">
                            <i class="fas fa-user"></i>Wyloguj {{ email }}
                          </div>
		                    </div>
		               	</div>
		            </div>
                </div>  
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            email() {
                return localStorage.getItem('userEmail');
            }
        }, 
        methods: {
            logOut() {
                this.$store.commit('logOut');
            }
        }
    };
</script>

<style scoped>

  .router-link-active {
    text-decoration: underline;
  }

  #food-diary-buttons {
  	height: 10vh;
    padding: 2vh 0 2vh 0;
    background: transparent;
  }

  .button {
    padding: 1vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    color: white;
    transition: ease-in-out .2s;
  }

  .button:hover {
    transform: scale(0.9);
  }

  .button i {
    margin-right: 2vh;
  }

  .button p {
    margin: 0;
  }
</style>
