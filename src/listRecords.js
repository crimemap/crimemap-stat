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
function listRecords() {

    var dimension;


    function chart(){
        
        var data = dimension.top(Infinity);
        
        var header = d3.select("#listRecords")
                .select("#header");
        
        if(header.empty()){
            d3.select("#listRecords")
                .append("div")
                .attr("id","header")
                .datum(d3.keys(data[0]))
                .text(function(d){return d+",";});
        
        }
        
        
        var records = d3.select("#listRecords")
            .selectAll(".record")
            .data(dimension.top(Infinity));
        
        var recordEnter = records.enter().append("div")
            .attr("class", "record");
        
        records
            .text(function(d){return d3.values(d)+",";});

        records.exit().remove();

//        records.selectAll(".props")
//                .data(function(d){
//                    return d3.values(d);
//                })
//                .enter()
//                .append("div")
//                .attr("class","props");
//        
//        records.selectAll(".props")
//                .text(function(d){
//                    return d;
//                });
//
//        recordEnter.append("div")
//                .attr("class", "origin")
//                .text(function(d) {
//                    return d.origin;
//                });
//
//        recordEnter.append("div")
//                .attr("class", "destination")
//                .text(function(d) {
//                    return d.destination;
//                });
//
//        recordEnter.append("div")
//                .attr("class", "distance")
//                .text(function(d) {
//                    return formatNumber(d.distance) + " mi.";
//                });
//
//        recordEnter.append("div")
//                .attr("class", "delay")
//                .classed("early", function(d) {
//                    return d.delay < 0;
//                })
//                .text(function(d) {
//                    return formatChange(d.delay) + " min.";
//                });


        
    }

    

    chart.dimension = function(_) {
        if (!arguments.length)
            return dimension;
        dimension = _;
        return chart;
    };
    
    return chart;

}