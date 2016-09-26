var param_demo = (function() {
    var channel = "demo/";
    
    //Now, all the parameters are variables.
    var A = defaults.A;
    var B = defaults.B;
    var C = defaults.C;
    var D = defaults.D;
    var xmax=defaults.x;
    var y = defaults.y;
    var z = defaults.z;
    var logd = -18;
    
    
    //Create the model usign default starting values;
    var model = new Airway();

    
    //Update and publish all
    function update_and_publish() {
        model.update(A, B, C, D, xmax, y, z, logd);
        $.publish(channel + "ra", [model.radii.lumen]);
        $.publish(channel + "rb", [model.radii.mucosal]);
        $.publish(channel + "rc", [model.radii.sub_mucosal]);
        $.publish(channel + "rd", [model.radii.asm]);
    }

    //Callback function for when A changes
    function callback_A(e, A_) {
        A = A_;
        update_and_publish();
    }
    
    //And B etc.
    function callback_B(e, B_) {
        B = B_;
        update_and_publish();
    }
    
    //Really need an array.  TODO.
    function callback_C(e, C_) {
        C = C_;
        update_and_publish();
    }
    
    function callback_D(e, D_) {
        D = D_;
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
param_demo.create();

//Stop the controller.
//param_demo.destroy();

