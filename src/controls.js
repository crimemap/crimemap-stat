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
function controls(d3node,fields,step,finish,texts){

    var playActive=false;
    var intervalID;
    var x = 0;
    var charts,allControls;

    function checkVariables(){
        if(!charts){
            charts = d3.selectAll(".chart").selectAll("svg");
            allControls = d3.selectAll(".controlsList");
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
                controlsList.classed({"disabledInnerMain":false});
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
    
    function enable(){
        if(!playActive){
            controlsList.classed({"disabledInnerMain2":false});
        }
    }
    
    function disable(){
        if(!playActive){
            controlsList.classed({"disabledInnerMain2":true});
        }
    }

    d3node.node().addEventListener("mouseenter",enable);
    d3node.node().addEventListener("mouseleave",disable);
    
    //TODO:map does not work if  d3node.select("svg")
    var svgNode = d3node.selectAll("svg");

    var helpWindowHeight = svgNode.attr("height");
    var helpWindowWidth = svgNode.attr("width");

    var modalId = "modal-"+d3node.attr("id");
    
    var helpWindow = d3node.select("#"+modalId);
    helpWindow.append("div").classed({"close-reveal-modal":true}).html("&#215;");

    var controlsDiv = d3node.insert("div",":first-child")
        .classed({"controls":true})
        .style({"width":helpWindowWidth+"px"});

    var controlsTitle = controlsDiv.append("h5").classed({"subheader":true}).text(texts.chartTitles[d3node.attr("id")]);
    
    var line = controlsDiv.append("hr").classed({"nospace":true});
    
    var controlsList = controlsDiv.append("div").classed({"button-bar":true,"right":true})
            .append("ul").classed({"button-group":true,"disabledInnerMain2":true,"controlsList":true});

    var playDiv = controlsList.append("li")
        .classed({"tiny":true,"button":true,"secondary":true})
        .on("click",play)
        .html("&nbsp;&nbsp;play");
        

    var pauseDiv = controlsList.append("li")
        .classed({"tiny":true,"button":true,"secondary":true})
        .style("display","none")
        .on("click",pause)
        .text("pause");


    var helpDiv = controlsList.append("li")
        .classed({"tiny":true,"button":true,"secondary":true})
        .attr("data-reveal-id",modalId).text("help");

    var cancelDiv = controlsList.append("li")
        .classed({"tiny":true,"button":true,"secondary":true})
        .on("click",cancel)
        .text("cancel");

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