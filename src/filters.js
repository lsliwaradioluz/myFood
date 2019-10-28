import Vue from 'vue';

Vue.filter('oneDecimal', function(value) {
	return value.toFixed(1);
});

Vue.filter('noDecimals', function(value) {
	return value.toFixed(0);
});