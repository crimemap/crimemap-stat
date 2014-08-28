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
function fileProgress(cfg){ if(!cfg){ cfg={};}
//var fpi=d3.select("body").append("div").attr("id","rt").style("z-index","100").text("dedede");
var progress_info=d3.select("#progress-info"),
    fileResult=d3.select("#file_result"),
    progressClass="progress-meter",
    dataFile = cfg.dataFile,
    width = cfg.width  | 150,  height= cfg.height | 150, 
    arc = d3.svg.arc().startAngle(0).innerRadius(cfg.innerRadius | 40).outerRadius(cfg.outerRadius | 60),
    twoPi = 2 * Math.PI, progress = 0,
    fileSizeFormat= d3.format(" .1f"),
    formatPercent = d3.format(".0%");
    var meter = progress_info.style("margin","auto").append("svg").attr("width", width).attr("height", height)
        .append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .append("g").attr("class", progressClass);
    meter.append("path").attr("class", "background").attr("d", arc.endAngle(twoPi));
var foreground = meter.append("path").attr("class", "foreground"),
    text = meter.append("text").attr("text-anchor", "middle").attr("dy", ".35em").style("font-size","20px");
function onProgress(){ 
    fileResult.text(dataFile+" "+fileSizeFormat((d3.event.total / 1024 )) + "kB");
    var i = d3.interpolate(progress, d3.event.loaded / d3.event.total);
    d3.transition().tween("progress", function() {
        return function(t) {
            progress = i(t);
            foreground.attr("d", arc.endAngle(twoPi * progress));
            text.text(formatPercent(progress));
        };
    });
} 
function done(){
    meter.transition().delay(250).attr("transform", "scale(0)");
    setTimeout(function() {
        fileResult.style("display","none").remove();
        progress_info.style("display","none").remove();
    }, 500);    
}
function tr(d){
    if(d.text) fileResult.text(d.text);
    var x = d.value / d.total;
    foreground.attr("d", arc.endAngle(twoPi *  x));
    text.text(formatPercent(x));  
}
function onError(error) {
    meter.transition().delay(250).attr("transform", "scale(0)");
    fileResult.text(error.status +" "+error.statusText);
}
return {onProgress: onProgress, done: done, onError: onError, tr: tr};
}