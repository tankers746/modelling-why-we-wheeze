var AHR_demo = (function() {
    var channel = "demo/";

    //These parameters do not change for the ASM page.
    var A = 2.75;
    var B = 1.5*Math.PI;
    var C = 2.5*Math.PI;
    var D = 0.32*Math.PI;
    
    //Need to store these variables for when S changes and logd doesn't,
    //  and vice versa
    var x=0.2;
    var y=0;
    var z=0;
    var logd=-6;
    
    //Create the model usign default starting values;
    var model = new Airway();
    
    //Callback function for when S changes
    function callback_S(e, S) {
        y = 0.01*S;
        z = 0.2*S;
        model.update(A, B, C, D, x, y, z, logd);
        $.publish(channel + "ra", [model.radii.lumen]);
        $.publish(channel + "rb", [model.radii.mucosal]);
        $.publish(channel + "rc", [model.radii.sub_mucosal]);
        $.publish(channel + "rd", [model.radii.asm]);
        $.publish(channel + "AR", [model.resistance()]);
        $.publish(channel + "ASM_short", [model.shortening(logd)]);
        
    }
    
    //Callback function for when logd changes
    function callback_logd(e, logd_) {
        logd = logd_;
        model.update(A, B, C, D, x, y, z, logd);
        $.publish(channel + "ra", [model.radii.lumen]);
        $.publish(channel + "rb", [model.radii.mucosal]);
        $.publish(channel + "rc", [model.radii.sub_mucosal]);
        $.publish(channel + "rd", [model.radii.asm]);
        $.publish(channel + "AR", [model.resistance()]);
        $.publish(channel + "ASM_short", [model.shortening(logd)]);
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
    
    //This is the magic of the revealing module pattern: public interfaces.
    return {
        create : create,
        destroy : destroy
    };
    
})();

//Start the controller.
AHR_demo.create();

//Stop the controller.
//AHR_demo.destroy();

