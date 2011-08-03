var ContainerWidth = 600;
var ContainerHeight = 600;
var ContainerMarginTop = 50;
var ContainerMarginLeft = 200;
var CellWidth = 20;
var CellHeight = 20;
var RowCount = 30;
var ColumnCount = 30;
var LeftTopPoint_x = 0;
var LeftTopPoint_y = 0;
var CellArray = new Array();
var MaxContainerPointX = 30 - 1;
var MaxContainerPointY = 30 - 1;

////Container class
function Container(width, height) {
	this.width = width;
	this.height = height;
	this.left_top_point = null;
	this.center_point = null;

	if(typeof Container._initialized == "undefined") {
		Container.prototype.initializeCells = function() {
			for (var row = 0; row < this.height; row++) {
				for (var col = 0; col < this.width; col++) {
					$("#container").append("<div class=\"cell\"></div>");
					var cell_position = new ContainerPoint(row, col);
					CellArray[row * ColumnCount + col] = new Cell(cell_position);
				}
			}
		}
	}

	if(typeof Container._initialized == "undefined") {
		Container.prototype.clearupCells = function() {
			for (var row = 0; row < this.height; row++) {
				for (var col = 0; col < this.width; col++) {
					$(".image").remove();
					var cell_position = new ContainerPoint(row, col);
					CellArray[row * ColumnCount + col] = new Cell(cell_position);
				}
			}
		}
	}
	
	if(typeof Container._initialized == "undefined") {
		Container.prototype.getLeftTopPosition = function() {
			//LeftTopPoint_x = ($("body").width() - ContainerWidth) / 2;
			LeftTopPoint_x = ContainerMarginLeft; 
			LeftTopPoint_y = ContainerMarginTop;
			this.left_top_point = new ContainerPoint(0, 0);
		}
	}
	
	if(typeof Container._initialized == "undefined") {
		Container.prototype.getCenterPoint = function() {
			var x = Math.ceil(this.width / 2) - 1;
			var y = Math.ceil(this.height / 2) -1;
			this.center_point = new ContainerPoint(x, y);
		}
	}

	if(typeof Container._initialized == "undefined") {
		Container.prototype.fillFromCenter = function(image) {
			var iterate_count = Math.max(this.center_point.x, this.center_point.y);
			for(var count = 0; count < iterate_count; count++) {
				var left_top_point = new ContainerPoint(this.center_point.x - 1, this.center_point.y - 1);
				if(this.isValidPoint(left_top_point)) {
					image.put();
					break;
				}

				var right_top_point = new ContainerPoint(this.center_point.x + 1, this.center_point.y -1);
				if(this.isValidPoint(right_top_point)) {
					image.put();
					break;
				}

				var right_bottom_point = new ContainerPoint(this.center_point.x + 1, this.center_point.y + 1);
				if(this.isValidPoint(right_bottom_point)) {
					image.put();
					break;
				}

				var left_bottom_point = new ContainerPoint(this.center_point.x - 1, this.center_point.y + 1);
				if(this.isValidPoint(left_bottom_point)) {
					image.put();
					break;
				}
			}
		}
	}
	
	if(typeof Container._initialized == "undefined") {
		Container.prototype.isValidPoint = function(point) {
			//check out of bound

			//check conflict with other image
		}
	}

	if(typeof Container._initialized == "undefined") {
		Container._initialized = true;
	}
}
///End Container class

////Begin Point class, the point in the container coordinates(such as 30x30 coordinates), not the screen coordinate
function ContainerPoint(x, y) {
  this.x = x;
  this.y = y;
  this.screen_x = LeftTopPoint_x + x * CellWidth;
  this.screen_y = LeftTopPoint_y + y * CellHeight;

	if(typeof ContainerPoint._initialized == "undefined") {
		ContainerPoint.generateRandomPoint = function (x_limit, y_limit) {
			var x = Math.round(x_limit * Math.random());
			var y = Math.round(y_limit * Math.random());
			var ramdomPoint = new ContainerPoint(x, y);
			return ramdomPoint;
		}
	}

	if(typeof ContainerPoint._initialized == "undefined") {
		ContainerPoint.prototype.print = function () {
			return "(" + this.x + "," + this.y + " | " + this.screen_x +"," + this.screen_y + ")";
		}
	}

	if(typeof ContainerPoint._initialized == "undefined") {
		ContainerPoint._initialized = true;
	}
}

//Like static method

////End Point class

//Image class
function Image(width, height) {
  this.width = width;
  this.height = height;
  this.position = null;
  this.color = null;
}

Image.prototype.isValidPosition = function (position) {
  var left_top_point = position;
  //Check conflict with boundary
  if (position.x + this.width > MaxContainerPointX || position.y + this.height > MaxContainerPointY) {
    return false;
  }

  //Check conflict with other image
  //Check left top corner
  var left_top_cell = CellArray[position.y * ColumnCount + position.x];
  if (left_top_cell.belong_to != null) {
    return false;
  }

  var right_top_cell = CellArray[position.y * ColumnCount + (position.x + this.width - 1)];
  if (right_top_cell.belong_to != null) {
    return false;
  }

  var right_bottom_cell = CellArray[(position.y + this.height - 1) * ColumnCount + (position.x + this.width - 1)];
  if (right_bottom_cell.belong_to != null) {
    return false;
  }

  var left_bottom_cell = CellArray[(position.y + this.height - 1) * ColumnCount + position.x];
  if (left_bottom_cell.belong_to != null) {
    return false;
  }
	
	return true;
}

Image.prototype.place = function (position, id) {
  for (var row = position.y; row < position.y + this.height; row++) {
    for (var col = position.x; col < position.x + this.width; col++) {
      CellArray[row * ColumnCount + col].belong_to = this;
    }
  }

  var place_holder = $("<div class=\"image\">");
  place_holder.css("left", position.screen_x);
  place_holder.css("top", position.screen_y);
	place_holder.css("width", this.width * CellWidth - 1);
	place_holder.css("height", this.height * CellHeight - 1);
  //$("body").append(place_holder);
	place_holder.appendTo("body");
}
//End Image class

//Cell class
function Cell(position) {
  this.position = position;
  this.belong_to = null;
}
//End Cell class


function run() {
	var image_count_array = [2, 4, 6, 8, 10, 12];
	var coverd = 0;
	for( var i = 0; i < image_count_array.length; i++) {
		for( var j = 0; j < image_count_array[i]; j++) {
			var image = new Image(12 - image_count_array[i] + 2, 12 - image_count_array[i] + 2);
			var random_point = ContainerPoint.generateRandomPoint(MaxContainerPointX, MaxContainerPointY);
			
			//$("#test").append("<br/><span>" + random_point.print() + "Try 1 time.</span>");
			var try_count = 0;
			while (!image.isValidPosition(random_point) && try_count < 50) {
				try_count++;
				//$("#test").append("<br/><span>Failed, try again!</span>");
				random_point = ContainerPoint.generateRandomPoint(MaxContainerPointX, MaxContainerPointY);
				//$("#test").append("<br/><span>" + random_point.print() + "Try " + try_count + " times.</span>");
			}
			
			if(image.isValidPosition(random_point)) {
				image.place(random_point);
				coverd += image.width * image.height;
			}
			//$("#test").append("<br/>------------------------------Finish image "+ i +","+ j +"-----------------------------------");
		}
	}
	$("#info").append((coverd / 900) * 100 + "%");
	//$("#cover_rate").append("("+ LeftTopPoint_x +", "+ LeftTopPoint_y +")" + (coverd / 900) * 100 + "%");
}

function positionTestCell() {
  $("#first").css("left", CellArray[0].position.screen_x);
  $("#first").css("top", CellArray[0].position.screen_y);
}

// When document ready to run
$(document).ready(function () {
	var container = new Container(RowCount, ColumnCount);
	container.getLeftTopPosition();
	$("#info").append(container.left_top_point.print());
	container.getCenterPoint();
	$("#info").append(container.center_point.print());
	/*container.getLeftTopPosition();
  container.initializeCells();
  run();
  positionTestCell();

	$(window).resize(function() {
		container.getLeftTopPosition();
		container.clearupCells();
		run();
		positionTestCell();
	});*/
});
