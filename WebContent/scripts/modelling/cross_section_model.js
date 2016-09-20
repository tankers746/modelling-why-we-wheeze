/**
 * Calculates the inner radius of an airway layer given its outer radius and area.
 * @param outer_r	The radius of the outer circle comprising the layer.
 * @param area 		The internal area of the layer.
 * @return		The radius of the inner circle comprising the layer.
 */
function innerRadius(outer_r, area)
{
	return Math.sqrt(Math.pow(outer_r, 2) - area / Math.PI);
}

/**
 * Finds the inner radii of all layers in the cross section.
 * @param a_r	Outer radius of the entire cross-section (model parameter A).
 * @param b_a	Area of layer B (model parameter B).
 * @param c	Area of layer C (model parameter C).
 * @param d	Area of layer D (model parameter D).
 * @returns	Array containing the inner radii of the layers.
 */
function layerSizes(a_r, b_a, c_a, d_a)
{
	var total_a = Math.PI * Math.pow(a_r, 2);
	
	var b_r = innerRadius(a_r, b_a);
	var c_r = innerRadius(b_r, c_a);
	var d_r = innerRadius(c_r, d_a);
	
	return [b_r, c_r, d_r];
}
