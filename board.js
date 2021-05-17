// TODO: LAYERS in Cell. Positions coordinate in class Checker.
class Board
{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.ctx    = canvas.getContext("2d");
        this.width  = canvas.width;
        this.height = canvas.height;

        this.linesX = [];
        this.lineXStyle = {
            color: "black",
            width: "5px",
            dash: [0, 0]
        };
        this.linesY = [];
        this.lineYStyle = {
            color: "black",
            width: "5px",
            dash: [0, 0]
        };

        this.cells      = [];
        this.cellStyle  = {
            color1: "lightblue",
            color2: "lightgrey",
            hoverColor: 'rgba(145,220,170,0.18)',
            width: 0,
            strokeStyle: "black"
        };

        this.draggables  = [];

        this.cellWidth  = 0;
        this.cellHeight = 0;

        this.xCols      = 0;
        this.yCols      = 0;

        this.mousePosX  = 0;
        this.mousePosY  = 0;

        // User Cell Event Variables //
        this.mouseCell           = {x:-1, y:-1};
        this.mouseCellIndex      = -1;
        this.mouseCellLeave      = {x:-1, y:-1};
        this.mouseCellIndexLeave = -1;
        this.mouseDown           = {x:-1, y:-1};
        this.mouseDownIndex      = -1;
        // User Draggable Variables //
        this.selectedIndex       = -1;

        // Checker Styles //
        this.checkerSet1Style = {
            color1: 'crimson',
            color2: player2.checkerColor,
            hoverColor: 'cadetblue',
            selectedColor: 'cornflowerblue',
            radius: 30,
            strokeStyle: ""
        };

        this.checkerSet2Style = {
            color1: 'yellow',
            color2: player1.checkerColor,
            hoverColor: 'darkseagreen',
            selectedColor: 'darkseagreen',
            radius: 30,
            strokeStyle: ""
        };

        // Player Class Variables //
        this.player1 = -1;

        // Board Rule Variables //
        this.rule   = -1;
    }

    getContext()
    {
        return this.ctx;
    }

    setColumns(xCols, yCols)
    {
        this.xCols = xCols;
        // Calculate cellWidth //
        this.cellWidth = this.width / this.xCols;
        // Create line objects //
        let lxs = this.lineXStyle;
        this.linesX = [];
        let i = 0;
        while(i <= xCols)
        {
            let line = new Line(this.ctx, 0, 0, 0, 0, lxs.color, lxs.width, lxs.dash);
            this.linesX.push(line);
            i++;
        }
        this.yCols = yCols;
        // Calculate cellHeight //
        this.cellHeight = this.height / this.yCols;
        // Create line objects //
        let lys = this.lineXStyle;
        this.linesY = [];
        i = 0;
        while(i <= yCols)
        {
            let line = new Line(this.ctx, 0, 0, 0, 0, lys.color, lys.width, lys.dash);
            this.linesY.push(line);
            i++;
        }
        //console.log(this.linesX);
        //console.log(this.linesY);

        // Create cell objects //
        i = 0;
        let cs = this.cellStyle;
        while(i < xCols * yCols)
        {
            let cell = new Cell(this.ctx, 0, 0, 0, 0, cs.color1, cs.hoverColor, cs.width, cs.strokeStyle);
            cell.cellPos = this.getCellCoordinateHorizontal(i);
            this.cells.push(cell);
            i++
        }
        //console.log(this.cells);
    }

    getMaxCols()
    {
        return {x: this.xCols, y: this.yCols};
    }

    setMousePos(posX, posY)
    {
        this.mousePosX = posX;
        this.mousePosY = posY;
    }

    setPlayer1(player)
    {
        this.player1 = player;
    }

    getCells()
    {
        return this.cells;
    }

    getDraggableSet()
    {
        return this.draggables;
    }

    getDraggableAtCoordinate(i, j)
    {
        for(let a = 0; a <= this.draggables.length - 1; a++)
        {
            if(this.draggables[a] !== null) {
                let target = this.draggables[a];
                let targetCord = target.getCoordinate();
                if (targetCord.x === i && targetCord.y === j)
                    return target;
            }
        }
    }

    updateMouseCell(x, y)
    {
        let mcx = this.mouseCell.x;
        let mcy = this.mouseCell.y;
        if(x === mcx && y === mcy)
            return false;
        else {
            this.mouseCellLeave.x = mcx;
            this.mouseCellLeave.y = mcy;
            //console.log("Mouse Leaved: " + this.mouseCellLeave.x + ", " + this.mouseCellLeave.y);
            this.mouseCell.x = x;
            this.mouseCell.y = y;
            //console.log("Mouse Entered: " + this.mouseCell.x + ", " + this.mouseCell.y);
            return true;
        }
    }

    updateMouseCellIndex(i)
    {
        let mci = this.mouseCellIndex;
        if(i === mci)
            return false;
        else
        {
            this.mouseCellIndexLeave = mci;
            //console.log("Mouse Leaved: " + this.mouseCellIndexLeave);
            this.mouseCellIndex = i;
            //console.log("Mouse Entered: " + this.mouseCellIndex);
            return true;
        }
    }

    init()
    {
        this.prepareResources();
        this.render();
    }

    prepareResources()
    {
        // Prepare horizontal grid lines. //
        for(let i = 0; i <= this.linesX.length - 1; i++)
        {
            let line = this.linesX[i];
            let fromX = i * this.cellWidth;
            let fromY = 0;
            let toX   = i * this.cellWidth;
            let toY   = this.height;
            line.setCordPos(fromX, fromY, toX, toY);
        }

        // Prepare vertical grid lines. //
        for(let i = 0; i <= this.linesY.length - 1; i++)
        {
            let line = this.linesY[i];
            let fromX = 0;
            let fromY = i * this.cellHeight;
            let toX = this.width;
            let toY = i * this.cellHeight;
            line.setCordPos(fromX, fromY, toX, toY);
        }

        // Prepare table cells. //
        let cellIndex = 0;
        let c1  = this.cellStyle.color1;
        let c2  = this.cellStyle.color2;
        for(let i = 0; i <= this.yCols - 1; i++)
        {
            let color = "";
            if(i % 2 === 0)
                color = c1;
            else
                color = c2;

            for(let j = 0; j <= this.xCols - 1; j++)
            {
                let cell = this.cells[cellIndex];
                let sx   = j  * this.cellWidth;
                let sy   = i  * this.cellHeight;
                let ex   = this.cellWidth  - 1;
                let ey   = this.cellHeight - 1;
                cell.setToCord(sx + this.cellWidth  - 1, sy + this.cellHeight - 1);
                cell.setColor(color);
                cell.setOriginalColor(color);
                cell.setCordPos(sx, sy, ex, ey);
                if(color === c1)
                    color = c2;
                else
                    color = c1;
                cellIndex++;
            }
        }
        this.prepareCheckerDraggable();
    }

    prepareCheckerDraggable()
    {
        let ctx = this.ctx;
        let cs1  = this.checkerSet1Style;
        let cs2  = this.checkerSet2Style;

        // Calculate Radius To Match The Cell Size //
        if(this.cellWidth > this.cellHeight)
        {
            cs1.radius = this.cellWidth  * 0.3;
            cs2.radius = this.cellWidth  * 0.3;
        }
        else if(this.cellWidth < this.cellHeight)
        {
            cs1.radius = this.cellHeight * 0.3;
            cs2.radius = this.cellHeight * 0.3;
        }
        else if(this.cellWidth === this.cellHeight)
        {
            cs1.radius = this.cellHeight * 0.3;
            cs2.radius = this.cellHeight * 0.3;
        }

        // Checker draggable index. //
        // Team 1, Set 1 //
        for(let i = 0; i <= 7; i++)
        {
            let j = 0;
            if(i % 2 !== 0)
                j = 1;
            let coordinate = this.getCentralPixelCoordinate(i, j);
            let checker = new Checker(ctx, coordinate.i, coordinate.j, cs1.radius, 1, 4, 0, 0, {name: "T0_" + this.draggables.length, i: coordinate.i, j: coordinate.j}, cs1.color1, cs1.color2, cs1.hoverColor, cs1.selectedColor, "");
            checker.setCoordinate(i, j);
            this.draggables.push(checker);
        }
        // Team 2, Set 2 //
        for(let i = 0; i <= 7; i++)
        {
            let j = 6;
            if(i % 2 !== 0)
                j = 7;
            let coordinate = this.getCentralPixelCoordinate(i, j);
            let checker = new Checker(ctx, coordinate.i, coordinate.j, cs2.radius, 1, 4, 1, 0, {name: "T1_" + this.draggables.length, i: coordinate.i, j: coordinate.j}, cs2.color1, cs2.color2, cs2.hoverColor, cs2.selectedColor, "");
            checker.setCoordinate(i, j);
            this.draggables.push(checker);
        }

        animation_timer.setDrawables(this.draggables);
        animation_timer.start();
    }

    render()
    {
        this.reset();
        this.drawGridLines();
        this.drawCells();
        this.drawDraggables();
    }

    drawGridLines()
    {
        this.drawGridLinesX();
        this.drawGridLinesY();
    }

    drawGridLinesX()
    {
        for(let i = 0; i <= this.linesX.length - 1; i++)
            this.linesX[i].draw();
    }

    drawGridLinesY()
    {
        for(let i = 0; i <= this.linesY.length - 1; i++)
            this.linesY[i].draw();
    }

    drawCells()
    {
        for(let i = 0; i <= this.cells.length - 1; i++)
            this.cells[i].draw();
    }

    drawDraggables()
    {
        for(let i = 0; i <= this.draggables.length - 1; i++) {
            if(this.draggables[i] !== null)
                this.draggables[i].draw();
        }
    }

    onMouseDown()
    {
        let player    = this.player1;
        let clickFlag = false;
        for(let i = 0; i <= this.draggables.length - 1; i++)
        {
            let d    = this.draggables[i];
            if(d !== null) {
                let flag = d.checkOnMouseDown(this.mousePosX, this.mousePosY);
                if (flag && this.selectedIndex !== i) {
                    clickFlag = true;
                    this.selectedIndex = i;
                } else if (flag && this.selectedIndex === i) {
                    clickFlag = false;
                    this.selectedIndex = -1;
                }
            }
        }

        if(this.selectedIndex === -1)
        {
            for(let i = 0; i <= this.draggables.length - 1; i++)
                this.draggables[i].setSelected(false);
        }

        if(!clickFlag && this.selectedIndex !== -1)
        {
            this.selectedIndex = -1;
            player.draggableClicked(-2);
        }
        else if(this.selectedIndex !== -1)
            player.draggableClicked(this.draggables[this.selectedIndex]);
        else
            player.draggableClicked(-1);

        //console.log(this.selectedIndex);
        this.onMouseMove();
    }

    onMouseUp()
    {
        for(let i = 0; i <= this.draggables.length - 1; i++)
        {
            let d = this.draggables[i];
            if(d !== null) {
                d.checkOnMouseUp();
                let flag = d.getSelected();
                /*if(flag)
                    console.log(i + " Is Mouse Up");*/
            }
        }
    }

    onMouseMove()
    {
        // Update Mouse Coordinates & Highlight Table Cell.
        //printMouseCord(this.mousePosX, this.mousePosY);
        for(let i = 0; i <= this.cells.length - 1; i++)
        {
            let flag = this.cells[i].checkOnHover(this.mousePosX, this.mousePosY);
            if(flag === true)
            {
                let cell = this.cells[i];
                let flag1 = this.updateMouseCell(cell.cellPos.x, cell.cellPos.y);
                let flag2 = this.updateMouseCellIndex(i);
                if(flag2)
                    this.player1.cellHovering(this.cells[i]);
                    //this.changeCellColor();
            }
        }
        // Check Draggable Collision.
        for(let i = 0; i <= this.draggables.length - 1; i++)
        {
            let draggable = this.draggables[i];
            if(draggable !== null) {
                let flag = draggable.checkOnHover(this.mousePosX, this.mousePosY);
                if (!draggable.getSelected()) {
                    if (flag === true) {
                        if (!draggable.getHover())
                            draggable.switchColor();
                        draggable.setHover(true);
                    } else {
                        if (draggable.getHover())
                            draggable.switchColor();
                        draggable.setHover(false);
                    }
                }
            }
        }

        // Check Draggable Dragged.
        /*for(let i = 0; i <= this.draggables.length - 1; i++)
        {
            let draggable = this.draggables[i];
            let flag      = draggable.checkOnDrag(this.mousePosX, this.mousePosY);
        }*/

        this.render();
    }

    onMouseEnter()
    {

    }

    onMouseLeaved()
    {
        let mce = this.mouseCellIndex;
        //this.cells[mce].switchColor();
        this.resetMouseEvent();
        this.render();
    }

    reset()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    destroy()
    {
        this.draggables = [];
        this.cells = [];
    }

    resetMouseEvent()
    {
        this.mouseCell           = {x:-1, y:-1};
        this.mouseCellIndex      = -1;
        this.mouseCellLeave      = {x:-1, y:-1};
        this.mouseCellIndexLeave = -1;
    }

    // Cell Functions //
    changeCellColor()
    {
        let mcl = this.mouseCellIndexLeave;
        let mce = this.mouseCellIndex;
        if(mce !== -1)
            this.cells[mce].switchColor();
        if(mcl !== -1)
            this.cells[mcl].switchColor();
    }

    // Draggable entity Control Functions //
    moveDraggable(i, cellX, cellY)
    {
        let coordinate = this.getCentralPixelCoordinate(cellX, cellY);
        let cellIndex  = this.getIndexArrayHorizontal(cellX, cellY);
        let cell       = this.cells[cellIndex];
        let draggable  = this.draggables[i];
        if(draggable !== null) {
            // Screen Pixels (No transition animation)//
            // draggable.setPos(coordinate.i, coordinate.j);
            // Screen Pixels (With transition animation)//
            draggable.setToPosition(coordinate.i, coordinate.j);
            // Table Array Coordinate //
            draggable.setCoordinate(cellX, cellY);
            this.render();
        }
    }

    // Disable Draggable //
    disableDraggable(i)
    {
        this.draggables[i].setDisable(true);
    }

    // Remove Draggable //
    removeDraggable(i)
    {
        this.draggables[i] = null;
    }


    moveDraggableDirection(i, direction)
    {
        let current_coordinate = this.draggables[i].getCoordinate();
        let ci = current_coordinate.x;
        let cj = current_coordinate.y;
        switch(direction)
        {
            case 'u':
                this.moveDraggable(i, ci, cj - 1);
                break;
            case 'd':
                this.moveDraggable(i, ci, cj + 1);
                break;
            case 'l':
                this.moveDraggable(i, ci - 1, cj);
                break;
            case 'r':
                this.moveDraggable(i, ci + 1, cj);
                break;
            case 'ul':
                this.moveDraggable(i, ci - 1, cj - 1);
                break;
            case 'ur':
                this.moveDraggable(i, ci + 1, cj - 1);
                break;
            case 'dl':
                this.moveDraggable(i, ci - 1, cj + 1);
                break;
            case 'dr':
                this.moveDraggable(i, ci + 1, cj + 1);
                break;
            default:
                break;
        }
    }

    // Table Array Utility Functions //
    getIndexArrayHorizontal(i, j)
    {
        return i * this.yCols + j;
    }

    getCellCoordinateHorizontal(index)
    {
        if(index <= (this.xCols * this.yCols) - 1)
        {
            let i = Math.floor(index / this.xCols);
            let j = index - this.xCols * i;
            return {x:i, y:j};
        }
        else
            return null;
    }

    getIndexArrayVertical(i, j)
    {
        return j * this.xCols + i;
    }

    getCellCoordinateVertical(index)
    {
        if(index <= (this.xCols * this.yCols) - 1)
        {
            let i = index - this.yCols * i;
            let j = Math.floor(index / this.yCols);
            return {x:i, y:j};
        }
        else
            return null;
    }

    getCell(x, y)
    {
        for(let i = 0;i <= this.cells.length - 1; i++)
        {
            let cell = this.cells[i];
            let cx   = cell.x;
            let cy   = cell.y;
            if(x === cx && y === cy)
                return cell;
        }
    }

    getCentralPixelCoordinate(i, j)
    {
        let xMid = this.cellWidth;
        let yMid = this.cellHeight;
        let centerX = xMid / 2;
        let centerY = yMid / 2;
        i++;
        j++;
        if(i <= 0)
            i = 1;
        if(j <= 0)
            j = 1;
        return {i:i * xMid - centerX, j: j * yMid - centerY};
    }
}

class Draggable
{
    constructor(ctx, posX, posY, radius, collisionType, layer)
    {
        this.ctx  = ctx;
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.collisionType = collisionType;

        // Draggable Status. //
        this.disable   = false;

        // Input Type Events. //
        this.hover     = false;
        this.selected  = false;
        this.mouseDown = false;
        this.mouseUp   = false;
        this.dragged   = false;

        // Animation Variables. //
        this.animationSet       = 0;
        this.xPixelPerSecond    = 50;
        this.yPixelPerSecond    = 50;
        this.xSpeed             = this.xPixelPerSecond / 1000;
        this.ySpeed             = this.yPixelPerSecond / 1000;
        this.toX                = this.posX;
        this.toY                = this.posY;
        this.movingFactor       = 0;
        this.distance           = 0;
        this.disappearingSpeed  = 50 / 10000;
        this.disappearingFactor = 0;

        this.optimizePositionBasedOnCollisionType();
    }

    setDisable(flag)
    {
        this.disable = flag;
    }

    checkOnHover(mouseX, mouseY)
    {
        let x = mouseX;
        let y = mouseY;
        switch(this.collisionType)
        {
            case 0:
                return this.checkRectangularCollision(x, y);
            case 1:
                return this.checkCircularCollision(x, y);
            default:
                break;
        }
    }

    checkOnMouseDown(mouseX, mouseY)
    {
        let flag = this.checkOnHover(mouseX, mouseY);
        this.mouseDown = flag;
        this.dragged   = flag;
        this.selected  = flag;
        this.mouseUp   = false;
        return flag;
    }

    checkOnMouseUp()
    {
        this.mouseDown = false;
        this.mouseUp   = true;
        this.dragged   = false;
        return this.mouseUp;
    }

    checkOnDrag(mouseX, mouseY)
    {
        if(this.dragged) {
            let x = mouseX;
            let y = mouseY;
            this.posX = x;
            this.posY = y;
            return true;
        }
        else
            return false;
    }

    optimizePositionBasedOnCollisionType()
    {
        if(this.collisionType === 0)
        {

        }
    }

    checkRectangularCollision(x, y)
    {
        let flag = false;
        return flag;
    }

    checkCircularCollision(x, y)
    {
        let flag = false;
        let centerX = this.posX;
        let centerY = this.posY;
        let radius  = this.radius;
        if(x >= centerX - radius && x <= centerX + radius)
        {
            if(y >= centerY - radius && y <= centerY + radius)
                return true;
        }
        return flag;
    }

    getHover()
    {
        return this.hover;
    }

    setHover(flag)
    {
        this.hover = flag;
    }

    getSelected()
    {
        return this.selected;
    }

    getDragged()
    {
        return this.dragged;
    }

    setSelected(flag)
    {
        this.selected = flag;
    }

    setDragged(flag)
    {
        this.dragged = flag;
    }

    setPos(x, y)
    {
        this.posX = x;
        this.posY = y;
    }

    // Animation Functions //
    setToPosition(x, y)
    {
        this.toX = x;
        this.toY = y;

        let x0 = this.posX;
        let y0 = this.posY;

        let x1 = this.toX;
        let y1 = this.toY;

        this.distance  = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
        this.movingFactor = 0;
    }

    update(elapsedTime)
    {
        // Move to position animation //
        if(this.animationSet === 0)
            this.moveLinear(elapsedTime);
        if(this.animationSet === 1)
            this.disappear(elapsedTime);
    }

    moveLinear(elapsedTime)
    {
        let x0 = this.posX;
        let y0 = this.posY;

        let x1 = this.toX;
        let y1 = this.toY;
        this.movingFactor += elapsedTime / 1000 * this.xSpeed;
        if(this.movingFactor >= 1)
            this.movingFactor = 0;
        let u  = this.movingFactor;
        let nx = (1-u) * x0 + u * x1;
        let ny = (1-u) * y0 + u * y1;
        this.posX = nx;
        this.posY = ny;
    }

    disappear(elapsedTime)
    {

    }

    draw()
    {
        return this.disable;
    }
}

class Checker extends Draggable
{
    constructor(ctx, posX, posY, radius, collisionType, layer, team, type, index, color1, color2, hoverColor, selectedColor, strokeStyles)
    {
        super(ctx, posX, posY, radius, collisionType, layer);
        this.team           = team;
        this.type           = type;
        this.index          = index;
        this.color1         = color1;
        this.color2         = color2;
        this.hoverColor     = hoverColor;
        this.selectedColor  = selectedColor;
        this.strokeStyle    = strokeStyles;

        // Coordinate of the Checker. //
        this.coordinate     = {x: 0, y: 0};
    }

    setType(type)
    {
        this.type = type;
    }

    getType()
    {
        return this.type;
    }

    setTeam(team)
    {

    }

    getTeam()
    {
        return this.team;
    }

    setCoordinate(i, j)
    {
        this.coordinate.x = i;
        this.coordinate.y = j;
    }

    getCoordinate()
    {
        return this.coordinate;
    }


    switchColor()
    {
        //console.log("Switch Colors");
        let temp = this.color2;
        this.color2 = this.hoverColor;
        this.hoverColor = temp;
    }

    switchColor2()
    {
        let temp = this.color2;
        this.color2 = this.selectedColor;
        this.selectedColor = temp;
    }

    draw()
    {
        let flag = super.draw();
        if(!flag) {
            let ctx = this.ctx;
            let x = this.posX;
            let y = this.posY;
            let r = this.radius;
            ctx.beginPath();
            ctx.fillStyle = this.color1;
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = this.color2;
            ctx.arc(x, y, r * 0.9, 0, 2 * Math.PI);
            ctx.fill();
            if (this.type === 1) {
                ctx.beginPath();
                ctx.fillStyle = "white";
                ctx.arc(x, y, r * 0.3, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.closePath();
        }
    }

    checkOnHover(mouseX, mouseY) {
        return super.checkOnHover(mouseX, mouseY);
    }

    checkOnDrag(mouseX, mouseY) {
        return super.checkOnDrag(mouseX, mouseY);
    }

    checkOnMouseDown(mouseX, mouseY) {
        return super.checkOnMouseDown(mouseX, mouseY);
    }

    checkOnMouseUp() {
        return super.checkOnMouseUp();
    }
}

class Cell
{
    constructor(ctx, fromX, fromY, sizeX, sizeY, color, hoverColor, width, strokeStyle)
    {
        this.c           = ctx;
        this.fromX       = fromX;
        this.fromY       = fromY;
        this.toX         = 0;
        this.toY         = 0;
        this.sizeX       = sizeX;
        this.sizeY       = sizeY;
        this.originalColor = color;
        this.color       = color;
        this.color1      = color;
        this.hoverColor  = hoverColor;
        this.width       = width;
        this.strokeStyle = strokeStyle;

        // Data Object //
        this.contents    = {};
    }

    setOriginalColor(color)
    {
        this.originalColor = color;
    }

    setCordPos(fromX, fromY, sizeX, sizeY)
    {
        this.fromX = fromX;
        this.fromY = fromY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    setToCord(x, y)
    {
        this.toX = x;
        this.toY = y;
    }

    setColor(color)
    {
        this.color = color;
    }

    setHoverColor(color)
    {
        this.hoverColor = color;
    }

    getColor()
    {
        return this.color;
    }

    getHoverColor()
    {
        return this.hoverColor;
    }

    getCoordinate()
    {
        return {fromX: this.fromX, fromY: this.fromY, toX: this.toX, toY: this.toY};
    }

    getCellPos()
    {
        return {x: this.cellPos.x, y: this.cellPos.y};
    }

    switchColor()
    {
        let tempColor = this.color;
        this.color    = this.hoverColor;
        this.hoverColor   = tempColor;
    }

    changeToHoverColor()
    {
        this.color   = this.hoverColor;
    }

    resetColor()
    {
        this.color = this.originalColor;
    }


    draw()
    {
        let ctx = this.c;
        ctx.beginPath();
        ctx.rect(this.fromX, this.fromY, this.sizeX, this.sizeY);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    checkOnHover(mouseX, mouseY)
    {
        let sx = this.fromX;
        let sy = this.fromY;
        let ex = this.toX;
        let ey = this.toY;
        if(mouseX >= sx && mouseX <= ex)
        {
            if(mouseY >= sy && mouseY <= ey)
            {
                return true;
            }
        }
    }
}

class Line
{
    constructor(ctx, fromX, fromY, toX, toY, color, width, dash)
    {
        this.c     = ctx;
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX   = toX;
        this.toY   = toY;
        this.width = width;
        this.color = color;
        this.dash  = dash;
    }

    setCordPos(fromX, fromY, toX, toY)
    {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX   = toX;
        this.toY   = toY;
    }

    draw()
    {
        this.c.beginPath();
        this.c.moveTo(this.fromX, this.fromY);
        this.c.lineTo(this.toX, this.toY);
        this.c.setLineDash(this.dash);
        this.c.lineWidth = this.width;
        this.c.strokeStyle = this.color;
        this.c.stroke();
    }

    drawEndPoints(color, radius)
    {
        this.c.fillStyle = color;
        this.c.arc(this.fromX, this.fromY, radius, 0, Math.PI * 2, true);
        this.c.arc(this.toX, this.toY, radius, 0, Math.PI * 2, true);
        this.c.fill();
    }
}