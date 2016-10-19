/**
 * AHR script
 *
 * This script sets up the widgets and the model, and links them with pub/sub.
 *
 * Authors:
 *     Michael Baxter <20503664@student.uwa.edu.au>
 *
 * Since:
 *     19/10/2016
 *
 * Description:
 *     This script has two parts: the AHR module at the top and the part that adds widgets to the
 *     page at the bottom.
 *
 *     The AHR module contains the model object (see airway_model.js or airway_model_B.js), copies
 *     of state variables (x, y, z, logd) and a set of callback functions.  The slider widgets
 *     publish on topics logd and S.  This triggers an event and pub/sub calls one of the 
 *     callback functions.  This updates the model and the state parameters.  The data calculated
 *     by the model functions is then published on different channels for the graphs and the
 *     cross-section diagram.
 *
 *     The second part of the script below the AHR module is responsible for putting the widgets
 *     on the page.  Use that part to change widget options, such as width.
 *
 */


var AHR = (function() {
    var channel = "mwww/";
    
    // Need to store these variables for when S changes and logd doesn't,
    // and vice versa
    var x=defaults.x;
    var y=defaults.y;
    var z=defaults.z;
    var logd=-9;
    
    // Create the model using default starting values;
    var model = new Airway();
    
    // This is (y, z) as a function of S.  At one point, it was suggested that asthma severity
    // be a continuous amount, which is why this isn't an array.  I'm currently using a cubic fcn.
    // This function changes the spread of curves on the multiplot.
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
    
    // Helper function that updates the model and publishes output for the c/s diagram
    // and graphs to listen out for.
    function update_and_publish() {
        model.update(defaults.A, defaults.B, defaults.C, defaults.D, x, y, z, logd);
        $.publish(channel + "radii", [model.radii.lumen, model.radii.mucosal, model.radii.sub_mucosal, model.radii.asm]);
        $.publish(channel + "AR", [model.resistance()]);
        $.publish(channel + "ASM_short", [100*model.shortening(logd)]);
    }
    
    // Callback function for when S changes
    function callback_S(e, S_) {
        y = S(S_).y;
        z = S(S_).z;
        update_and_publish();
    }
    
    // Callback function for when logd changes
    function callback_logd(e, logd_) {
        logd = logd_;
        update_and_publish();
    }
    
    // Initialise the model and start the subscribers.
    function create() {
        model.update(defaults.A, defaults.B, defaults.C, defaults.D, x, y, z, logd);
        $.subscribe((channel+"S"),callback_S);
        $.subscribe((channel+"logd"),callback_logd);
    }
    
    // Unsubscribe all.
    function destroy() {
        $.unsubscribe((channel+"S"),callback_S);
        $.unsubscribe((channel+"logd"),callback_logd);
    }
    
    // Revealing module patten: returns an interface to the object.
    // create:      Initialises model and starts subscribers.
    // destroy:     Stops subscribers.
    // update:      Publishes current data on all channels.
    // resistance:  Returns reference to Airway Resistance as a function of logd and S.
    //              Required by the multiplot.
    // shortening:  Returns reference to ASM shortening (%) as a function of logd.
    //              Required by the single plot.
    return {
        create:     create,
        destroy:    destroy,
        update:     update_and_publish,
        resistance: function(logd_, S_) {model.update(defaults.A, defaults.B, defaults.C, defaults.D, x, S(S_).y, S(S_).z, logd_); return model.resistance(logd_);},
        shortening: function(logd_) {return 100*model.shortening(logd_);}
    };
    
})();

$(document).ready(function() {
    AHR.create();
    $("#discrete").discrete_slider({channel: "mwww/", topic: "S"});
    $("#continuous").continuous_slider({channel: "mwww/", topic: "logd"});
    $("#multi_plot").multi_plot_d3({channel: "mwww/", model: AHR.resistance, width: 400});
    $("#cross_section").cross_section_div({channel: "mwww/", rmax: defaults.A, width: 275});
    $("#single_plot").single_plot_d3({channel: "mwww/", model: AHR.shortening, width: 400});
    AHR.update();
});

