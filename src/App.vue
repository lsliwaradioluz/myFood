<template>
    <div id="main">
    	<div class="background">
	        <transition name="fade" mode="out-in">
	            <router-view></router-view>
	        </transition>
	    </div>
    </div>
</template>

<script>
    import Functions from './components/Functions.vue';

    export default {
        components: {
            'app-functions': Functions
        }, 
        methods: {
            autoLogin() {
                this.$store.dispatch('autoLogin');
                /*
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
                this.$store.commit('authUser', {
                    tokenId: token, 
                    userId: userId
                });*/
            }
        }, 
        created() {
            this.autoLogin();
        }
    };
</script>

<style>

	@import url('https://fonts.googleapis.com/css?family=Caveat+Brush&display=swap');

    * {
        box-sizing: border-box;
        font-family: 'Caveat Brush', cursive;
        font-size: large;
        color: rgb(232, 222, 222);
    }

    .dg-btn--ok {
		background-color: #287e36;
		opacity: 0.9;
		color: white;
		border: none;
		width: 49%;
		margin-left: 1%;
	}

	.dg-btn--cancel {
		background-color: #cb3443;
		width: 49%;
		border: none;
		margin-right: 1%;
	}

	#main {
		background: url('../IMG/tomatoes.jpg');
		background-size: cover;
		background-position: center center;
		height: 100vh;
	}

	.background {
		height: 100vh;
		background-color: rgb(0, 0, 0, 0.5);
	}

    /*ANIMACJE*/
    
    .fade-enter-active {
        animation: fade-in ease-in 0.4s;
    }

    .fade-leave-active {
        animation: fade-out ease-out 0.4s;
    }

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

    .blind-enter-active {
        animation: blind-in 0.5s;
    }

    @keyframes blind-in {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }

    @keyframes blind-out {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0);
        }
    }

</style>
