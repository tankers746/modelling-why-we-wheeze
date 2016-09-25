$.widget('mwww.dynamic_plot', {
    options: {
        channel:    "default/"
    },
    
    $image:   {},
    
    
    _create: function() {
        
        var container = this.element;
        
        this.$image = $("<img>/", {
            id:     container.attr('id') + "_image",
            src:    "../media/dynamic_graph.png",
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
