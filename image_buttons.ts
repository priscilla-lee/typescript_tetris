function addImageButton(shape: Shape): void {
	// set up preview canvas
	var canvas = document.createElement("canvas");
		canvas.setAttribute("id", "plstestme");

	var render = new Render(canvas, 0, 0);
		render.drawStylePreview(shape);

	// set up an input element
	var input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("style", "display: none;");
		input.onchange = function(e: any) {
			var url = window.URL.createObjectURL(e.target.files[0]);
			var img = new Image();
				img.src = url;
			IMAGES.set(shape, img);

			img.onload = function(e) {
				render.drawStylePreview(shape);
			}
		}

	// wrap it in a nice-looking label
	var label = document.createElement("label");
		label.classList.add("btn");
		label.classList.add("btn-default");
		label.classList.add("btn-file");
		label.innerHTML = "Choose " + shape;
		label.appendChild(input);

	// add it inside a col
	var col = document.createElement("div");
		col.classList.add("col-md-2");
		col.appendChild(label);
		col.appendChild(canvas);

	homescreen.appendChild(col);
}

addImageButton(Shape.I);
addImageButton(Shape.J);
addImageButton(Shape.L);
addImageButton(Shape.O);
addImageButton(Shape.S);
addImageButton(Shape.T);
addImageButton(Shape.Z);