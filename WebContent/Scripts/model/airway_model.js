// TODO: Set up the channel used to communicate airway data.

// This object will represent the airway as visualised by the cross section diagram.
function Airway(A,B,C,D)
{
	// The area of each airway layer, ordered from outermost to innermost.
	this.areas = new Array(3);
	
	// The radii of the four circles that define the layers, also from outermost to innermost.
	this.radii = new Array(4);

	// Calculates the inner radius of an airway layer given its outer radius and area.
	var innerRadius = function(outer_r, area) {return Math.sqrt(Math.pow(outer_r, 2) - area / Math.PI)};

	// Calculate new radii after a parameter change and publishes them.
	this.update = function(A,B,C,D)
	{
		this.areas = [B,C,D];

		this.radii[0] = A;
		this.radii[1] = innerRadius(A,B);
		this.radii[2] = innerRadius(this.radii[1],C);
		this.radii[3] = innerRadius(this.radii[2],D);

		// TODO: Publish the changed values.
	};

	this.update(A,B,C,D);
};

var airway = new Airway(/*TODO: Retrieve inital values from page defaults.*/);

// TODO: Setup event listeners to respond to user inputs.

