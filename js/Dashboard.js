/**
 * Class Constructor
 */
function Dashboard(){
    return this;
}

Dashboard.prototype.GetOAuth = function(url){
    debugger;
    // window.EasyLoading.show({
    //     type: EasyLoading.TYPE.LINE_SCALE_PULSE_OUT
    // }); 
    window.open(url, "_blank", "location=yes");
    // window.EasyLoading.hide();
}

Dashboard.prototype.GetOToken = function(oAuth){
    debugger;
    // Get access token 
    var client_id = "MSsGZt9IUew";
    var client_secret = "807ce7cf440e76f03477bc574c31363c93a9865e";
    var grant_type="authorization_code";
    var code = oAuth;

    var url = "https://jawbone.com/auth/oauth2/token" + "?client_id=" + client_id +
        "&client_secret=" + client_secret + "&grant_type=" + grant_type + "&code=" + code;

    $.ajax({
        type: 'GET',
        url: url,
        dataType:"json",
        success: function(data,response){
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
                beforeSend: function(xhr){
                    xhr.setRequestHeader('Authorization', auth_value );
                },
                success: function(data,response){
                    debugger;
                    var items = data.data.items;
                },
                error: function(response){
                    debugger;
                }
            });


        },
        error: function(data,response){
            // Error handling.
        }
    });

}   

Dashboard.prototype.updateSelectedDeviceData = function(){
    debugger;
    // Implement logic to get the OAuth Data for the selected device. 
    var old_refresh_token = "-v54Cev6wyuM7BNV28fwN5bTmTMWoNQP8o28E63-8efdL2WxNgQvKekaCy5aBtavNNWfJhnfRQwlAN2iCODyqw";
    var client_id = "MSsGZt9IUew";
    var client_secret = "807ce7cf440e76f03477bc574c31363c93a9865e";
    var grant_type="refresh_token";
     
    var callbackURL = window.location.origin + "/Callback.html";
    var url = "https://jawbone.com/auth/oauth2/token?";
    var path = "client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=" + grant_type + "&refresh_token=" + old_refresh_token; 
    url = url + path;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data,response){
            debugger;
            var access_token = data.access_token;
            var refresh_token = data.refresh_token;
            var token_type = data.token_type;
            var url = "https://jawbone.com/nudge/api/v.1.1/users/@me/moves";
            var parameter = "?start_time=1519645814000";
            // url = url + parameter;
            var auth_value = token_type + " " + access_token;
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                beforeSend: function(xhr){
                    xhr.setRequestHeader('Authorization', auth_value );
                },
                success: function(data,response){
                    debugger;
                    var items = data.data.items;
                },
                error: function(response){
                    debugger;
                }
            });
        },
        error: function(response){
                    debugger;
        }
    })

}
