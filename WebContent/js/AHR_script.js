var AHR = (function() {
    var channel = "mwww/";
    
    //Need to store these variables for when S changes and logd doesn't,
    //  and vice versa
    var x=defaults.x;
    var y=defaults.y;
    var z=defaults.z;
    var logd=-9;
    
    //Create the model using default starting values;
    var model = new Airway();
    
    //y and z as a function of asthma severity
    function S(s) {
        if(s<0) {
            return {y: 0, z: 0};
        } else {
            //var y = 0.02*s;
            //var y = 0.016*s*(s+0.1);
            //var y = 0.02*s*s;
            //var y = 0.019*s*(s+0.1);
            var y = 0.0012*s*s*(s+9.7);
            
            return {y: y, z: 5*y};
        }
    }
    
    //Function to update model and publish results
    function update_and_publish() {
        model.update(defaults.A, defaults.B, defaults.C, defaults.D, x, y, z, logd);
        $.publish(channel + "radii", [model.radii.lumen, model.radii.mucosal, model.radii.sub_mucosal, model.radii.asm]);
        $.publish(channel + "AR", [model.resistance()]);
        $.publish(channel + "ASM_short", [100*model.shortening(logd)]);
    }
    
    //Callback function for when S changes
    function callback_S(e, S_) {
        //alert(S);
        y = S(S_).y;
        z = S(S_).z;
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
        model.update(defaults.A, defaults.B, defaults.C, defaults.D, x, y, z, logd);
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
        create:     create,
        destroy:    destroy,
        update:     update_and_publish,
        //This is really bad.  Cannot be updating model every time this function is called.
        resistance: function(logd_, S_) {model.update(defaults.A, defaults.B, defaults.C, defaults.D, x, S(S_).y, S(S_).z, logd_); return model.resistance(logd_);},
        shortening: function(logd_) {return 100*model.shortening(logd_);}
    };
    
})();

$(document).ready(function() {
    AHR.create();
    $("#discrete").discrete_slider({channel : "mwww/", topic : "S"});
    $("#continuous").continuous_slider({channel : "mwww/", topic : "logd"});
    $("#multi_plot").multi_plot_d3({channel : "mwww/", model : AHR.resistance});
    $("#cross_section").cross_section_d3({channel : "mwww/", rmax: defaults.A});
    $("#single_plot").single_plot_d3({channel : "mwww/", model : AHR.shortening});
    AHR.update();
});

