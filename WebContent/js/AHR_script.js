var AHR = (function() {
    var channel = "mwww/";
    
    //Need to store these variables for when S changes and logd doesn't,
    //  and vice versa
    var x=0.2;
    var y=0;
    var z=0;
    var logd=-9;
    
    //Create the model using default starting values;
    var model = new Airway();
    
    //Function to update model and publish results
    function update_and_publish() {
        model.update(defaults.A, defaults.B, defaults.C, defaults.D, x, y, z, logd);
        $.publish(channel + "radii", [model.radii.lumen, model.radii.mucosal, model.radii.sub_mucosal, model.radii.asm]);
        $.publish(channel + "AR", [model.resistance()]);
        $.publish(channel + "ASM_short", [100*model.shortening(logd)]);
    }
    
    //Callback function for when S changes
    function callback_S(e, S) {
        //alert(S);
        y = 0.02*S;
        z = 0.1*S;
        // Magic numbers. Bad Michael!
        update_and_publish();
    }
    
    //Callback function for when logd changes
    function callback_logd(e, logd_) {
        logd = logd_;
        update_and_publish();
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
    
    //The magic revealing module pattern.
    return {
        create : create,
        destroy : destroy,
        update : update_and_publish
    };
    
})();

$(document).ready(function() {
    AHR.create();
    $("#discrete").discrete_slider({channel : "mwww/", topic : "S"});
    $("#continuous").continuous_slider({channel : "mwww/", topic : "logd"});
    $("#multi_plot").multi_plot({image_dir : "./widgets/multi_plot/"});
    $("#cross_section").cross_section({channel : "mwww/", A: defaults.A});
    $("#single_plot").single_plot({image_dir : "./widgets/single_plot/"});
    AHR.update();
});

