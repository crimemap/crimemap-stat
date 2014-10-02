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
function dataDownloader() {
    
    var dimension;
    
    var div = d3.select("#dataDownloader");
    
    var dataLink = div.select("a");
    
    function chart(){
        dataLink.on("click",function(){
            var popup = window.open('','Data','data:application/json;charset=utf-8');
            popup.document.write('<meta name="content-type" content="application/json">');
            popup.document.write('<meta name="content-disposition" content="attachment;  filename=data.json">');
            popup.document.write(JSON.stringify(dimension.top(Infinity)));
        });
        
    }
    
    chart.dimension = function(_) {
        if (!arguments.length)
            return dimension;
        dimension = _;
        return chart;
    };
    
    return chart;
    
}