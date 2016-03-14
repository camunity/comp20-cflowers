function parse() {	
	var request = new XMLHttpRequest();
	var url = "data.json";
	
	request.open("GET", url, true);	
	request.send();
	
	request.onreadystatechange = function () {
		if (request.status == 200 && request.readyState == 4) {
			var jsonResponse = JSON.parse(request.responseText);
			printMessages(jsonResponse);
		}
	}

	var messagesDiv = document.getElementById("messages");
	function printMessages(jsonResponse) {	
		for (i = 0; i < jsonResponse.length; i++) {
			messagesDiv.innerHTML += '<p>' + " " + 
			jsonResponse[i]["content"] + " " +
			jsonResponse[i]["username"] + '</p>';
		}
	}
}