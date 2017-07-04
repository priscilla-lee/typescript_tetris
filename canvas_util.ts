/************************************************************************
* CanvasUtil: (rendering) set board canvas w x h, draw block & board
************************************************************************/
class CanvasUtil {
	public static rect(element: any, x: number, y: number, w: number, h: number, weight: number, fill: string, line: string): void {
		var ctx= element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = fill;
			ctx.strokeStyle = line;
			ctx.fillRect(x, y, w, h);
			ctx.lineWidth = weight;
			ctx.rect(x, y, w, h);
			if (weight != 0) ctx.stroke();
	}

	public static circle(element: any, x: number, y: number, r: number, fill: string, line: string): void {
		var ctx = element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = fill;
			ctx.strokeStyle = line;
			ctx.arc(x, y, r, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
	}
	
	public static roundRect(element: any, x: number, y: number, w: number, h: number, r: number, color: string): void {
		var ctx = element.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = color;
			// ctx.strokeStyle = "red";
			// ctx.lineWidth = 10;
			//draw rounded rectangle
			ctx.moveTo(x + r, y);
			ctx.lineTo(x + w - r, y);
			ctx.quadraticCurveTo(x + w, y, x + w, y + r);
			ctx.lineTo(x + w, y + h - r);
			ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
			ctx.lineTo(x + r, y + h);
			ctx.quadraticCurveTo(x, y + h, x, y + h - r);
			ctx.lineTo(x, y + r);
			ctx.quadraticCurveTo(x, y, x + r, y);
			ctx.closePath();
			//stroke & fill	
			ctx.fill();    
			// ctx.stroke();  
	}
}