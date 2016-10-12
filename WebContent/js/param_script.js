
var param = (function() {
    var channel = "mwww/";
    
    //Now, all the parameters are variables.
    var A = defaults.A;
    var B = defaults.B;
    var C = defaults.C;
    var D = defaults.D;
    var xmax=defaults.x;
    var y = defaults.y;
    var z = defaults.z;
    var logd = defaults.logd;
    
    
    //Create the model usign default starting values;
    var model = new Airway();
    
    
    //Update and publish all
    function update_and_publish() {
        model.update(A, B, C, D, xmax, y, z, logd);
        $.publish(channel + "radii", [model.radii.lumen, model.radii.mucosal, model.radii.sub_mucosal, model.radii.asm]);
    }
    
    //Callback function for when A changes
    function callback_A(e, A_) {
        A = A_;
        //$.publish(channel + "rmax", [A]);
        update_and_publish();
    }
    
    //And B etc.
    function callback_B(e, B_) {
        B = B_ * Math.PI;
        update_and_publish();
    }
    
    //Really need an array.  TODO.
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
        y = y_;
        update_and_publish();
    }
    
    function callback_z(e, z_) {
        z = z_;
        update_and_publish();
    }
    
    //Initialise the subscribers.
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
    
    //Unsubscribe all.
    function destroy() {
        $.unsubscribe((channel+"A"),callback_A);
        $.unsubscribe((channel+"B"),callback_B);
        $.unsubscribe((channel+"C"),callback_C);
        $.unsubscribe((channel+"D"),callback_D);
        $.unsubscribe((channel+"xmax"),callback_xmax);
        $.unsubscribe((channel+"y"),callback_y);
        $.unsubscribe((channel+"z"),callback_z);
    }
    
    //The magic revealing module pattern.
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
        max: 1,
        step: 0.01,
        desc: "Fractional increase in submucosa"
    });

    $("#z_spinner").spinner2({
        channel: "mwww/",
        topic: "z",
        initval: 0,
        min: 0,
        max: 5,
        step: 0.05,
        desc: "Fractional increase in mucosa area"
    });
    
    $("#cross_section").cross_section_d3({channel : "mwww/", rmax: 4.4});
    $("#dynamic_plot").dynamic_plot_d3({channel : "mwww/", model : param.resistance});
    
    param.update();
});

