defaults = {A:2.75, B:1.5*Math.PI, C:2.5*Math.PI, D:0.32*Math.PI, x:0.2,y:0,z:0,logd:-9};

// Virtual representation of the airway being modelled.
function Airway()
{
	// The normal radius of the outermost layer with no methacoline present.
    this.max_asm;
    // The maximum percentage that the ASM is capable of shrinking.
    this.max_short;
    // The area of each airway layer.
    this.areas = new Object();
    // The radii of the four circles that define the layers.
    this.radii = new Object();
    
    this.update(defaults.A, defaults.B, defaults.C, defaults.D, defaults.x, defaults.y, defaults.z, defaults.logd);
};

// Calculates the radius of a circular layer given the radius and area of the layer above it.
Airway.prototype.layer_radius = function(above_radius, above_area)
{
    return Math.sqrt(Math.max(0, Math.pow(above_radius, 2) - above_area / Math.PI));
};

// ASM shortening triggered by a given methacoline dose.
Airway.prototype.shortening = function(logd)
{
    return this.max_short / (1 + Math.pow(10, -6-logd));
};

// The shortened layer radii after receiving a methacholine dose.
// Needed to separate this from the update() function so the resistance graph can be drawn without changing the Airway's properties.
Airway.prototype.mc_response = function(max_asm, areas, logd)
{
	var radii = new Object();

	radii.asm = max_asm * (1 - this.shortening(logd));
	radii.sub_mucosal = this.layer_radius(radii.asm, areas.asm);
    radii.mucosal = this.layer_radius(radii.sub_mucosal, areas.sub_mucosal);
    radii.lumen = this.layer_radius(radii.mucosal, areas.mucosal);

    return radii;
};

// Poiseuille's Law.
Airway.prototype.resistance = function(logd)
{
    var lumen = this.mc_response(this.max_asm, this.areas, logd).lumen;
    if(lumen < 1e-3) {
        return 1e12;
    } else {
        return Math.pow(lumen, -4);
    }
};

// Updates the airway properties in response to new inputs.
// Returns 0 upon successful update.
// Returns -1 if airway cannot shrink further.
Airway.prototype.update = function(A,B,C,D,x,y,z,logd)
{
    var max_asm = A;
    this.max_short = x;

    var areas = new Object();
    
    areas.asm = B;
    areas.sub_mucosal = C*(1+y);
    areas.mucosal = D*(1+z);

    var radii = this.mc_response(max_asm, areas, logd);
    
    this.max_asm = max_asm;
    this.areas = areas;
    this.radii = radii;

	// Check that the airway has enough area to contain all layers.
    if(areas.asm + areas.sub_mucosal + areas.mucosal > Math.pow(radii.asm, 2)*Math.PI)
    {
    	return -1;
	}
	else
	{
		//this.max_asm = max_asm;
		//this.areas = areas;
		//this.radii = radii;
		
		return 0;
	}
};
