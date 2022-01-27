class pathNode {
    constructor(x, y, cols, rows) {
        this.x = x;
        this.y = y;
        this.cols = cols;
        this.rows = rows;

        this.root = undefined;
        this.neighbors = [];
        this.obstacle = Math.random() <= 0.4;

        this.f = Infinity;
        this.g = Infinity;
        this.h = Infinity;
    }

    getNeighbors(grid) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                //This if statment controls wether or not we want the thing to go diagonal, diag>> tho so don't uncomment
                // if (Math.abs(i) == Math.abs(j)) continue;
                const nx = i + this.x;
                const ny = j + this.y;
                if (nx < 0 || nx > this.cols - 1 ||
                    ny < 0 || ny > this.rows - 1) continue;
                this.neighbors.push(grid[nx][ny]);
            }
        }

        const thereAreNeighbors = this.neighbors.some(n => !n.obstacle);
        if (!thereAreNeighbors) {
            const randomNeighbor = this.neighbors[Math.floor(Math.random() * this.neighbors.length)];
            randomNeighbor.obstacle = false;
        }
    }

    getDist(pos) {
        return Math.abs(this.x - pos.x) + Math.abs(this.y - pos.y);
    }
}