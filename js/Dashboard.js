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
}   


