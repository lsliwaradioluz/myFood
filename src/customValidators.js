export const startsWithUppercase = (value) => {
	if (value.length > 0) {
		return value.charAt(0) !== value.charAt(0).toLowerCase();
	} else {
		return true;
	}
};

		

