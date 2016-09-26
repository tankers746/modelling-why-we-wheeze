defaults = {A:2.75, B:1.5, C:2.5, D:0.32, x:0.2,y:0,z:0};

// Virtual representation of the airway being modelled.
function Airway()
{
	// The normal radius of the outermost layer with no methacoline present.
    this.normal_asm;
    // The maximum percentage that the ASM is capable of shrinking.
    this.max_short;
    // The area of each airway layer.
    this.areas = new Object();
    // The radii of the four circles that define the layers.
    this.radii = new Object();
    
    this.update(defaults.A, defaults.B, defaults.C, defaults.D, defaults.x, defaults.y, defaults.z, -3);
};

// Calculates the radius of a circular layer given the radius and area of the layer above it.
Airway.prototype.layer_radius = function(above_radius, above_area)
{
    return Math.sqrt(Math.pow(above_radius, 2) - above_area / Math.PI);
};

// Poiseuille's Law.
Airway.prototype.resistance = function()
{
    return 1 / Math.pow(this.radii.lumen, 4);
};

// ASM shortening triggered by a given methacoline dose.
Airway.prototype.shortening = function(logd)
{
    return this.max_short / (1 + Math.pow(10, -6-logd));
};

// Updates the airway properties in response to new inputs.
Airway.prototype.update = function(A,B,C,D,x,y,z,logd)
{
    this.normal_asm = A;
    this.max_short = x;
    
    this.areas.asm = B;
    this.areas.sub_mucosal = C*(1+y);
    this.areas.mucosal = D*(1+z);
    
    this.radii.asm = this.normal_asm * (1 - this.shortening(logd));
    this.radii.sub_mucosal = this.layer_radius(this.radii.asm, this.areas.asm);
    this.radii.mucosal = this.layer_radius(this.radii.sub_mucosal, this.areas.sub_mucosal);
    this.radii.lumen = this.layer_radius(this.radii.mucosal, this.areas.mucosal);
    
	this.areas.lumen = Math.PI * Math.pow(this.radii.lumen, 2);
};

