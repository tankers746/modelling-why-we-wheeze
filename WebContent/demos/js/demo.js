$.widget('demo.my_publisher', {
    options: {
        channel:    "default/",
        topic:      "topic"
    },
    
    $description:   {},
    $textbox:       {},
    $submit_button: {},
    
    _create: function() {
        
        var self = this;
        var container = this.element;
        var options = this.options;
        
        
        this.$description = $("<label/>", {
            id:     container.attr('id') + "_description",
            text:   options.topic + " = "
        });
        
        this.$textbox = $("<input type = 'text'/>", {
            id:     container.attr('id') + "_textbox"
        });
        
        this.$submit_button = $("<button/>", {
            id:     container.attr('id') + "_submit_button",
            text:   "submit",
        });
        
        this._on(this.$submit_button, {
            click:  function() {
                var x = parseFloat(this.$textbox.val());
                if(!isNaN(x)) {
                    //alert("sending " + x);
                    $.publish((options.channel+options.topic), [x]);
                }
            }
        });
        
        $(this.element).append(this.$description).append(this.$textbox).append(this.$submit_button);
        
    },
    
    _destroy: function() {
        $(this.element).empty();
        $(this.element).remove();
    }
});

$.widget('demo.my_subscriber', {
    options: {
        channel:    "default/",
        topic:      "topic"
    },
    
    $words:     {},
    callback:   {},
    
    _create: function() {
        
        var self = this;
        var container = this.element;
        var options = this.options;
        
        
        this.$words = $("<span/>", {
            id:     container.attr('id') + "_description",
            text:   options.topic + " = " + "?"
        });
        
        
        this.callback = function(e, data) {
            //alert("received " + data);
            self.$words.text(options.topic + " = " + data);
        };
        
        $.subscribe((options.channel+options.topic), this.callback);
        
        
        $(this.element).append(this.$words);
    
    },
    
    _destroy: function() {
        $(this.element).empty();
        $(this.element).remove();
    }
});


$.widget('demo.my_publisher_buttons', {
    options: {
        channel:    "default/",
        topic:      "topic",
        value:      0
    },
         
    $label:         {},
    $inc_button:    {},
    $dec_button:    {},
         
    _create: function() {
         
        var self = this;
        var container = this.element;
        var options = this.options;
         
         
        this.$label = $("<span/>", {
            id:     container.attr('id') + "_label",
            text:   options.topic + " = " + options.value,
        });
        
        this.$inc_button = $("<button/>", {
            id:     container.attr('id') + "_inc_button",
            text:   "+",
        });
        
        this.$dec_button = $("<button/>", {
            id:     container.attr('id') + "_dec_button",
            text:   "-",
        });
        
        this._on(this.$inc_button, {
            click: function() {
                options.value++;
                self.$label.text(options.topic + " = " + options.value);
                $.publish((options.channel+options.topic), [options.value]);
            }
        });
        
        this._on(this.$dec_button, {
            click: function() {
                options.value--;
                self.$label.text(options.topic + " = " + options.value);
                $.publish((options.channel+options.topic), [options.value]);
            }
        });

        
        $(this.element).append(this.$dec_button).append(this.$label).append(this.$inc_button);
         
    },
         
    _destroy: function() {
        $(this.element).empty();
        $(this.element).remove();
    }
});
