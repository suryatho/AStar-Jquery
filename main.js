$(setup);
const board = $("#board");
const cols = 30;
const rows = 30;

let grid = [],
	openSet = [],
	closedSet = [],
	path = [];

let current, start, end;

function setup() {
	//Making the grid full of nodes and getting their neighbors
	grid = makeGrid(cols, rows);
	grid.forEach(col => {
		col.forEach(cell => cell.getNeighbors(grid));
	});
	//Setting the start and end
	start = grid[0][0];
	end = grid[cols - 1][rows - 1];
	start.g = 0;
	start.obstacle = false;
	end.obstacle = false;
	start.neighbors.forEach(n => n.obstacle = false);
	end.neighbors.forEach(n => n.obstacle = false);
	//pushing start to the open set to start the pathfinding
	openSet.push(start);
	//Making the grid in the DOM
	makeBoard(grid);
	//drawing all the sets
	drawSets();
	//Making the update loop
	requestAnimationFrame(update);
}

function update() {
	if (openSet.length > 0) {
		//Do something A*
		$("h1").text("A* Searching...");
		//Getting the node with the lowest f in openset
		current = openSet.reduce((lowest, cell) => {
			if (cell.f <= lowest.f) return cell;
			return lowest;
		});
		//Remove from open set and add to closed set
		openSet = openSet.filter(cell => cell != current);
		closedSet.push(current);

		//Getting currents neighbors and looping over them
		let neighbors = current.neighbors;
		for (let neighbor of neighbors) {
			//making sure that they are not and obstacle or in the closed set
			if (closedSet.includes(neighbor) || neighbor.obstacle) continue;

			//getting the tentativeG value to compare it against the current g so we can set it to that if it is better
			let tentativeG = current.g + neighbor.getDist(current);
			if (tentativeG <= neighbor.g) neighbor.g = tentativeG;
			//push neighbor to open set if it is not already there
			if (!openSet.includes(neighbor)) openSet.push(neighbor);

			//Calculating the f value for the neighbor
			neighbor.h = neighbor.getDist(end);
			neighbor.f = neighbor.g + neighbor.h;

			//Getting the root node for the neighbor based on its neighbors g values
			let nNeighbors = neighbor.neighbors;
			//Make sure they're in closed set
			nNeighbors = nNeighbors.filter(cell => closedSet.includes(cell));
			neighbor.root = nNeighbors.reduce((lowest, cell) => {
				if (cell.g <= lowest.g) return cell;
				return lowest;
			});
		}
	} else {
		//No Solution
		$("h1").text("A* No Solution Found!");
	}

	//Making the path by backtracking
	path = [];
	let pathTracker = current;
	path.push(pathTracker);
	while (pathTracker.root) {
		pathTracker = pathTracker.root;
		path.push(pathTracker);
	}

	drawSets();
	//End condition
	if (current == end) {
		$("h1").text("A* Done!");
		return;
	}
	requestAnimationFrame(update);
}

function makeGrid(cols, rows) {
	let arr = Array(cols)
		.fill()
		.map(() => Array(rows).fill());
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			arr[i][j] = new pathNode(i, j, cols, rows);
		}
	}
	return arr;
}

function makeBoard(grid) {
	for (let i = 0; i < grid.length; i++) {
		const col = $("<div>").addClass("col");
		for (let j = 0; j < grid[i].length; j++) {
			const cell = $("<div>").addClass("cell");
			cell.attr("data-key", `${i}, ${j}`);
			cell.attr("data-open", false);
			cell.attr("data-closed", false);
			cell.attr("data-path", false);
			cell.attr("data-obstacle", grid[i][j].obstacle);
			col.append(cell);
		}
		board.append(col);
	}
}

function drawSets() {
	//Getting the cells using their keys and setting their data attributes accordingly to draw the sets
	grid.forEach(col => {
		col.forEach(el => {
			const cell = $(`.cell[data-key='${el.x}, ${el.y}']`);
			cell.attr("data-path", false);
		});
	});

	openSet.forEach(el => {
		const cell = $(`.cell[data-key='${el.x}, ${el.y}']`);
		cell.attr("data-open", true);
		cell.attr("data-closed", false);
	});

	closedSet.forEach(el => {
		const cell = $(`.cell[data-key='${el.x}, ${el.y}']`);
		cell.attr("data-open", false);
		cell.attr("data-closed", true);
	});

	path.forEach(el => {
		const cell = $(`.cell[data-key='${el.x}, ${el.y}']`);
		cell.attr("data-path", true);
	});
}
