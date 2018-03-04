/**
 * Class Constructor
 */
function LoginController(){
    return this;
}

/**
 * 
 */
LoginController.prototype.login = function(sUserName, sPassword){ 
    
    window.EasyLoading.show({
        type: EasyLoading.TYPE.LINE_SCALE_PULSE_OUT
    }); 

    var sUser = sUserName.toUpperCase();
    var sUrl = "https://xs01p2000138187trial.hanatrial.ondemand.com/fit-analysis/db-logic/registration_login.xsjs";
    var oData = {
        "action" : "login",
        "username" : sUserName,
        "password" : sPassword
    };

    $.ajax({
        type: "POST",
        url: sUrl,
        // cache: false,
        data: JSON.stringify(oData),
        // dataType: "json",
        error: function (msg, textStatus) {
            debugger;
            alert("User Does not Exist");
        },
        success: function (data) {
            debugger;
            // var oLoginData = data.d.results[0];
            // if ( data.d.results.length === 0 ){
            //     bootbox.dialog({
            //         title: 'Login Failed',
            //         message: 'User Does not Exist'
            //     });                    
            //     return;
            // }

            // if (oLoginData.Password === sPassword) {
                // Login Success
                sessionStorage.setItem("SessionActive", true);
                sessionStorage.setItem("UserId", sUserName);
                sessionStorage.setItem("UserName","Arun Krishnamoorthy");
                // sessionStorage.setItem("UserName",oLoginData.UserName);
                window.EasyLoading.hide();
            //     // window.location.href = window.location.href + "Dashboard.html"
                window.location.href = "Dashboard1.html";
 
        }
    }); // End of Ajax Call

};  // End of Login Method


/**
 * Clear the Cookies values
 */
LoginController.prototype.logout = function(){
    sessionStorage.setItem("SessionActive", false);
    sessionStorage.setItem("UserId", "");
    sessionStorage.setItem("UserName","");
    window.location.href = "index.html";
}
