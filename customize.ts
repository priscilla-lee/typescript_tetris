/************************************************************************
* CUSTOMIZABLE VARIABLES: cols, rows, size, keys, delay, colors
	? what keys/controls
	? style/color/image of tetrominos
	? ghost or no ghost
	? how many games at same time? 1 or 2 player
	? reveal how many "next" blocks

************************************************************************/
var key = {
	play: 13, //enter
	pause: 13, //enter
	left: 37,
	right: 39,
	down: 40,
	rotate: 38, //up
	drop: 32, //space
	hold: 16 //shift
}

var delay = 300; //milliseconds

var color = {
	I: {outline: "#0D455B", fill: "#1A9AFC", shade: "#1986D3", highlight: "#26ADFF", twinkle: "white"},
	J: {outline: "#001467", fill: "#133BDF", shade: "#1224C2", highlight: "#245CDF", twinkle: "white"},
	L: {outline: "#842600", fill: "#F96700", shade: "#D74900", highlight: "#F78400", twinkle: "white"},
	O: {outline: "#CA9720", fill: "#FFDE23", shade: "#FDB900", highlight: "#FDC500", twinkle: "white"},
	S: {outline: "#459100", fill: "#7EEB00", shade: "#72D000", highlight: "#8BED00", twinkle: "white"},
	T: {outline: "#8D1B8A", fill: "#DB2DC4", shade: "#C232A2", highlight: "#E135CD", twinkle: "white"},
	Z: {outline: "#AF203C", fill: "#F21F48", shade: "#F21F48", highlight: "#F95A83", twinkle: "white"},
	".": {outline: "black", fill: "#222", shade: "#222", highlight: "#222", twinkle: "#222"},
	"ghost": {outline: "black", fill: "#888", shade: "#222", highlight: "#222", twinkle: "#888"},
};

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


console.log("loaded customize.js successfully");