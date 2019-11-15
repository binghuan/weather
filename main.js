
var DBG = true;

function error(msg) {
    console.log(msg);
    chrome.browserAction.setBadgeText({ text: "?" });
    errorCode = "unable_to_locate_your_position";
}

function success(position) {
    console.log(">> success:", position);
    if (position != null) {
        console.log(JSON.stringify(position));
    }
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    getWeatherInfo(lat, lng);

}

function getCurrentLocation() {
    console.log("+ getCurrentLocation()");
    navigator.geolocation.getCurrentPosition(success, error);
}

function getWeatherInfo(lat, lng) {
    if (DBG) console.log("getGeoInfo(" + lat + "," + lng);
    var requesturl = location.protocol + "//api.worldweatheronline.com/premium/v1/weather.ashx?q=" + lat + "," + lng +
        "&format=json&num_of_days=1&key=9294b70cef8f4bc4852164446191311";
    $.get(requesturl, function (event) {
        console.log("getDataBack: ", event.data);

        var currentWeatherInfo = event.data.current_condition[0];
        console.log('getCurrentWeatherInfo(', currentWeatherInfo);
        console.log('getIconUrl: ' + currentWeatherInfo.weatherIconUrl[0].value);
        //chrome.browserAction.setBadgeText({text:currentWeatherInfo["temp_C"] + " C"});
        //chrome.browserAction.setIcon({path:currentWeatherInfo.weatherIconUrl[0].value});
        $("#iconForCurrent").attr("src", currentWeatherInfo.weatherIconUrl[0].value);
        $("#descriptionForCurrent").text(currentWeatherInfo.weatherDesc[0].value);
        $("#degreeForCurrent").text(currentWeatherInfo.temp_C + '\u2103/' + currentWeatherInfo.temp_F + '\u2109');
        // reference: http://graphemica.com/unicode/characters
        $("#lastUpdate").text(new Date());
    });
}

function startRequest() {
    getCurrentLocation();
}

function scheduleRequest() {
    var reqeustInterval = 1000 * 60 * 60;
    console.log("Scheduling request...");
    setInterval(startRequest, reqeustInterval);
}
startRequest();
scheduleRequest();
