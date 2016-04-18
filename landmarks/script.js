
	var myLat = 42.36;
	var myLng = -71.05;
	var url = "https://guarded-mesa-44140.herokuapp.com/sendLocation";
	var request = new XMLHttpRequest(); 
	var me = new google.maps.LatLng(myLat, myLng);
	var myOptions = {
						zoom: 13, center: me, mapTypeId: google.maps.MapTypeId.ROADMAP
					 };
	var map;
	var marker;
	var people;
	var landmarks;
	var infowindow = new google.maps.InfoWindow();
	var closestLandmark = {title:"none", distance:1.0, pos:new google.maps.LatLng(myLat, myLng)};
	

	function init()
	{
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		getMyLocation();
	}

	function getMyLocation()
	{
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
					myLat = position.coords.latitude; 
					myLng = position.coords.longitude;
					renderMap();
			});
		}
		else {
			alert("Geolocation is not supported by your web browser");
		}
	}

	function renderMap()
	{
		me = new google.maps.LatLng(myLat, myLng);
		map.panTo(me);
		requestData();
	}


	function updateMyMarker()
	{
	 	var contentTitle = "I am BOBBIE_MOON." + "The closest landmark from where I am is " + closestLandmark.title + " which is " + closestLandmark.distance + " miles away from me.";  
		
		createMarker(me, contentTitle, "goldMic.png");
	}

	function requestData()
	{
		request.open("POST", url, true);	
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.send("login=BOBBIE_MOON&lat=" + myLat + "&lng=" + myLng);
		
		request.onreadystatechange = function () {
			if (request.status == 200 && request.readyState == 4) {
				var jsonResponse = JSON.parse(request.responseText);
				people = jsonResponse.people;
				landmarks = jsonResponse.landmarks;
				displayMapItems(); 
				updateMyMarker();
				drawPolyline(closestLandmark.pos); 
			}
		}
	}


	function displayMapItems()
	{
		for (i = 0; i < people.length; i++) {
			if(people[i]["login"] != "BOBBIE_MOON"){
			var pos = new google.maps.LatLng(people[i]["lat"], people[i]["lng"]);
			var distance = calculateDistance(pos); 
			var title = people[i]["login"] + ": " + distance + " miles away";
			createMarker(pos, title, "person.png");
			}
		}

		for (j = 0; j < landmarks.length; j++) {
			var coordinates = landmarks[j]["geometry"]["coordinates"];
			var pos = new google.maps.LatLng(coordinates[1], coordinates[0]);
			var title = landmarks[j]["properties"]["Details"];
			var distance = calculateDistance(pos);
			if(distance <= 1.0){
				if(distance <= closestLandmark.distance){
					closestLandmark.title = landmarks[j]["properties"]["Location_Name"];
					closestLandmark.distance = distance;
					closestLandmark.pos = pos;  
					
				}
				createMarker(pos, title, "museum.png");
			}	
		}
	}

	function createMarker(position, title, icon)
	{	
		marker = new google.maps.Marker({
			position: position,
			title: title,
			icon: icon
		});
	
		marker.setMap(map);

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.close(); 
			infowindow.setContent(this.title);
			infowindow.open(map, this);
		});	
	}

function calculateDistance(position) 
{
	var lat1 = myLat;
	var lon1 = myLng;
	var lat2 = position.lat();
	var lon2 = position.lng();

    var R = 3960;

    var dLat = degToRad(lat2-lat1);  
    var dLon = degToRad(lon2-lon1);  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 

	return d.toFixed(4);
}

function degToRad(degrees)
{
	return degrees * (Math.PI / 180);
}

function drawPolyline(position)
{
	var line = [position, me];
	var toPosition = new google.maps.Polyline({
		path: line,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2
		});
		toPosition.setMap(map);
	}
