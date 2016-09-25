var param_Controller = (function() {
    var channel = "demo/";
    
    //Now, all the parameters are variables.
    var A = 2.75;
    var B = 1.5*Math.PI;
    var C = 2.5*Math.PI;
    var D = 0.32*Math.PI;
    var xmax=20;
    var y=0;
    var z=0;
    logd = -12;
    
    
    //Create the model usign default starting values;
    var model = new Airway(A, B, C, D, xmax, y, z);

    
    //function for publishing on all channels
    function publish_all() {
        $.publish(channel + "ra", [model.radii[3]]);
        $.publish(channel + "rb", [model.radii[2]]);
        $.publish(channel + "rc", [model.radii[1]]);
        $.publish(channel + "rd", [model.radii[0]]);
    }

    //Callback function for when A changes
    function callback_A(e, A_) {
        A = A_;
        model.update(A, B, C, D, xmax, y, z, logd);
        publish_all();
    }
    
    //And B etc.
    function callback_B(e, B_) {
        B = B_;
        model.update(A, B, C, D, xmax, y, z, logd);
        publish_all();
    }
    
    //Really need an array.  TODO.
    function callback_C(e, C_) {
        C = C_;
        model.update(A, B, C, D, xmax, y, z, logd);
        publish_all();
    }
    
    function callback_D(e, D_) {
        D = D_;
        model.update(A, B, C, D, xmax, y, z, logd);
        publish_all();
    }
    
    function callback_xmax(e, xmax_) {
        xmax = xmax_;
        model.update(A, B, C, D, xmax, y, z, logd);
        publish_all();
    }
    
    function callback_y(e, y_) {
        y = y_;
        model.update(A, B, C, D, xmax, y, z, logd);
        publish_all();
    }
    
    function callback_z(e, z_) {
        z = z_;
        model.update(A, B, C, D, xmax, y, z, logd);
        publish_all();
    }
    
    //Initialise the subscribers.
    function create() {
        
        $.subscribe((channel+"A"),callback_A);
        $.subscribe((channel+"B"),callback_B);
        $.subscribe((channel+"C"),callback_C);
        $.subscribe((channel+"D"),callback_D);
        $.subscribe((channel+"x_max"),callback_xmax);
        $.subscribe((channel+"y"),callback_y);
        $.subscribe((channel+"z"),callback_z);
    }
    
    //Unsubscribe all.
    function destroy() {
        $.unsubscribe((channel+"A"),callback_A);
        $.unsubscribe((channel+"B"),callback_B);
        $.unsubscribe((channel+"C"),callback_C);
        $.unsubscribe((channel+"D"),callback_D);
        $.unsubscribe((channel+"x_max"),callback_xmax);
        $.unsubscribe((channel+"y"),callback_y);
        $.unsubscribe((channel+"z"),callback_z);
    }
    
    //This is the magic of the revealing module pattern: public interfaces.
    return {
        create : create,
        destroy : destroy
    };
    
})();

//Start the controller.
param_Controller.create();

//Stop the controller.
//param_Controller.destroy();

