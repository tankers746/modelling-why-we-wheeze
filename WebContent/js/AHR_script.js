var AHR = (function() {
    var channel = "mwww/";
    
    //These parameters do not change for the ASM page.
    var A = 2.75;
    var B = 1.5*Math.PI;
    var C = 2.5*Math.PI;
    var D = 0.32*Math.PI;
    
    //Need to store these variables for when S changes and logd doesn't,
    //  and vice versa
    var x=20;
    var y=0;
    var z=0;
    var logd=-6;
    
    //Create the model usign default starting values;
    var model = new Airway(A, B, C, D, x, y, z);
    
    //Callback function for when S changes
    function callback_S(e, S) {
        //alert(S);
        y = 0.01*S;
        z = 0.2*S;
        model.update(A, B, C, D, x, y, z, logd);
        $.publish(channel + "radii", [model.radii[3], model.radii[2], model.radii[1], model.radii[0]]);
        $.publish(channel + "AR", [model.tube_resistance(logd)]);
        $.publish(channel + "ASM_short", [model.shortening(logd)]);
        
    }
    
    //Callback function for when logd changes
    function callback_logd(e, logd_) {
        logd = logd_;
        model.update(A, B, C, D, x, y, z, logd);
        $.publish(channel + "radii", [model.radii[3], model.radii[2], model.radii[1], model.radii[0]]);
        $.publish(channel + "AR", [model.tube_resistance(logd)]);
        $.publish(channel + "ASM_short", [model.shortening(logd)]);
    }
    
    //Initialise the subscribers.
    function create() {
        $.subscribe((channel+"S"),callback_S);
        $.subscribe((channel+"logd"),callback_logd);
    }
    
    //Unsubscribe all.
    function destroy() {
        $.unsubscribe((channel+"S"),callback_S);
        $.unsubscribe((channel+"logd"),callback_logd);
    }
    
    //This is the magic of the revealing module pattern: public interfaces.
    return {
        create : create,
        destroy : destroy
    };
    
})();

$(document).ready(function() {
    AHR.create();
    $("#discrete_slider").discrete_slider({channel : "mwww/", topic : "S"});
    $("#continuous_slider").continuous_slider({channel : "mwww/", topic : "logd"});
    $("#multi_plot").multi_plot({image_dir : "./widgets/multi_plot/"});
    $("#cross_section").cross_section({channel : "mwww/", ra: 1.2, rb: 1.7, rc: 2.4, rd: 2.75, A:2.75});
    $("#single_plot").single_plot({image_dir : "./widgets/single_plot/"});
});

