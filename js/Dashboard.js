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
            //beforeSend: function(xhr){xhr.setRequestHeader('X-Test-Header', 'test-value');},
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


