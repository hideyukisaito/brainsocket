function drawGrid()
{
	var canvas = document.getElementById("grid");
	canvas.width = document.body.clientWidth * 2;
	canvas.height = 2000;
	
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = "rgb(204, 204, 204)";
	ctx.lineWidth = 0.5;
	
	for (var i = 0; i < canvas.width; i += 20)
	{
		drawLine(ctx, i, 0, i, canvas.height);
		for (var j = 0; j < canvas.height; j += 20)
		{
			drawLine(ctx, 0, j, canvas.width, j);
		}
	}
}

function drawLine(context, x1, y1, x2, y2)
{
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.closePath();
	context.stroke();
}