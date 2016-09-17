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
                var x = parseInt(this.$textbox.val(),10);
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
