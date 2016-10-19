/**
 * param script
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
 *     This script has two parts: the param module at the top and the part that adds widgets to the
 *     page at the bottom.
 *
 *     The param module at the top contains the model object (see airway_model.js or
 *     airway_model_B.js), the state variables (A, B, C, D, xmax, etc.) and a long list
 *     of callback functions.  When someone clicks on one of the spinners, it triggers an event in
 *     one of the subscribers.  This updates that state variable, makes calculations using
 *     model functions and publishes on other topics to trigger events in the airway cross-section
 *     diagram and graph.
 *
 *     The bottom part of the script is responsible for adding the widgets into empty divs
 *     (or input elements in the case of spinners).  Change widget options such as width there.
 *
 */


var param = (function() {
    var channel = "mwww/";
    
    // For this page, all the parameters are variables.
    var A = defaults.A;
    var B = defaults.B;
    var C = defaults.C;
    var D = defaults.D;
    var xmax=defaults.x;
    var y = defaults.y;
    var z = defaults.z;
    var logd = defaults.logd;
    
    
    // Create the model using default starting values.
    var model = new Airway();
    
    
    // Update model and publish radii for c/s diagram.
    function update_and_publish() {
        model.update(A, B, C, D, xmax, y, z, logd);
        $.publish(channel + "radii", [model.radii.lumen, model.radii.mucosal, model.radii.sub_mucosal, model.radii.asm]);
    }
    
    // Callback function for when A changes.
    function callback_A(e, A_) {
        A = A_;
        update_and_publish();
    }
    
    // Callback function for when B changes.
    function callback_B(e, B_) {
        B = B_ * Math.PI;
        update_and_publish();
    }
    
    // C, etc.
    function callback_C(e, C_) {
        C = C_ * Math.PI;
        update_and_publish();
    }
    
    function callback_D(e, D_) {
        D = D_ * Math.PI;
        update_and_publish();
    }
    
    function callback_xmax(e, xmax_) {
        xmax = xmax_/100;
        update_and_publish();
    }
    
    function callback_y(e, y_) {
        y = y_/100;
        update_and_publish();
    }
    
    function callback_z(e, z_) {
        z = z_/100;
        update_and_publish();
    }
    
    // Initialise the model and start the subscribers.
    function create() {
        model.update(A, B, C, D, xmax, y, z, logd);
        $.subscribe((channel+"A"),callback_A);
        $.subscribe((channel+"B"),callback_B);
        $.subscribe((channel+"C"),callback_C);
        $.subscribe((channel+"D"),callback_D);
        $.subscribe((channel+"xmax"),callback_xmax);
        $.subscribe((channel+"y"),callback_y);
        $.subscribe((channel+"z"),callback_z);
    }
    
    // Unsubscribe all.
    function destroy() {
        $.unsubscribe((channel+"A"),callback_A);
        $.unsubscribe((channel+"B"),callback_B);
        $.unsubscribe((channel+"C"),callback_C);
        $.unsubscribe((channel+"D"),callback_D);
        $.unsubscribe((channel+"xmax"),callback_xmax);
        $.unsubscribe((channel+"y"),callback_y);
        $.unsubscribe((channel+"z"),callback_z);
    }
    
    // Interface for the param module
    // create:      Initialises model and starts subscribers.
    // destroy:     Stops subscribers.
    // update:      Publishes current data on all channels.
    // resistance:  Returns a reference to Airway Resistance as a function of logd.
    //              Required by the dynamic plot.  Function is updated automatically by callbacks.
    return {
        create:     create,
        destroy:    destroy,
        update:     update_and_publish,
        resistance: function(logd_) {return model.resistance(logd_);}
    };
    
})();


$(document).ready(function() {
    param.create();
    
    $("#A_spinner").spinner2({
        channel: "mwww/",
        topic: "A",
        initval: 2.75,
        min: 1.75,
        max: 4.4,
        step: 0.05,
        unit: "mm",
        desc: "Airway outer radius"
    });

    $("#B_spinner").spinner2({
        channel: "mwww/",
        topic: "B",
        initval: 1.5,
        min: 0.5,
        max: 4,
        step: 0.05,
        unit: "mm\u00B2",
        suffix: '\u03C0',
        desc: "ASM area"
    });

    $("#C_spinner").spinner2({
        channel: "mwww/",
        topic: "C",
        initval: 2.5,
        min: 1,
        max: 6,
        step: 0.1,
        unit: "mm\u00B2",
        suffix: '\u03C0',
        desc: "Submucosal area"
    });

    $("#D_spinner").spinner2({
        channel: "mwww/",
        topic: "D",
        initval: 0.32,
        min: 0.05,
        max: 2,
        step: 0.01,
        unit: "mm\u00B2",
        suffix: '\u03C0',
        desc: "Muscosal area"
    });

    $("#xmax_spinner").spinner2({
        channel: "mwww/",
        topic: "xmax",
        initval: 20,
        min: 15,
        max: 30,
        step: 0.5,
        unit: "%max",
        altLabel: "x<sub>max</sub>",
        desc: "ASM shortening"
    });

    $("#y_spinner").spinner2({
        channel: "mwww/",
        topic: "y",
        initval: 0,
        min: 0,
        max: 100,
        step: 1,
        desc: "Percentage increase in submucosa area (%)"
    });

    $("#z_spinner").spinner2({
        channel: "mwww/",
        topic: "z",
        initval: 0,
        min: 0,
        max: 500,
        step: 5,
        desc: "Percentage increase in mucosa area (%)"
    });
    
    $("#cross_section").cross_section_d3({channel: "mwww/", rmax: 4.4, width: 275});
    $("#dynamic_plot").dynamic_plot_d3({channel: "mwww/", model: param.resistance, width: 400});
    
    param.update();
});

