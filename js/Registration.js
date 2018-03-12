/**
 * Class Constructor
 */
function RegisterUser(){
    return this;
}

RegisterUser.prototype.AddUser = function(oData){
    debugger;
    window.EasyLoading.show({
        type: EasyLoading.TYPE.LINE_SCALE_PULSE_OUT
    }); 

    var sUrl = "https://xs01p2000138187trial.hanatrial.ondemand.com/fit-analysis/db-logic/registration_login.xsjs";
    $.ajax({
        type: "POST",
        url: sUrl,
        // cache: false,
        data: JSON.stringify(oData),
        // dataType: "json",
        error: function (msg, textStatus) {
            debugger;
            alert("User Registration Failed");
        },
        success: function (data) {
            window.EasyLoading.hide();
            alert("User Registration Successfull");
            window.location.href = "index.html";
        }
    }); // End of Ajax Call
}


