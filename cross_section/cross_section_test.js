$.widget('test.my_test_buttons', {
    options: {
         value : 0,
         name : "x",
         channel : "default/",
         max : 1024,
         min : -1023
    },
         
    _create: function() {
        
        var self = this;
        var container = this.element;
        var options = this.options;
        
        function format(str) {
            return (" " + options.name + " = " + str + " ");
        };
        
        this.value_text = $("<span/>", {
            id : container.attr('id') + "_val",
            text : format(options.value)
        });
         
        this.dec_button = $("<button/>", {
            id : container.attr('id') + "_dec",
            text : "-",
            click : function() {
                if(options.value > options.min) {
                    options.value--;
                    self.value_text.text(format(options.value));
                }
                $.publish((options.channel+options.name), [options.value]);
            }
        });
        
        this.inc_button = $("<button/>", {
            id : container.attr('id') + "_inc",
            text : "+",
            click : function() {
                if(options.value < options.max) {
                    options.value++;
                    self.value_text.text(format(options.value));
                }
                $.publish((options.channel+options.name), [options.value]);
            }
        });
        
        //$(this.element).after(this.inc_button).after(this.value_text).after(this.dec_button);
         $(this.element).append(this.dec_button).append(this.value_text).append(this.inc_button);
    },
         
         
    _destroy: function() {
        $(this.element).empty();
        $(this.element).remove();
    },
         
         
    _setOption: function(key, value) {
    }

});

$.widget('test.my_subscriber', {
    options: {
        name : "x",
        channel : "default/",
    },
    
    _create: function() {
        
        var self = this
        var container = this.element;
        var options = this.options;
        
        this.message = $("<p/>", {
            id : container.attr('id') + "_val",
            text : options.name
        });
        
        this.handle = $.subscribe((options.channel+options.name), function (e, x) {
            self.message.text(x);
        });
        
        $(this.element).after(this.message);
        
    },
    
    _destroy: function() {
        $.unsubscribe((options.channel+options.name), this.handle);
        $(this.element).empty();
        $(this.element).remove();
    }
    
});
