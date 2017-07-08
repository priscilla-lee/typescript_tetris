/************************************************************************
* CUSTOMIZABLE VARIABLES: cols, rows, size, keys, delay, colors
	? what keys/controls
	? style/color/image of tetrominos
	? ghost or no ghost
	? how many games at same time? 1 or 2 player
	? reveal how many "next" blocks

************************************************************************/
class Color {
	public outline: string;
	public fill: string;
	public shade: string;
	public highlight: string;
	public twinkle: string;

	public static I = new Color("#0D455B", "#1A9AFC", "#1986D3", "#26ADFF", "white");
	public static J = new Color("#001467", "#133BDF", "#1224C2", "#245CDF", "white");
	public static L = new Color("#842600", "#F96700", "#D74900", "#F78400", "white");
	public static O = new Color("#CA9720", "#FFDE23", "#FDB900", "#FDC500", "white");
	public static S = new Color("#459100", "#7EEB00", "#72D000", "#8BED00", "white");
	public static T = new Color("#8D1B8A", "#DB2DC4", "#C232A2", "#E135CD", "white");
	public static Z = new Color("#AF203C", "#F21F48", "#F21F48", "#F95A83", "white");
	public static Empty = new Color("black", "#222", "#222", "#222", "#222");
	public static Ghost = new Color("black", "#888", "#222", "#222", "#888");

	public constructor(outline: string, fill: string, shade: string, highlight: string, twinkle: string) {
		this.outline = outline;
		this.fill = fill;
		this.shade = shade;
		this.highlight = highlight;
		this.twinkle = twinkle;
	}
}

function getColor(shape: Shape): Color {
	switch(shape) {
		case (Shape.I): return Color.I;
		case (Shape.J): return Color.J;
		case (Shape.L): return Color.L;
		case (Shape.O): return Color.O;
		case (Shape.S): return Color.S;
		case (Shape.T): return Color.T;
		case (Shape.Z): return Color.Z;
		case (Shape.Empty): return Color.Empty;
		case (Shape.Ghost): return Color.Ghost;
	}
}

// var color = {
// 	I: {outline: "black", fill: "turquoise", shade: "turquoise", highlight: "turquoise"},
// 	J: {outline: "black", fill: "blue", shade: "blue", highlight: "blue"},
// 	L: {outline: "black", fill: "orange", shade: "orange", highlight: "orange"},
// 	O: {outline: "black", fill: "yellow", shade: "yellow", highlight: "yellow"},
// 	S: {outline: "black", fill: "green", shade: "green", highlight: "green"},
// 	T: {outline: "black", fill: "purple", shade: "purple", highlight: "purple"},
// 	Z: {outline: "black", fill: "red", shade: "red", highlight: "red"},
// 	".": {outline: "black", fill: "#2A2A2A", shade: "#2A2A2A", highlight: "#2A2A2A"},
// 	"ghost": {outline: "black", fill: "white", shade: "white", highlight: "white"},
// };