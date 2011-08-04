var ContainerWidth = 1260;
var ContainerHeight = 600;
var ContainerMarginTop = 50;
var ContainerMarginLeft = 10;
var CellWidth = 20;
var CellHeight = 20;
var RowCount = 30;
var ColumnCount = 63;
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
	this.cell_array = new Array();

	if(typeof Container._initialized == "undefined") {
		Container.prototype.initializeCells = function() {
			for (var row = 0; row < this.height; row++) {
				for (var col = 0; col < this.width; col++) {
					$("#container").append("<div class=\"cell\"></div>");
					var cell_position = new ContainerPoint(col, row);
					CellArray[row * ColumnCount + col] = new Cell(cell_position);
					this.cell_array[row * this.width + col] = new Cell(cell_position);
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
			var x = Math.ceil(this.width / 2);
			var y = Math.ceil(this.height / 2);
			this.center_point = new ContainerPoint(x, y);
		}
	}

	if(typeof Container._initialized == "undefined") {
		Container.prototype.fillFromCenter = function(image) {
			var iterate_count = Math.max(this.center_point.x, this.center_point.y);

			for(var count = 0; count <= iterate_count; count++) {
				var iterate_count_for_edge = 2 * count + 1;

				//check the top edge
				var left_top_point_x = this.center_point.x - count;
				var left_top_point_y = this.center_point.y - count;
				for( var x = left_top_point_x; x < left_top_point_x + iterate_count_for_edge; x++) {
					var point_on_top_edge = new ContainerPoint(x, left_top_point_y);

          if(this.isValidPoint(image, point_on_top_edge)) {
            this.putImage(image, point_on_top_edge);
            return true;
          }
        }

				//check the right edge
        var right_top_point_x = this.center_point.x + count;
        var right_top_point_y = this.center_point.y - count;
        
        for(var y = right_top_point_y; y < right_top_point_y + iterate_count_for_edge; y++) {
          var point_on_right_edge = new ContainerPoint(right_top_point_x, y);
				
          if(this.isValidPoint(image, point_on_right_edge)) {
					  this.putImage(image, point_on_right_edge);
					  return true;
          }
				}

				//check the bottom edge
        var right_bottom_point_x = this.center_point.x + count;
        var right_bottom_point_y = this.center_point.y + count;

        for(var x = right_bottom_point_x; x > right_bottom_point_x - iterate_count_for_edge; x--) {
          var point_on_bottom_edge = new ContainerPoint(x, right_bottom_point_y);
				
          if(this.isValidPoint(image, point_on_bottom_edge)) {
            this.putImage(image, point_on_bottom_edge);
            return true;;
				  }
        }

        //check the left edge
        var left_bottom_point_x = this.center_point.x - count;
        var left_bottom_point_y = this.center_point.y + count;

        for(var y = left_bottom_point_y; y > left_bottom_point_y - iterate_count_for_edge; y--) {
          var point_on_left_edge = new ContainerPoint(left_bottom_point_x, y);
				
          if(this.isValidPoint(image, point_on_left_edge)) {
					  this.putImage(image, point_on_left_edge);
					  return true;
          }
				}
			}

      return false;
		}
	}
	
	if(typeof Container._initialized == "undefined") {
		Container.prototype.isValidPoint = function(image, point) {
      if(point.x < 0 || point.y < 0) {
        return false;
      }

			//check out of bound
			if(point.x + image.width > this.width || point.y + image.height > this.height) {
				return false;
			}

			//check conflict with other image
      for(var row = point.y; row < point.y + image.height; row++) {
				for( var col = point.x; col < point.x + image.width; col++) {
					var cell = this.cell_array[row * this.width + col];
					if(cell.belong_to != null){
						return false;
					}
				}
			}

			return true;
		}
	}

	if(typeof Container._initialized == "undefined") {
		Container.prototype.putImage = function(image, point) {
			for(var row = point.y; row < point.y + image.height; row++) {
				for(var col = point.x; col < point.x + image.width; col++) {
					this.cell_array[row * this.width + col].belong_to = image;
				}
			}

			image.display(point.screen_x, point.screen_y);
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
////End Point class

////Word class
function Word() {
	this.max_height = 7;
	this.min_height = 1;
	this.width = 0;
	this.height = Math.max(this.min_height, Math.round(Math.random() * this.max_height));
	this.screen_height = this.height * CellHeight;
	this.place_holder = $("<div class=\"word\">");
	this.place_holder.hide();
	this.place_holder.height(this.screen_height);
	this.place_holder.css("position", "absolute");

	this.words_array=["America", "Britain", "China", "Danmark", "France", "Germany"];
	this.color_array=["red", "yellow", "blue", "black", "silver", "gray"];
	this.word = this.words_array[Math.round(Math.random() * (this.words_array.length - 1))];
	this.color = this.color_array[Math.round(Math.random() * (this.color_array.length - 1))];
	this.place_holder.css("font-size", this.screen_height);
	this.place_holder.append(this.word);
	this.place_holder.css("color", this.color);
	this.place_holder.appendTo("body");
	this.width = Math.ceil(this.place_holder.width() /CellWidth);
	this.screen_width = this.width * CellWidth;
	this.place_holder.width(this.screen_width);

	if(typeof Word._initialized == "undefined") {
		Word.prototype.getWidth = function() {
			this.place_holder.appendTo("body");
			this.width = Math.ceil(this.place_holder.width() / CellWidth) * CellWidth;
		}
	}

	if(typeof Word._initialized == "undefined") {
		Word.prototype.display = function(screen_x, screen_y) {
			this.place_holder.css("left", screen_x);
			this.place_holder.css("top", screen_y);
			this.place_holder.show();
		}
	}

	if(typeof Word._initialized == "undefined") {
		Word._initialized = true;
	}
}

////end Word class

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
  var start_date = new Date();
	var start_time = start_date.getTime();
  var covered = 0;
  var container = new Container(ColumnCount, RowCount);
	container.getLeftTopPosition();
  //$("#info").append(container.left_top_point.print());
	container.getCenterPoint();
	//$("#info").append(container.center_point.print());
	container.initializeCells();
  var container_area = container.width * container.height;
	var cover_rate = covered / container_area;
	
	var fill_date = new Date();
	var fill_time = fill_date.getTime();
	for(var count = 0; count < 200; count++) {
  //while(cover_rate < 0.9) {
		var word = new Word();
		//word.display(0, 100);
		//$("#info").append("width: " + word.width + ", height: " + word.height);
	  var fill = container.fillFromCenter(word);
    if(fill) {
      covered += word.width * word.height;
      cover_rate = covered / container_area;
    }
	}
  
  var end_date = new Date();
  var end_time = end_date.getTime();
  var info = $("#info");
  info.append("Cost tims[ms]: " + (end_time - start_time));
	info.append(" Fill cost time[ms]: " + (end_time - fill_time));
  info.append("<br/>Cover rate: " + cover_rate * 100 + "%");

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
