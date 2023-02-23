module.exports.formateDateMain = function(strDate) {	
	let output = '';
	if (strDate == '') {
		output = "-"
	} else {
		let date = new Date(strDate);
		output = date.toLocaleDateString("en-EN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'});
	}
	return output;
}

function padTo2Digits(num) {
	return num.toString().padStart(2, '0');
}

module.exports.formateDateEdit = function(strdate){
	const date =  new Date(strdate);
	return (
	  [
		date.getFullYear(),
		padTo2Digits(date.getMonth() + 1),
		padTo2Digits(date.getDate()),
	  ].join('-') +
	  'T' +
	  [
		padTo2Digits(date.getHours()),
		padTo2Digits(date.getMinutes()),
	  ].join(':')
	);
}

module.exports.formateDateNew = this.formateDateEdit;