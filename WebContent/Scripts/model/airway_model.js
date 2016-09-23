// TODO: Set up the channel used to communicate airway data.
// TODO: Setup event listeners to respond to user inputs.

// Virtual representation of the airway being modelled.
function Airway(A,B,C,D,x,y,z)
{
	// The area of each airway layer, ordered from outermost to innermost.
	this.areas;

	// The normal radius of the outermost layer with no methacoline present.
	this.A = A;
	
	// The radii of the four circles that define the layers, also from outermost to innermost.
	this.radii;

	// The maximum percentage that the airway is capable of shrinking.
	this.max_short;

	this.update(A,B,C,D,x,y,z,1);
}

// Calculates the radius of an airway layer given the radius and area of the layer above it.
layer_radius = function(above_radius, above_area)
{
	return Math.sqrt(Math.pow(above_radius, 2) - above_area / Math.PI);
}

// ASM shortening triggered by a given methacoline dose.
Airway.prototype.shortening = function(logd)
{
	return this.max_short / (1 + Math.pow(10, -6-logd));
}

// The new airway layer dimensions after responding to a given methacoline dose.
Airway.prototype.response = function(logd)
{
	radii = new Array(4);
	
	radii[0] = this.A * (1 - this.shortening(logd));
	radii[1] = layer_radius(radii[0], this.areas[0]);
	radii[2] = layer_radius(radii[1], this.areas[1]);
	radii[3] = layer_radius(radii[2], this.areas[2]);

	return radii;
}

// Airway resistance triggered by a given methacoline dose.
Airway.prototype.resistance = function(logd)
{
	lumen_radius = this.response(logd)[3];
	normal_lumen = this.response(1)[3];
	
	return 1 / Math.pow(lumen_radius, 4);
}

// Updates the airway properties in response to new inputs.
Airway.prototype.update(A,B,C,D,x,y,z,logd)
{
	this.max_short = x;

	this.areas = [B, C*(1+y), D*(1+z)];
	this.radii = this.response(logd);
	

	// TODO: Publish updated properties.
}
