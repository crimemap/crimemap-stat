/* Copyright (C) 2014 Andrej Alac, Miroslav Bimbo
*
* This file is part of Crimemap.
*
* Crimemap is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Crimemap is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with Crimemap. If not, see <http://www.gnu.org/licenses/agpl-3.0.txt>.
*/
function controls(d3node,fields,step,finish){

    var playActive=false;
    var intervalID;
    var x = 0;
    var charts,allControls;

    function checkVariables(){
        if(!charts){
            charts = d3.selectAll(".chart").selectAll("svg");
            allControls = d3.selectAll(".controls");
        }
    }


    function finishInternal(){
        checkVariables();
        allControls.classed({"disabledInnerMain":false});
        charts.classed({"disabledEvents":false});
        x = 0;
        finish();
    }

    function pause(){
        checkVariables();
        if(playActive){
            playActive=false;
            window.clearInterval(intervalID);
            allControls.classed({"disabledInnerMain":false});
            charts.classed({"disabledEvents":false});
            playDiv.style("display","inline-block");
            pauseDiv.style("display","none");
        }
    }

    function play(){
        checkVariables();
        var timeout = 1000;

        function runPlay() {
            step(x);
            if (++x === fields.length) {
                window.clearInterval(intervalID);
                setTimeout(function(){
                    playActive=false;
                    playDiv.style("display","inline-block");
                    pauseDiv.style("display","none");
                    finishInternal();
               },timeout);
            }
        }
        if(!playActive){
            playActive=true;
            runPlay();
            if(x !== fields.length){
                intervalID = setInterval(runPlay, timeout);
                allControls.classed({"disabledInnerMain":true});
                charts.classed({"disabledEvents":true});
                controlsDiv.classed({"disabledInnerMain":false});
                playDiv.style("display","none");
                pauseDiv.style("display","inline-block");
            }
        }
    }

    function cancel(){
        checkVariables();
        pause();
        finishInternal();
    }

    function help(){
        checkVariables();
        var duration = 1500;
        if(helpWindow.classed("active")){
            helpWindow
            .transition()
            .duration(duration)
                .style({"width":0+"px","height":helpWindowHeight+"px"});

            allControls.classed({"disabledInnerMain":true});
            charts.classed({"disabledEvents":true});
            helpWindow.classed({"active":false});

            setTimeout(function(){

                    allControls.classed({"disabledInnerMain":false});
                    charts.classed({"disabledEvents":false});
                },duration+20);

        }else{
            helpWindow
            .transition()
            .duration(duration)
            .style({"width":helpWindowWidth+"px","height":helpWindowHeight+"px"})
            .style({"display":"block"});

            allControls.classed({"disabledInnerMain":true});

            setTimeout(function(){
                    helpWindow.classed({"active":true});
                    allControls.classed({"disabledInnerMain":false});
                    charts.classed({"disabledEvents":false});
                },duration+20);

        }
    }

    //TODO:map does not work if  d3node.select("svg")
    var svgNode = d3node.selectAll("svg");
    var helpWindowHeight = svgNode.attr("height");
    var helpWindowWidth = svgNode.attr("width");

    var helpWindow = d3node.insert("div",":first-child")
        .classed({"helpWindow":true})
        .style({"width":0+"px","height":helpWindowHeight+"px","display":"none"});

    var controlsDiv = d3node.insert("div",":first-child")
        .classed({"controls":true});

    var playDiv = controlsDiv.append("span")
        .classed({"icon-play":true,"icon":true})
        .on("click",play);

    var pauseDiv = controlsDiv.append("span")
        .classed({"icon-pause":true,"icon":true})
        .style("display","none")
        .on("click",pause);


    var helpDiv = controlsDiv.append("span")
        .classed({"icon-help":true,"icon":true})
        .text("?")
        .on("click",help);

    var cancelDiv = controlsDiv.append("span")
        .classed({"icon-cancel":true,"icon":true})
        .text("X")
        .on("click",cancel);


    return {
        isPlaying: function(){
            return playActive;
        },
        setX:function(turn){
            x = turn;
        },
        setHelpertext:function(text){
            var paragraphs = helpWindow.selectAll("p").data(text);
            paragraphs.enter().append("p");
            paragraphs.text(function(d){
                return d;
            });
        },
        hide:function(){
            controlsDiv.style("display","none");
        },
        show:function(){
            controlsDiv.style("display","");
        },
        updateFields:function(fieldsNew){
            fields = fieldsNew;
        }
    };


}