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
    
    var div = d3.select("#indexing");
    
    var absolute = div.append("label")
            .attr("id","absolute")
            .classed({active:true,hand:true})
            .text("Absolútna hodnota")
            .on("click",onClick);
    
//    absolute.append("input")
//            .attr("type","radio")
//            .attr("name","indexing")
//            .attr("value","absolute");
    
    
    var index = div.append("label")
            .attr("id","index")
            .classed({inactive:true,hand:true})
            .text("Hodnota na 1000 obyvateľov za rok")
            .on("click",onClick);
    
//    index.append("input")
//            .attr("type","radio")
//            .attr("name","indexing")
//            .attr("value","index")
//            .attr("checked","checked");
    
    
    
    function onClick(){
        div.selectAll("label").classed({"active":false,"inactive":true});
        d3.select(this).classed({"active":true,"inactive":false});
        renderFunction();
    }
}