$('document').ready(function () {
    var startx = 1;
    var starty = 1;
    var finishx = 30;
    var finishy = 30;
    var interval = 0;
    var interval_growth = 30;
    var solutionIsntFound = true;
    var noPath = true;
    var theresStillHope = true;
    var steps_taken = 1; // First step in mind
    var actual_steps_taken = 1;
    initializeGrid();

    function initializeGrid() {
        // Get viewport width and height, so we can calculate how much rectangles we'll need.
        var viewportWidth = $('#grid').width();
        var viewportHeight = $('#grid').height();
        var num_of_collumns = Math.floor(viewportHeight / 30);
        var num_of_rows = Math.floor(viewportWidth / 30);
        //Initialize grid and an array of coordinates.
        //var coord = Create2DArray(Math.floor(viewportWidth / 30));
        var grid = document.getElementById("grid");
        // Fill the grid with rectangles.
        for (var y = 0; y < num_of_collumns; y++) {
            for (var x = 0; x < num_of_rows; x++) {
                var div = document.createElement("div");
                div.setAttribute("class", "rect");
                div.setAttribute("y", y);
                div.setAttribute("x", x);
                div.setAttribute("type", 0);
                grid.appendChild(div);
            }
        }
        setStart(startx, starty);
        setFinish(finishx, finishy);
    }

    function aStar() {
        // var distanceFromStartToEnd = getDistanceFromStartToEnd();
        // Firstly, look around neighbors so check where f is the lowest for start x and start y.
        checkNeighbors(startx, starty);
        while (solutionIsntFound && !noPath) {
            steps_taken++;
            actual_steps_taken++;
            var parentX = $("div[selected = selected]").attr("x");
            var parentY = $("div[selected = selected]").attr("y");
            $("div[selected = selected]").attr("selected", false);
            while (checkNeighbors(parentX, parentY) && theresStillHope) {
                // No path. Go one step back 
                console.log("NO PATH. Now @ step : ", steps_taken);
                // Actually don't if it's not a step
                if (steps_taken - 1 > 0) {
                    steps_taken -= 1;
                    parentX = $("div[step = " + steps_taken + "]").attr("x");
                    parentY = $("div[step = " + steps_taken + "]").attr("y");
                } else {
                    console.log("THERES LITERALLY NO PATH");
                    theresStillHope = false;
                }
            }
            //sleeps(2);
        }
    }

    function checkNeighbors(x, y) {
        //console.log("Called with: ", x, y);
        var least = 9999;
        var least_x;
        var least_y;
        noPath = true;
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var newX = Number(x) + Number(i);
                var newY = Number(y) + Number(j);
                // Don't check where we're at
                if (i == 0 && j == 0) {
                    continue;
                }
                // Don't check the start
                if ($("div[x=" + newX + "][ y=" + newY + "]").hasClass("start")) {
                    continue;
                }
                // Don't check if it's a wall or if we have already been there
                if ($("div[x=" + newX + "][ y=" + newY + "]").hasClass("wall") || $("div[x=" + newX + "][ y=" + newY + "]").hasClass("selected")) {
                    continue;
                }
                // Break if that's the finish
                if ($("div[x=" + newX + "][ y=" + newY + "]").hasClass("finish")) {
                    solutionIsntFound = false;
                    break;
                }
                // Don't check beyond borders
                if (newX < 0 || newY < 0) {
                    continue;
                }
                // If there's at least one spot where it can go, there's still some path
                noPath = false;
                // Don't check if it has been checked already, just take the checked f's <!!!>
                if ($("div[x=" + newX + "][ y=" + newY + "]").hasClass("checked")) {
                    var f = $("div[x=" + newX + "][ y=" + newY + "]").attr("f");
                } else {
                    // Okay do it
                    //console.log("Doing with: ", newX, newY);
                    var g = getGCost(newX, newY, startx, starty);
                    var h = getHCost(newX, newY, finishx, finishy);
                    var f = round(g + h, 2);
                    $("div[x=" + newX + "][ y=" + newY + "]").attr("g", g).attr("h", h).attr("f", f).addClass("checked");
                }
                // TODO: IF EQUAL, DECIDE BY H COSTS.
                if (f < least) {
                    least = f;
                    least_x = newX;
                    least_y = newY;
                }
            }
        }
        if (solutionIsntFound) {
            console.log("Choosing : ", least_x, least_y, " with f of : ", least);
            $("div[x=" + least_x + "][ y=" + least_y + "]").attr("step", steps_taken).attr("actual_steps_taken", actual_steps_taken).addClass("selected").attr("selected", true);
        }
        return noPath;
    }
    function visualise(){
        for(var i = 1 ;i < actual_steps_taken ; i++){
            var x = $("div[actual_steps_taken=" + i + "]").attr("x");
            var y = $("div[actual_steps_taken=" + i + "]").attr("y");
            goo(x, y, interval, i);
            interval+=interval_growth;
        }
    }
    function paint_went(x, y, i){
        $("div[x=" + x + "][ y=" + y + "]").addClass("painted_went");
        console.log("Visualizing at: " + x + " " + y + " @ step " + i);
    }

    function goo(x, y, interval, i){
        setTimeout(function () {
            paint_went(x, y, i);
        }, interval);
    }

    function getGCost(fx, fy, sx, sy) {
        return round(Math.sqrt(Math.pow(fx - sx, 2) + Math.pow(fy - sy, 2)), 2);
    }

    function getHCost(sx, sy, fx, fy) {
        return round(Math.sqrt(Math.pow(fx - sx, 2) + Math.pow(fy - sy, 2)), 2);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
     
    async function waitABit() {
        console.log('Taking a break...');
        await sleep(2000);
        console.log('Two seconds later');
    }

    function sleeps(seconds) {
        var waitUntil = new Date().getTime() + seconds * 1000;
        while (new Date().getTime() < waitUntil) true;
    }

    function setStart(x, y) {
        // Starting point is checked anyway so we're adding checked to it.
        $("div[x=" + x + "][ y=" + y + "]").addClass('start').addClass("checked").attr("type", 2);
    }

    function setFinish(x, y) {
        $("div[x=" + x + "][ y=" + y + "]").addClass('finish').attr("type", 3);
    }

    function getDistanceFromStartToEnd() {
        var sx = $('div[type=2]').attr('x');
        var sy = $('div[type=2]').attr('y');
        var fx = $('div[type=3]').attr('x');
        var fy = $('div[type=3]').attr('y');
        return Math.sqrt(Math.pow(fx - sx, 2) + Math.pow(fy - sy, 2));
    }

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    function Create2DArray(rows) {
        var arr = [];
        for (var i = 0; i < rows; i++) {
            arr[i] = [];
        }
        return arr;
    }
    $(".rect").on('click', function (event) {
        // Creating and removing walls
        // Check if it's not start or finish
        if ($(this).attr("type") != 2 && $(this).attr("type") != 3) {
            if ($(this).hasClass('wall')) {
                $(this).removeClass('wall');
                $(this).attr("type", 0);
            } else {
                $(this).addClass('wall');
                $(this).attr("type", 1);
            }
        }
    });
    $("#start").on('click', function (event) {
        // Starting aStar algorithm
        aStar();
        console.log("PATH FOUND.");
        console.log("STARTED VISUALIZATION.");
        // Visualizing
        visualise();
    });
    /* $("#restart").on('click', function (event) {
         // Restarting aStar algorithm
         solutionIsntFound = true;
         noPath = true;
         steps_taken = 0;
         // TODO: wipe all selects and stuff. NOT WALLS
         aStar();
     });*/
});