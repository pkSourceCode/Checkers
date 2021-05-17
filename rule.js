class Rule
{
    constructor()
    {
        this.board      = document.getElementById("board");
        this.ctx        = document.getElementById("board").getContext("2d");
        this.cells      = board.getCells();
        this.highlightedCell = [];
        this.highlightedStyle = {
            color: "jade",
            strokeStyle: "5px"
        };
    }

    drawHighlightedCells()
    {
        for(let i = 0; i <= this.highlightedCell.length - 1; i++)
            this.highlightedCell[i].draw();
    }

    findDraggableAtPosition(x, y)
    {
        let set = board.getDraggableSet();
        for(let i = 0; i <= set.length - 1; i++)
        {
            if(set[i] !== null) {
                let target = set[i].getCoordinate();
                if (target.x === x && target.y === y)
                    return set[i];
            }
        }
        return null;
    }

    destroy()
    {
        this.highlightedCell = [];
        this.cells           = [];
    }
}

class CheckerRule extends Rule
{
    constructor() {
        super();
        this.moveableCells = [];
    }

    checkDraggable(draggable)
    {
        // Initiate all possible locations //
        let d = draggable;
        this.prepareMovableCell(d);
        let currentPos = d.getCoordinate();
    }

    checkMove(draggable, i, j)
    {
        // Check if draggable is at the enemy king position //
        let name         = draggable.index.name.split("_");
        let team         = parseInt(name[0].split("T")[1]);
        let maxCols      = board.getMaxCols();
        let my           = maxCols.y - 1;
        if(team === 0)
            if(j === my)
                this.upgradeToKing(draggable);
        if(team === 1)
            if(j === 0)
                this.upgradeToKing(draggable);

        let mvc = this.moveableCells;
        let ret = false;
        for(let l = 0; l <= mvc.length - 1; l++) {
            if (i === mvc[l].x && j === mvc[l].y) {
                let moveType = mvc[l].moveType;
                if (moveType === "stdMov")
                    ret = true;
                else if (moveType === "stdEat") {
                    let cordX = mvc[l].eatTargetX;
                    let cordY = mvc[l].eatTargetY;
                    let target = board.getDraggableAtCoordinate(cordX, cordY);
                    let targetIndex = target.index.name.split("_")[1];
                    board.removeDraggable(parseInt(targetIndex));
                    if(team === 1)
                        player1.score++;
                    if(team === 0)
                        player2.score++;
                    updatePlayerEatScores(player1.score, player2.score);
                    ret = true;
                }
                else
                    console.log("Invalid Move Type.");
            }
        }
        this.checkWinCondition();
        return ret;
    }

    stupidRandomMove()
    {
        let set = board.getDraggableSet();
        let t0set = [];
        for(let i = 0; i <= set.length - 1; i++)
        {
            if(set[i] !== null) {
                let name = set[i].index.name.split("_");
                let team = parseInt(name[0].split("T")[1]);
                if (team === 0)
                    t0set.push(set[i]);
            }
        }
        let t0setWithMovableCell = [];
        for(let i = 0; i <= t0set.length - 1; i++)
        {
            let draggable = t0set[i];
            this.prepareMovableCell(draggable);
            if(this.moveableCells.length !== 0) {
                t0set[i].moveableCells = this.moveableCells;
                t0setWithMovableCell.push(t0set[i]);
            }
        }

        // Random t0setWithMovableCell index //
        let index = Math.floor(Math.random() * t0setWithMovableCell.length);
        let d = t0setWithMovableCell[index];

        // Random t0setWithMovableCell movable positions //
        let move_index = Math.floor(Math.random() * d.moveableCells.length);
        let selectedCell = d.moveableCells[move_index];
        this.moveableCells = d.moveableCells;
        // TODO: FIX THIS!!!!!!!!!!!!! //
        return {flag: this.checkMove(d, selectedCell.x, selectedCell.y), draggable: d, x: selectedCell.x, y: selectedCell.y};
        // Try Move //
        //board.moveDraggable(parseInt(d.index.name.split("_")[1]), this.moveableCells.x, this.moveableCells.y);
    }

    prepareMovableCell(draggable)
    {
        //console.log(this.cells);
        this.moveableCells = [];
        //let c          = this.ctx;
        //let hls        = this.highlightedStyle;
        let name       = draggable.index.name.split("_");
        let team       = parseInt(name[0].split("T")[1]);
        let type       = draggable.getType();

        this.checkStandardMove(draggable, team, type);
        this.checkObstacles(draggable, team, type);
        this.highlightCell();
    }

    getCellCheckPositions(draggable)
    {
        // Coordinate of Possible Locations //
        let currentPos = draggable.getCoordinate();
        let x = currentPos.x;
        let y = currentPos.y;
        let ul = {x: x - 1, y: y - 1};
        let ur = {x: x + 1, y: y - 1};
        let dl = {x: x - 1, y: y + 1};
        let dr = {x: x + 1, y: y + 1};
        return {ul:ul, ur:ur, dl:dl, dr:dr};
    }

    checkValidBoundary(pos)
    {
        // Check if ul, ur, dl, and dr  have valid values //
        let maxCols = board.getMaxCols();
        return (pos.x >= 0 && pos.x <= maxCols.x - 1 && pos.y >= 0 && pos.y <= maxCols.y - 1);
    }

    checkStandardMove(draggable, team, type)
    {
        let cellChecks = this.getCellCheckPositions(draggable);
        // Men //
        if(type === 0)
        {
            if(team === 0)
            {
                let p0 = cellChecks.dl;
                p0.moveType = "stdMov";
                let p1 = cellChecks.dr;
                p1.moveType = "stdMov";

                if(this.checkValidBoundary(p0))
                    this.moveableCells.push(p0);
                if(this.checkValidBoundary(p1))
                    this.moveableCells.push(p1);
            }
            else if(team === 1)
            {
                let p0 = cellChecks.ul;
                p0.moveType = "stdMov";
                let p1 = cellChecks.ur;
                p1.moveType = "stdMov";

                if(this.checkValidBoundary(p0))
                    this.moveableCells.push(p0);
                if(this.checkValidBoundary(p1))
                    this.moveableCells.push(p1);
            }
        }
        // King //
        else if(type === 1)
        {
            let p0 = cellChecks.ul;
            p0.moveType = "stdMov";
            let p1 = cellChecks.ur;
            p1.moveType = "stdMov";
            let p2 = cellChecks.dl;
            p2.moveType = "stdMov";
            let p3 = cellChecks.dr;
            p3.moveType = "stdMov";

            if(this.checkValidBoundary(p0))
                this.moveableCells.push(p0);
            if(this.checkValidBoundary(p1))
                this.moveableCells.push(p1);
            if(this.checkValidBoundary(p2))
                this.moveableCells.push(p2);
            if(this.checkValidBoundary(p3))
                this.moveableCells.push(p3);
        }
    }

    checkObstacles(draggable, team, type)
    {
        // 2 Types of obstacle //
        //   - #1 Friendly Units //
        //          Cannot jump over (can not eat)
        //   - #2 Enemy Units //
        //          Can Jump over (can eat)
        //        -  This can be divided in 2 types depends on game modes
        //              - #2.1 No Force Eat
        //              - #2.2 Force Eat
        let mvc = this.moveableCells;

        // Check If Unit Is Facing With Obstacles //
        let newMvc = [];
        for(let i = 0; i <= mvc.length - 1; i++)
        {
            let blockCell = this.findDraggableAtPosition(mvc[i].x, mvc[i].y);
            // No Obstacles //
            if(blockCell === null)
                newMvc.push(mvc[i]);
            // Facing Obstacles //
            else {
                let t = blockCell.getTeam();
                // Facing Enemy Unit //
                if(team !== t)
                {
                    let c = this.eatChecker(draggable, blockCell, team, type);
                    if(c !== null)
                        newMvc.push(c);
                }
            }
        }
        this.moveableCells = newMvc;
    }

    eatChecker(draggable, enemy, team, type)
    {
        let ec = enemy.getCoordinate();
        let dc = draggable.getCoordinate();

        let dl = {x: dc.x + 1, y: dc.y + 1};
        let dr = {x: dc.x - 1, y: dc.y + 1};
        let ul = {x: dc.x - 1, y: dc.y - 1};
        let ur = {x: dc.x + 1, y: dc.y - 1};

        // Men //
        if(type === 0)
        {
            if(team === 0)
            {
                if(ec.x === dl.x && ec.y === dl.y) {
                    let blockCell = this.findDraggableAtPosition(ec.x + 1,ec.y + 1);
                    if(blockCell === null)
                        return {x: ec.x + 1, y: ec.y + 1, moveType: "stdEat", eatTargetX: ec.x, eatTargetY: ec.y};
                    else return null;
                }
                else if(ec.x === dr.x && ec.y === dr.y) {
                    let blockCell = this.findDraggableAtPosition(ec.x - 1,ec.y + 1);
                    if(blockCell === null)
                        return {x: ec.x - 1, y: ec.y + 1, moveType: "stdEat", eatTargetX: ec.x, eatTargetY: ec.y};
                    else return null;
                }
            }
            else if(team === 1)
            {
                if(ec.x === ul.x && ec.y === ul.y) {
                    let blockCell = this.findDraggableAtPosition(ec.x - 1, ec.y - 1);
                    if(blockCell === null)
                        return {x: ec.x - 1, y: ec.y - 1, moveType: "stdEat", eatTargetX: ec.x, eatTargetY: ec.y};
                    else return null;
                }
                else if(ec.x === ur.x && ec.y === ur.y) {
                    let blockCell = this.findDraggableAtPosition(ec.x + 1, ec.y - 1);
                    if(blockCell === null)
                        return {x: ec.x + 1, y: ec.y - 1, moveType: "stdEat", eatTargetX: ec.x, eatTargetY: ec.y};
                    else return null;
                }
            }
        }
        // King //
        else if(type === 1)
        {
            if(ec.x === dl.x && ec.y === dl.y)
            {
                let blockCell = this.findDraggableAtPosition(ec.x + 1,ec.y + 1);
                if(blockCell === null)
                    return {x: ec.x + 1, y: ec.y + 1, moveType: "stdEat", eatTargetX: ec.x, eatTargetY: ec.y};
                else return null;
            }
            else if(ec.x === dr.x && ec.y === dr.y)
            {
                let blockCell = this.findDraggableAtPosition(ec.x - 1,ec.y + 1);
                if(blockCell === null)
                    return {x: ec.x - 1, y: ec.y + 1, moveType: "stdEat", eatTargetX: ec.x, eatTargetY: ec.y};
                else return null;
            }
            else if(ec.x === ul.x && ec.y === ul.y)
            {
                let blockCell = this.findDraggableAtPosition(ec.x - 1, ec.y - 1);
                if(blockCell === null)
                    return {x: ec.x - 1, y: ec.y - 1, moveType: "stdEat", eatTargetX: ec.x, eatTargetY: ec.y};
                else return null;
            }
            else if(ec.x === ur.x && ec.y === ur.y)
            {
                let blockCell = this.findDraggableAtPosition(ec.x + 1, ec.y - 1);
                if(blockCell === null)
                    return {x: ec.x + 1, y: ec.y - 1, moveType: "stdEat", eatTargetX: ec.x, eatTargetY: ec.y};
                else return null;
            }
        }
    }

    upgradeToKing(draggable)
    {
        let currentType = draggable.getType();
        if(currentType === 0)
            draggable.setType(1);
    }

    checkWinCondition()
    {
        let set = board.getDraggableSet();
        let t0  = [];
        let t1  = [];
        for(let i = 0; i <= set.length - 1; i++)
        {
            let draggable = set[i];
            if(draggable !== null) {
                let name = draggable.index.name.split("_");
                let team = parseInt(name[0].split("T")[1]);
                // Find team 0 checkers. //
                if (team === 0)
                    t0.push(draggable);
                // Find team 1 checkers. //
                if (team === 1)
                    t1.push(draggable);
            }
        }
        if(t0.length === 0) {
            console.log("Team 1 has won the match!");
            page_animation.bringUpSeparator();
            let bid = page_animation.insertAlertBox("GAME OVER", player1.name + " has won the match!!!");
            page_animation.showAlertBox(bid);
            player1.total++;
        }
        if(t1.length === 0) {
            console.log("Team 0 has won the match!");
            page_animation.bringUpSeparator();
            let bid = page_animation.insertAlertBox("GAME OVER", player2.name + " has won the match!!!");
            page_animation.showAlertBox(bid);
            player2.total++;
        }
        updatePlayerTotalWinScore(player1.total, player2.total);

    }

    highlightCell()
    {
        this.resetColor();
        let sd = player.getSelectedDraggable();
        let maxCols = board.getMaxCols();
        let mx      = maxCols.x - 1;
        let my      = maxCols.y - 1;
        for (let i = 0; i <= this.moveableCells.length - 1; i++)
        {
            if(this.moveableCells[i] !== null)
            {
                let x = this.moveableCells[i].x;
                let y = this.moveableCells[i].y;
                let c = board.getIndexArrayHorizontal(y, x);
                if ((x >= 0 && y >= 0) && (x <= mx && y <= my) && sd !== -1)
                    this.cells[c].changeToHoverColor();
            }
        }
    }

    resetColor()
    {
        for (let i = 0; i <= this.cells.length - 1; i++)
            this.cells[i].resetColor();
    }

    prepareHighlightedCells()
    {
        for(let i = 0; i <= this.moveableCells.length - 1; i++)
            this.highlightedCell.push(this.moveableCells[i]);
    }
}

