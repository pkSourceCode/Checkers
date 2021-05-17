class Player
{
    constructor(name, team, score, total)
    {
        this.name = name;
        this.team = team;
        this.score = score;
        this.total = total

        this.selectedDraggable = -1;

        this.hoveringCell = -1;
        this.selectedCell = -1;

        // Draggable control rules. //
        this.rule = -1;

        // Gameplay Mode. //
        // 0 = 1 Player against simple AI.
        // 1 = 2 Offline players.
        // 2 = 2 Online players.
        this.gameMode = 1;

        // Web Socket URL. //
        // Only used with game play mode 2. //
        this.socketUrl = "ws://....";
    }

    setRule(rule)
    {
        this.rule = rule;
    }

    setGameMode(mode)
    {
        this.gameMode = mode;
    }

    getSelectedDraggable()
    {
        return this.selectedDraggable;
    }

    draggableClicked(draggable)
    {
        // Select draggable //
        if(draggable !== -1 && draggable !== -2) {
            let name = draggable.index.name.split("_");
            let team = name[0].split("T")[1];
            if (team === this.team) {
                this.selectedDraggable = draggable;
                console.log(this.selectedDraggable.index.name);
                this.rule.checkDraggable(this.selectedDraggable);
            } else
                console.log("Cannot select this entity.");
        }
        // Cancel the selected draggable //
        else if(draggable === -1) {
            this.rule.highlightCell();
            this.selectedDraggable = draggable;
            console.log(this.selectedDraggable);
        }
        // Moving to cell after draggable has been selected //
        else if(draggable === -2)
            if(this.gameMode === 0)
                this.makeMoveWithSimpleAI();
            else if(this.gameMode === 1)
                 this.makeMoveSwitchTeam();
            else if(this.gameMode === 2)
                this.makeMoveWithSocketRequest();


        //console.log(this.selectedDraggable);
    }

    cellClicked(cell)
    {
        this.selectedCell = cell;
    }

    cellHovering(cell)
    {
        this.hoveringCell = cell;
        let i = this.hoveringCell.getCellPos().x;
        let j = this.hoveringCell.getCellPos().y;
        //console.log("Cell: "+ i + ", " + j);
    }


    printPlayerStatusLogs()
    {
        console.log("Player: " + this.name);
        console.log("Team:   " + this.team);
        console.log("Score:  " + this.score);
        console.log("Total:  " + this.total);
    }

    makeMove()
    {
        let draggable = this.selectedDraggable;
        let cell = this.hoveringCell;
        let index = draggable.index.name.split("_")[1];
        let pos = cell.cellPos;
        let j = pos.x;
        let i = pos.y;

        // Check If Player Clicked On The Correct Cells //
        let flag = this.rule.checkMove(this.selectedDraggable, i, j);

        if(flag)
        {
            // Move Draggable And Un-highlight The Movable Cells //
            if (this.selectedDraggable !== -1) {
                this.rule.resetColor();
                //console.log("Move To: X:" + i + " Y:" + j);
                board.moveDraggable(parseInt(index), i, j);
                //console.log(draggable.getCoordinate());
                this.selectedDraggable = -1;
            }
        }
        else
            console.log("Cannot move to that cell location.");
    }

    makeMoveSwitchTeam()
    {
        let draggable = this.selectedDraggable;
        let cell = this.hoveringCell;
        let index = draggable.index.name.split("_")[1];
        let pos = cell.cellPos;
        let j = pos.x;
        let i = pos.y;

        // Check If Player Clicked On The Correct Cells //
        let flag = this.rule.checkMove(this.selectedDraggable, i, j);
       this.moveAndSwitchTeam(flag, index, i, j);
    }

    makeMoveWithSimpleAI()
    {
        if(this.team === "0")
        {
            console.log("CPU Turn.");
            let target = this.rule.stupidRandomMove();
            if(target.flag)
            {
                let draggable = target.draggable;
                let index = draggable.index.name.split("_")[1];
                let i = target.x;
                let j = target.y;
                console.log(index + "Move At" + i + ", " + j);
                this.rule.resetColor();
                board.moveDraggable(parseInt(index), i, j);
                this.selectedDraggable = -1;
                if (this.team === "0")
                    this.team = "1";
                else if (this.team === "1")
                    this.team = "0";
            }
        }
        else if(this.team === "1") {
            this.makeMoveSwitchTeam();
            let func = () => this.makeMoveWithSimpleAI();
            setTimeout(func, 500);
        }
    }

    makeMoveWithSocketRequest()
    {

    }

    moveAndSwitchTeam(flag, index, i, j)
    {
        if(flag)
        {
            if (this.selectedDraggable !== -1)
            {
                this.rule.resetColor();
                //console.log("Move To: X:" + i + " Y:" + j);
                board.moveDraggable(parseInt(index), i, j);
                //console.log(draggable.getCoordinate());
                this.selectedDraggable = -1;
                if (this.team === "0")
                    this.team = "1";
                else if (this.team === "1")
                    this.team = "0";
            }
        }
    }
}