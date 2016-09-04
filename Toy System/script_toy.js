
function Variable(name, value) {
    return {
        name : name,
        value : value
    };
}

function System() {
    
    var variables_ = [],
        elements_ = [],
        table_ = [];
    
    function add_(e, x) {
        //add element e to elements_
        elements_.push(e);
        
        //search for x in variables_
        var i;
        for(i=0; i<variables_.length; i++) {
            if(variables_[i].name === x.name) {
                break;
            }
        }
        
        //either append existing table row or add variable and add a new table row
        if(i < variables_.length) {
            table_[i].push(e);
        } else {
            variables_.push(x);
            table_.push([e]);
        }
    }
    
    function receive_(x) {
        var i, j;
        for(i=0; i<variables_.length; i++) {
            //look for variable in variables array
            if(variables_[i].name === x.name) {
                variables_[i].value = x.value;
                //table stores refs to all the objects that depend on the variable
                for(j=0; j<table_[i].length; j++) {
                    table_[i][j].update(x);
                }
            }
        }
    }
    
    return {
        add     : add_,
        receive : receive_,
        ping    : function() {alert("ping from system");}
    };
    
}



function MyButton(variable, callback_fcn, system) {
    var variable_ = Variable(variable.name, variable.value),
        callback_fcn_ = callback_fcn,
        system_ = system,
        dom_ref_;
    
    function create_dom_element_(dev_id, name) {
        var button = document.createElement("input");
        button.ID = dev_id.concat("_button");
        button.type = "button";
        button.value = name;
        button.onclick = function() {
            variable_.value = callback_fcn_(variable_.value);
            transmit_();
        };
        
        dom_ref_ = button;
        document.getElementById(dev_id).appendChild(dom_ref_);
    }
    
    function destroy_dom_element_() {
        if(dom_ref_) {
            dom_ref_.parentNode.removeChild(dom_ref_);
        }
    }
    
    function transmit_() {
        system_.receive(variable_);
    }
    
    function update_(x) {
        if(variable_.name === x.name) {
            variable_.value = x.value;
        }
    }
    
    return {
        create      : create_dom_element_,
        destroy     : destroy_dom_element_,
        update      : update_
    };
}



function MyTextbox(variable, system) {
    var variable_ = Variable(variable.name, variable.value),
        system_ = system,
        dom_ref_;
    
    
    function create_dom_element_(dev_id) {
        var textbox = document.createElement("input");
        textbox.ID = dev_id;
        textbox.type = "text";
        textbox.value = variable_.value;
        textbox.onchange = function() {
            variable_.value = parseInt(textbox.value,10);
            transmit_();
        };
        
        dom_ref_ = textbox;
        document.getElementById(dev_id).appendChild(dom_ref_);
    }
    
    function destroy_dom_element_() {
        if(dom_ref_) {
            dom_ref_.parentNode.removeChild(dom_ref_);
        }
    }
    
    function transmit_() {
        system_.receive(variable_);
    }
    
    function update_(x) {
        if(variable_.name === x.name) {
            variable_.value = x.value;
            dom_ref_.value = variable_.value;
        }
    }
    
    return {
        create      : create_dom_element_,
        destroy     : destroy_dom_element_,
        update      : update_
    };
}


function MyCrappyCreation(variable, system) {
    var variable_ = Variable(variable.name, variable.value),
    system_ = system,
    dom_ref_;
    
    function create_dom_element_(dev_id) {
        var box = document.createElement("div");
        box.style.width = "50px";
        box.style.height = "50px";
        box.style.background = "red";
        
        box.style.position = "absolute";
        
        box.onclick = function() {
            box.style.background = "blue";
        };
        do_crappy_things_(box);
        
        dom_ref_ = box;
        document.getElementById(dev_id).appendChild(dom_ref_);
    }
    
    function destroy_dom_element_() {
        if(dom_ref_) {
            dom_ref_.parentNode.removeChild(dom_ref_);
        }
    }
    
    function update_(x) {
        if(variable_.name === x.name) {
            variable_.value = x.value;
        }
        do_crappy_things_(dom_ref_);
    }
    
    function do_crappy_things_(div) {
        div.style.left = (36+4*variable_.value) + "px";
        if(variable_.value < -21) {
            div.style.background = "red";
        }
    }
    
    return {
        create      : create_dom_element_,
        destroy     : destroy_dom_element_,
        update      : update_
    };
    
}




function MyIncrement(variable, system) {
    var button = MyButton(variable, increment, system);
    return {
        create      : function(dev_id) {button.create(dev_id, "+");},
        destroy     : button.destroy,
        update      : button.update
    };
}

function MyDecrement(variable, system) {
    var button = MyButton(variable, decrement, system);
    return {
        create      : function(dev_id) {button.create(dev_id, "-");},
        destroy     : button.destroy,
        update      : button.update
    };
}


function increment(x) {
    return x+1;
}

function decrement(x) {
    return x-1;
}
