/**
 * Class Constructor
 */
function Dashboard() {
    return this;
}

Dashboard.prototype.GetOAuth = function (url) {
    debugger;
    // window.EasyLoading.show({
    //     type: EasyLoading.TYPE.LINE_SCALE_PULSE_OUT
    // }); 
    window.open(url, "_blank", "location=yes");
    // window.EasyLoading.hide();
}

Dashboard.prototype.GetOToken = function (oAuth) {
    debugger;
    // Get access token 
    var client_id = "MSsGZt9IUew";
    var client_secret = "807ce7cf440e76f03477bc574c31363c93a9865e";
    var grant_type = "authorization_code";
    var code = oAuth;

    var url = "https://jawbone.com/auth/oauth2/token" + "?client_id=" + client_id +
        "&client_secret=" + client_secret + "&grant_type=" + grant_type + "&code=" + code;

    $.ajax({
        type: 'GET',
        url: url,
        dataType: "json",
        success: function (data, response) {
            debugger;
            var access_token = data.access_token;
            var refresh_token = data.refresh_token;
            var token_type = data.token_type;
            var url = "https://jawbone.com/nudge/api/v.1.1/users/@me/moves";
            var auth_value = token_type + " " + access_token;
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', auth_value);
                },
                success: function (data, response) {
                    debugger;
                    var items = data.data.items;
                },
                error: function (response) {
                    debugger;
                }
            });


        },
        error: function (data, response) {
            // Error handling.
        }
    });

}

Dashboard.prototype.updateSelectedDeviceData = function () {
    debugger;
    // Implement logic to get the OAuth Data for the selected device. 
    var old_refresh_token = "-v54Cev6wyuM7BNV28fwN5bTmTMWoNQP8o28E63-8efdL2WxNgQvKekaCy5aBtavNNWfJhnfRQwlAN2iCODyqw";
    var client_id = "MSsGZt9IUew";
    var client_secret = "807ce7cf440e76f03477bc574c31363c93a9865e";
    var grant_type = "refresh_token";

    var callbackURL = window.location.origin + "/Callback.html";
    var url = "https://jawbone.com/auth/oauth2/token?";
    var path = "client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=" + grant_type + "&refresh_token=" + old_refresh_token;
    url = url + path;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data, response) {

            var access_token = data.access_token;
            var refresh_token = data.refresh_token;
            var token_type = data.token_type;
            var url = "https://jawbone.com/nudge/api/v.1.1/users/@me/moves";
            // var url = "https://jawbone.com/nudge/api/v.1.1/users/@me/moves?start_time=1519662718";
            var last_week = moment().subtract(7, 'days');
            var epochValue = moment(last_week).unix();
            var parameter = "?start_time=" + epochValue;
            url = url + parameter;
            var auth_value = token_type + " " + access_token;
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', auth_value);
                },
                success: function (data, response) {
                    debugger;
                    var items = data.data.items;
                    var oToday = moment();
                    var sToday = moment(oToday).format("YYYYMMDD");
                    var aChartData = [];
                    var oActiveTime = 0, oBMR = 0, oCalories = 0, oDistance = 0, oSteps = 0;
                    var oWeekActive = 0, oWeekBMR = 0, oWeekCalories = 0, oWeekDistance = 0, oWeekSteps = 0;
                    $.each(items, function (index, oItem) {
                        if (sToday === oItem.date) {
                            oActiveTime = oItem.details.active_time;
                            oBMR = oItem.details.bmr;
                            oCalories = oItem.details.calories;
                            oDistance = oItem.details.km; //distance
                            oSteps = oItem.details.steps;
                        }

                        oWeekActive = oWeekActive + oItem.details.active_time;
                        oWeekBMR = oWeekBMR + oItem.details.bmr;
                        oWeekCalories = oWeekCalories + oItem.details.calories;
                        oWeekDistance = oWeekDistance + oItem.details.km;
                        oWeekSteps = oWeekSteps + oItem.details.steps;

                        var oChartData = {};
                        var date = oItem.date.toString();
                        var day = date.substr(6, 2);
                        var month = date.substr(4, 2);
                        month = parseInt(month) - 1;
                        var year = date.substr(0, 4);
                        var oDate = new Date();
                        oDate.setDate(day);
                        oDate.setMonth(month);
                        oDate.setFullYear(year);

                        oChartData.date = oDate;
                        oChartData.active = oItem.details.active_time;
                        oChartData.bmr = oItem.details.bmr.toFixed(2);
                        oChartData.calories = oItem.details.calories.toFixed(2);
                        oChartData.distance = oItem.details.km.toFixed(2);
                        oChartData.steps = oItem.details.steps;
                        aChartData.push(oChartData);
                    });

                    document.getElementById("idActiveTimeToday").innerHTML = oActiveTime;
                    document.getElementById("idBMRToday").innerHTML = oBMR.toFixed(2);
                    document.getElementById("idCaloriesToday").innerHTML = oCalories.toFixed(2);
                    document.getElementById("idDistanceToday").innerHTML = oDistance.toFixed(2);;
                    document.getElementById("idStepsToday").innerHTML = oSteps;

                    document.getElementById("idActiveTimeWeek").innerHTML = oWeekActive;
                    document.getElementById("idBMRWeek").innerHTML = oWeekBMR.toFixed(2);
                    document.getElementById("idCaloriesWeek").innerHTML = oWeekCalories.toFixed(2);
                    document.getElementById("idDistanceWeek").innerHTML = oWeekDistance.toFixed(2);;
                    document.getElementById("idStepsWeek").innerHTML = oWeekSteps;



                    var trace2 = {
                        type: "scatter",
                        mode: "line",
                        x: aChartData.map(function (row) { return row["date"]; }),
                        y: aChartData.map(function (row) { return row["active"]; }),
                        line: { color: '#7F7F7F' }
                    }

                    var data = [trace2];

                    var layout = {
                        title: 'Steps - Analysis',
                        xaxis: {
                            autorange: true,
                            type: 'date'
                        },
                        yaxis: {
                            autorange: true,
                            type: 'linear'
                        }
                    };
                    Plotly.newPlot('idChart1', data, layout);

                    // Chart 2
                    var trace2 = {
                        type: "scatter",
                        mode: "line",
                        x: aChartData.map(function (row) { return row["date"]; }),
                        y: aChartData.map(function (row) { return row["bmr"]; }),
                        line: { color: '#7F7F7F' }
                    }
                    var data = [trace2];
                    layout.title = "BMR"
                    Plotly.newPlot('idChart2', data, layout);

                    // Chart 3
                    var trace2 = {
                        type: "scatter",
                        mode: "line",
                        x: aChartData.map(function (row) { return row["date"]; }),
                        y: aChartData.map(function (row) { return row["calories"]; }),
                        line: { color: '#7F7F7F' }
                    }
                    var data = [trace2];
                    layout.title = "Calories"
                    Plotly.newPlot('idChart3', data, layout);

                    // Chart 4
                    var trace2 = {
                        type: "scatter",
                        mode: "line",
                        x: aChartData.map(function (row) { return row["date"]; }),
                        y: aChartData.map(function (row) { return row["distance"]; }),
                        line: { color: '#7F7F7F' }
                    }
                    var data = [trace2];
                    layout.title = "Distance"
                    Plotly.newPlot('idChart4', data, layout);

                },
                error: function (response) {
                    debugger;
                }
            });
        },
        error: function (response) {
            debugger;
        }
    })

}
