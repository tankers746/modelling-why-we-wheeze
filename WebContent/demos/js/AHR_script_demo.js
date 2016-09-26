var AHR_demo = (function() {
    var channel = "demo/";
    
    //Need to store these variables for when S changes and logd doesn't,
    //  and vice versa
    var x=0.2;
    var y=0;
    var z=0;
    var logd=-6;
    
    //Create the model usign default starting values;
    var model = new Airway();
    
    //Function to update model and publish results.
    function update_and_publish() {
        model.update(defaults.A, defaults.B, defaults.C, defaults.D, x, y, z, logd);
        $.publish(channel + "ra", [model.radii.lumen]);
        $.publish(channel + "rb", [model.radii.mucosal]);
        $.publish(channel + "rc", [model.radii.sub_mucosal]);
        $.publish(channel + "rd", [model.radii.asm]);
        $.publish(channel + "AR", [model.resistance()]);
        $.publish(channel + "ASM_short", [100*model.shortening(logd)]);
    }
    
    
    //Callback function for when S changes
    function callback_S(e, S) {
        y = 0.02*S;
        z = 0.1*S;
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
        $.subscribe((channel+"log_d"),callback_logd);
    }
    
    //Unsubscribe all.
    function destroy() {
        $.unsubscribe((channel+"S"),callback_S);
        $.unsubscribe((channel+"log_d"),callback_logd);
    }
    
    //Revealing module.
    return {
        create : create,
        destroy : destroy
    };
    
})();

//Start the controller.
AHR_demo.create();

//Stop the controller.
//AHR_demo.destroy();

