$.widget("mwww.spinner2", $.ui.spinner, {

    options: {
        channel: "mwww/",
        topic: "default_topic",

        initval: 2.75,
        min: 1.75,
        max: 4.4,
        step: 0.05,
        unit: null,
        desc: null,
        altLabel: null,
        suffix: null
    },

    _format: function(value) {
        return value;
    },

    _parse: function(value) {
        //remove the pi when parsing values
        return parseFloat(value.toString().split('\0')[0]);
    },

    _create: function() {

        var self = this;
        var options = this.options;

		var labeldiv = $("<div/>", {
			class: "spinner_label",
		});
        var label = $("<label/>", {
            html:  options.altLabel || options.topic
        });
		
		$(this.element).before(labeldiv);
		labeldiv.append(label);	   

        if(options.desc) {
            labeldiv.append(options.desc);
        }
        if(options.unit) {
            labeldiv.append(" (" + options.unit + ")");
        }
		


        function updateValue(sp, options) {
            var value = $(sp).spinner2("value");
            var min = $(sp).spinner2("option", "min");
            var max = $(sp).spinner2("option", "max");
            //check if value is numerical
            if (isNaN(parseFloat(value)) || !isFinite(value)) {
                value = options.initval;
            } else {
                if (value > max) {
                    value = max;
                } else if (value < min) {
                    value = min;
                }
            }
            if (options.suffix) {
                value += options.suffix;
            }
            /*
            if(unit) {
                value = value + " " + unit;
            }*/
            sp.value = value;
            $.publish((options.channel + options.topic), [$(sp).spinner2("value")]);
        }
        //create the spinner by calling super (this calls the create method of the class that we are extending - spinner)
        this._super();
        this._setOption("min", options.min);
        this._setOption("max", options.max);
        this._setOption("step", options.step);

        //ensures that the min and max are being adhered to
        //also ensures that pi and unit are added
        this._setOption("spin", function(event, ui) {
            updateValue(this, options);
        });
        this._setOption("change", function(event, ui) {
            updateValue(this, options);
        });

        //set to default value
        $(this.element).spinner2("value", options.initval);
    },

    _destroy: function() {
        this.$label.remove();
        this._super();
        $(this.element).unwrap();
    }

});
