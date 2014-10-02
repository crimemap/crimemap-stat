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
function indexingComponent(renderFunction){
    
    var div = d3.select("#indexing"),
            indexingSelection,
            paramName="i";
    
    var absolute = div.append("label")
            .attr("id","absolute")
            .classed({active:true,hand:true,button:true,tiny:true})
            .text("Absolútna hodnota")
            .on("click",onClick);
    
    var index = div.append("label")
            .attr("id","index")
            .classed({secondary:true,hand:true,button:true,tiny:true})
            .text("Hodnota na 1000 obyvateľov za rok")
            .on("click",onClick);
    
    function chart(){
        
    }
    
    function onClick(){
        div.selectAll("label").classed({"active":false,"secondary":true});
        d3.select(this).classed({"active":true,"secondary":false});
        renderFunction();
    }
    
    
    chart.pushParam = function(params) {
        if(indexingSelection()==="index"){
            params[paramName] = "1";
        }
        return params;
    };
    
    chart.applyParam = function(params) {
        if(!params[paramName]){
            index.classed({"active":false,"secondary":true});
            absolute.classed({"active":true,"secondary":false});    
        }else if(+params[paramName] === 1){
            absolute.classed({"active":false,"secondary":true});
            index.classed({"active":true,"secondary":false});
        }
    };
    
    chart.indexingSelection = function(_) {
        if (!arguments.length)
            return indexingSelection;
        indexingSelection = _;
        return chart;
    };
    
    return chart;
}