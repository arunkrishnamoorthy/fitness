/**
 * Class Constructor
 */
function Dashboard() {
    return this;
}

Dashboard.prototype.GetOAuth = function (url) {
    window.open(url, "_blank", "location=yes");
}

Dashboard.prototype.GetOToken = function (oAuth) {
    debugger;
    // Get access token 
    var client_id = "MSsGZt9IUew";
    var client_secret = "807ce7cf440e76f03477bc574c31363c93a9865e";
    var grant_type = "authorization_code";
    var code = oAuth;
    var sUserName = sessionStorage.getItem("UserId");

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
            // TODO Set the access token in backend 
            var sUrl = "https://xs01p2000138187trial.hanatrial.ondemand.com/fit-analysis/db-logic/devices.xsodata/devices"; 
            var oData = {
              USERNAME : sUserName,
              CLIENTID: client_id,
              SECRETKEY: client_secret,
              REFRESHTOKEN: refresh_token
            };

            $.ajax({
               type :"POST",
               url: sUrl,
               data: oData,
               dataType: "json",
               error: function (msg, textStatus) {
                alert("Device Registered Succesfully");
               },
              success: function (data) {
                alert("Device Registered Succesfully");
              }
            });
        },
        error: function (data, response) {
            // Error handling.
        }
    });

}

Dashboard.prototype.updateSelectedDeviceData = function (sClientId, sSecretKey, sRefreshToken) {
    debugger;
    // Implement logic to get the OAuth Data for the selected device. 
    // var old_refresh_token = "-v54Cev6wyuM7BNV28fwN5bTmTMWoNQP8o28E63-8efdL2WxNgQvKekaCy5aBtavNNWfJhnfRQwlAN2iCODyqw";
    // var client_id = "MSsGZt9IUew";
    // var client_secret = "807ce7cf440e76f03477bc574c31363c93a9865e";
    var old_refresh_token = sRefreshToken;
    var client_id = sClientId;
    var client_secret = sSecretKey;
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

                        oChartData.date = moment(oDate).format("DD-MMM-YYYY");
                        oChartData.active = oItem.details.active_time;
                        oChartData.bmr = oItem.details.bmr.toFixed(2);
                        oChartData.calories = oItem.details.calories.toFixed(2);
                        oChartData.distance = oItem.details.km.toFixed(2);
                        oChartData.steps = oItem.details.steps;
                        aChartData.push(oChartData);
                    });

                    // document.getElementById("idActiveTimeToday").innerHTML = oActiveTime;
                    // document.getElementById("idBMRToday").innerHTML = oBMR.toFixed(2);
                    // document.getElementById("idCaloriesToday").innerHTML = oCalories.toFixed(2);
                    // document.getElementById("idDistanceToday").innerHTML = oDistance.toFixed(2);;
                    // document.getElementById("idStepsToday").innerHTML = oSteps;

                    document.getElementById("idActiveTimeWeek").innerHTML = oWeekActive;
                    document.getElementById("idBMRWeek").innerHTML = oWeekBMR.toFixed(2);
                    document.getElementById("idCaloriesWeek").innerHTML = oWeekCalories.toFixed(2);
                    document.getElementById("idDistanceWeek").innerHTML = oWeekDistance.toFixed(2);;
                    document.getElementById("idStepsWeek").innerHTML = oWeekSteps;

                    // Step Chart
                    new Chart(document.getElementById("step-chart"), {
                        type: 'line',
                        data: {
                          labels: aChartData.map(function (row) { return row["date"]; }),
                          datasets: [{ 
                              data: aChartData.map(function (row) { return row["steps"]; }),
                              label: "Active Time",
                              borderColor: "#3e95cd",
                              fill: false
                            }
                          ]
                        },
                        options: {
                          title: {
                            display: false,
                            text: 'Steps Analysis'
                          }
                        }
                      });

                    // Calories
                    new Chart(document.getElementById("calories-chart"), {
                        type: 'bar',
                        data: {
                          labels: aChartData.map(function (row) { return row["date"]; }),
                          datasets: [{ 
                              data: aChartData.map(function (row) { return row["calories"]; }),
                              label: "Calories",
                              borderColor: "#800080",
                              fill: true,
                              backgroundColor: "#800080"
                            }
                          ]
                        },
                        options: {
                          title: {
                            display: false,
                            text: 'Calories'
                          }
                        }
                      });

                    // Chart 3
                    var presets = window.chartColors;
                    new Chart(document.getElementById("bmr-chart"), {
                        type: 'bar',
                        data: {
                          labels: aChartData.map(function (row) { return row["date"]; }),
                          datasets: [{ 
                              data: aChartData.map(function (row) { return row["bmr"]; }),
                              label: "BMR",
                              borderColor: "#008080",
                              fill: true,
                              backgroundColor: "#008080"
                            }
                          ]
                        },
                        options: {
                          title: {
                            display: false,
                            text: 'World population per region (in millions)'
                          }
                        }
                      });

                      // Chart 3
                    var presets = window.chartColors;
                    new Chart(document.getElementById("distance-chart"), {
                        type: 'line',
                        data: {
                          labels: aChartData.map(function (row) { return row["date"]; }),
                          datasets: [{ 
                              data: aChartData.map(function (row) { return row["distance"]; }),
                              label: "Distance",
                              borderColor: "#808000",
                              backgroundColor: "#808000",
                              fill: true
                            }
                          ]
                        },
                        options: {
                          title: {
                            display: false,
                            text: 'World population per region (in millions)'
                          }
                        }
                      });

                      // Chart 5
                    var presets = window.chartColors;
                    new Chart(document.getElementById("active-chart"), {
                        type: 'line',
                        data: {
                          labels: aChartData.map(function (row) { return row["date"]; }),
                          datasets: [{ 
                              data: aChartData.map(function (row) { return row["active"]; }),
                              label: "Active Time",
                              borderColor: "#DAF7A6",
                              backgroundColor: "#DAF7A6",
                              fill: true
                            }
                          ]
                        },
                        options: {
                          title: {
                            display: false,
                            text: 'World population per region (in millions)'
                          }
                        }
                      });


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
