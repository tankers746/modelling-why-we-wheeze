$.widget('mwww.dynamic_plot', {
    options: {
        channel:    "default/",
        image_dir:  "./widgets/dynamic_plot/"
    },
    
    $image:   {},
    
    
    _create: function() {
        
        this.$image = $("<img>/", {
            id:     this.element.attr('id') + "_image",
            src:    this.options.image_dir + "dynamic_plot_image.png",
            alt:    "Placeholder widget"
        });
        
        this.$image.css({'border' : '1px solid #000'});
        
        $(this.element).append(this.$image);
    },
    
    _destroy: function() {
        $(this.element).empty();
        $(this.element).remove();
    }

});
