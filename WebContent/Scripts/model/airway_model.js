// TODO: Set up the channel used to communicate airway data.
// TODO: Setup event listeners to respond to user inputs.



// Virtual representation of the airway being modelled.
function Airway(A,B,C,D,x,y,z)
{
    // The area of each airway layer, ordered from outermost to innermost.
    this.areas = new Array(3);
    
    // The normal radius of the outermost layer with no methacoline present.
    this.A = A;
    
    // The maximum percentage that the ASM is capable of shrinking.
    this.max_short = x;
    
    // The radii of the four circles that define the layers, also from outermost to innermost.
    this.radii = new Array(4);
    
    this.update(A,B,C,D,x,y,z,-3);
}

// Calculates the radius of a circular layer given the radius and area of the layer above it.
Airway.prototype.layer_radius = function(above_radius, above_area)
{
    return Math.sqrt(Math.pow(above_radius, 2) - above_area / Math.PI);
};

// Poiseuille's Law.
Airway.prototype.tube_resistance = function(radius)
{
    return 1 / Math.pow(radius, 4);
};

// ASM shortening triggered by a given methacoline dose.
Airway.prototype.shortening = function(logd)
{
    return this.max_short / (1 + Math.pow(10, -6-logd));
};

// The new airway layer dimensions after responding to a given methacoline dose.
Airway.prototype.response = function(logd)
{
    radii = new Array(4);
    
    radii[0] = this.A * (1 - this.shortening(logd));
    radii[1] = this.layer_radius(radii[0], this.areas[0]);
    radii[2] = this.layer_radius(radii[1], this.areas[1]);
    radii[3] = this.layer_radius(radii[2], this.areas[2]);
    
    return radii;
};

// Airway resistance triggered by a given methacoline dose. Resistance scales from 0 (normal airway) to 1 (fully closed airway).
Airway.prototype.resistance = function(logd)
{
    lumen_radius = this.response(logd)[3];
    normal_lumen = this.response(-3)[3];
    
    return 1 - (this.tube_resistance(normal_lumen) / this.tube_resistance(lumen_radius));
};

// Updates the airway properties in response to new inputs.
Airway.prototype.update = function(A,B,C,D,x,y,z,logd)
{
    this.A = A;
    this.max_short = x;
    
    this.areas = [B, C*(1+y), D*(1+z)];
    this.radii = this.response(logd);
    
    
    // TODO: Publish updated properties.
};

