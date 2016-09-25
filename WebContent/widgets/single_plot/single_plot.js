$.widget('mwww.single_plot', {
    options: {
        channel:    "default/",
        image_dir:  "./widgets/single_plot/"
    },
    
    $image:   {},
    
    
    _create: function() {
        
        var container = this.element;
        
        this.$image = $("<img>/", {
            id:     this.element.attr('id') + "_image",
            src:    this.options.image_dir + "single_plot_image.png",
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
