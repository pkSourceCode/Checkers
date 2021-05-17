class PageAnimation
{
    // 0 is index page. //
    constructor(pageNumber)
    {
        this.pageNumber = pageNumber;
        this.pageOpen   = null;
        this.alert_box  = [];
        this.addListeners();
    }

    setPageOpen(page)
    {
        this.pageOpen = page;
    }

    getPageOpen()
    {
        return this.pageOpen;
    }

    addListeners()
    {
        let that = this;
        let pn   = this.pageNumber;
        let closeIndexPage      = () => this.closeIndexPage();
        let openLocalGamePanel  = () => this.openLocalGamePanel();
        let openOnlineGamePanel = () => this.openOnlineGamePanel();
        let openVersusAI        = () => this.openVersusAI();
        let openTwoPlayers      = () => this.openTwoPlayers();
        let openOnlineBattle    = () => this.openOnlineBattle();
        if(pn === 0)
        {
            document.getElementById("btn_play_with_ai").addEventListener("click",function(){
                closeIndexPage();
                that.setPageOpen(0);
                openLocalGamePanel();
                openVersusAI();
            });
            document.getElementById("btn_two_players").addEventListener("click", function(){
                closeIndexPage();
                that.setPageOpen(1);
                openLocalGamePanel();
                openTwoPlayers();
            });
            document.getElementById("btn_play_online").addEventListener("click", function(){
                closeIndexPage();
                that.setPageOpen(2);
                openOnlineGamePanel();
                openOnlineBattle();
            });

            document.getElementById("btn_back_to_menu").addEventListener("click", function(){
                that.backToMenu(that.pageOpen);
            });

            document.getElementsByClassName("btn_back_to_menu")[0].addEventListener("click", function(){
                that.backToMenu(that.pageOpen);
            });
        }
    }

    initPage()
    {
        switch(this.pageNumber)
        {
            case 0:
                this.openIndexPage();
            break;
        }
    }

    openIndexPage()
    {
        document.getElementById("title").setAttribute("class", "show");
        document.getElementById("sub_title").setAttribute("class", "show");
        setTimeout(function(){
            document.getElementById("menu_panel").setAttribute("class", "show");
        }, 500);
        setTimeout(function(){
            document.getElementById("main_content").style.setProperty("height", "60%");
            document.getElementById("main_content").style.setProperty("box-shadow", "none");
            document.getElementById("main_content").style.setProperty("border-radius","none");
            document.getElementById("main_content").style.setProperty("width","50%");
            document.getElementById("main_content").style.setProperty("min-height","650px");
            document.getElementById("main_content").style.setProperty("min-width","850px");
        }, 250);
    }

    closeIndexPage()
    {
        document.getElementById("title").setAttribute("class", "hide");
        document.getElementById("sub_title").setAttribute("class", "hide");
        setTimeout(function(){
            document.getElementById("menu_panel").setAttribute("class", "hide");
        }, 1);
    }

    openLocalGamePanel()
    {

        setTimeout(function(){
            document.getElementById("main_content").style.setProperty("height", "90%");
            document.getElementById("main_content").style.setProperty("box-shadow", "1px 1px 20px 1px black");
            document.getElementById("main_content").style.setProperty("border-radius","20px 20px 20px 20px");
        }, 250);
    }

    openOnlineGamePanel()
    {
        setTimeout(function(){
            document.getElementById("main_content").style.setProperty("height", "90%");
            document.getElementById("main_content").style.setProperty("width", "80%");
            document.getElementById("main_content").style.setProperty("box-shadow", "1px 1px 20px 1px black");
            document.getElementById("main_content").style.setProperty("border-radius","20px 20px 20px 20px");
        }, 250);
        setTimeout(function(){
        document.getElementById("main_content").style.setProperty("min-width", "1000px")}, 350);
    }

    backToMenu(page)
    {
        if(page === 0)
        {
            closeGame();
            resetPlayers();
            this.closeVersusAI();
        }
        else if(page === 1)
        {
            closeGame();
            resetPlayers();
            this.closeTwoPlayers();
        }
        else if(page === 2)
            this.closeOnLineBattle();
        this.openIndexPage();
    }

    openVersusAI()
    {
        document.getElementById("game_panel").setAttribute("class", "show");
        startVSAi();
    }

    closeVersusAI()
    {
        document.getElementById("game_panel").setAttribute("class", "hide");
    }

    openTwoPlayers()
    {
        document.getElementById("game_panel").setAttribute("class", "show");
        start2PlayersGame();
    }

    closeTwoPlayers()
    {
        document.getElementById("game_panel").setAttribute("class", "hide");
    }

    openOnlineBattle()
    {
        document.getElementById("checker_online").setAttribute("class", "show");
        startCheckersOnline();
    }

    closeOnLineBattle()
    {
        document.getElementById("checker_online").setAttribute("class", "hide");
    }

    insertAlertBox(title, message)
    {
        let bid = this.alert_box.length;
        let ab  = new MyAlertBox(bid, title.toString(), message.toString(), "wrapper");
        this.alert_box.push(ab);

        // TODO: FIX THIS... (DONE)//
        // PROBLEM WITH JAVASCRIPT //
        // ERROR: MODIFY HTML CONTENTS REMOVES EVENT LISTENERS AND BROKE THE APPLICATION //
        // FIXED //
        ab.insert();
        ab.bindsButton(() => this.removeAlertBox(bid));

        return bid;
    }

    showAlertBox(id)
    {
        this.alert_box[id].show();
        this.bringUpSeparator();

    }

    hideAlertBox(id)
    {
        this.alert_box[id].hide();
        this.bringDownSeparator();
    }

    removeAlertBox(id)
    {
        // TODO: FIX THIS... (DONE)//
        // PROBLEM WITH JAVASCRIPT //
        // ERROR: MODIFY HTML CONTENTS REMOVES EVENT LISTENERS AND BROKE THE APPLICATION //
        // FIXED //
        this.alert_box[id].unbindsButton(() => this.removeAlertBox(id));
        this.alert_box[id].remove();
        this.alert_box.splice(id, 1);
        this.bringDownSeparator();
    }

    bringUpSeparator()
    {
        let target = document.getElementById("game_alert");
        target.setAttribute("class", "show");
    }

    bringDownSeparator()
    {
        let target = document.getElementById("game_alert");
        target.setAttribute("class", "hide");
    }
}

class MyAlertBox
{
    constructor(id, title, message, location, posX = null, posY = null)
    {
        this.id       = "game_alert_box_id_" + id.toString();
        this.posX     = posX;
        this.posY     = posY;
        this.location = location.toString();
        this.title    = title.toString();
        this.message  = message.toString();
        this.animationDuration = 1;
    }

    insert()
    {

        // ERROR: METHOD NO LONGER VIABLE. 00
        // THIS BREAKS THE APPLICATION //
        /*let str = `<div id="` + this.id + `" class="game_alert_box hide">
        <div class="game_alert_box_top">` + this.title + `</div>
        <div class="game_alert_box_mid">` + this.message + `</div>
        <div class="game_alert_box_bot">
        <button id="btn_close_` + this.id +`" class="btn_close">CLOSE</button>
        </div>
        </div>`;*/

        // ADD HTML CONTENT BY HTML CREATE ELEMENT FUNCTION,
        // THEN APPEND THEM IN TO PARENT NODES.
        // FIXED!
        let top = document.createElement("div");
        top.setAttribute("class", "game_alert_box_top");
        top.innerHTML = this.title;
        let mid = document.createElement("div");
        mid.setAttribute("class", "game_alert_box_mid");
        mid.innerHTML = this.message;
        let bot = document.createElement("div");
        bot.setAttribute("class", "game_alert_box_bot");
        let btn = document.createElement("button");
        btn.setAttribute("id", "btn_close_" + this.id);
        btn.setAttribute("class", "btn_close");
        btn.innerHTML = "CLOSE";
        bot.appendChild(btn);
        let gab = document.createElement("div");
        gab.setAttribute("id", this.id);
        gab.setAttribute("class", "game_alert_box hide");
        gab.appendChild(top);
        gab.appendChild(mid);
        gab.appendChild(bot);


        // ERROR: THIS PROCEDURE DOES NOT WORK ON MODERN JAVASCRIPT //
        //        CONCAT HTML STRING VIA innerHTML REMOVES EVENT
        //        LISTENERS AND BROKE THE APPLICATION.
        //  document.getElementById(this.location).innerHTML += str;//
        //                DO NOT USE THE ABOVE METHOD               //

        //                     USE THIS INSTEAD                     //
            document.getElementById(this.location).appendChild(gab);


        document.getElementById(this.id).style.setProperty("transition", "opacity" + this.animationDuration + "s ease-in-out;");
    }

    bindsButton(func)
    {
        //this.buttonFunction = () => func;
        document.getElementById("btn_close_" + this.id).addEventListener("click", func);
    }

    unbindsButton(func)
    {
        document.getElementById("btn_close_" + this.id).removeEventListener("click", func);
    }

    show()
    {
        let target = document.getElementById(this.id);
        setTimeout(function()
        {
            target.setAttribute("class", "game_alert_box show")
        }, 0);
    }

    hide()
    {
        let target = document.getElementById(this.id);
        setTimeout(function()
        {
            target.setAttribute("class", "game_alert_box hide");
        }, 0);
    }

    remove()
    {
        this.hide();
        let exec = document.getElementById(this.id);
        setTimeout(function()
        {
           exec.remove();
        }, this.animationDuration * 1000);
    }
}