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
function barsy(widthTotal,heightTotal) {
    
    var group, dimension, labels,feature, renderFunction, formatter,all, controlsObj, sortedLabels, texts;
    
    var margin = {top: 40, right: 10, bottom: 80, left: 70},
    width = widthTotal - margin.left - margin.right,
    height = heightTotal - margin.top - margin.bottom,
    ticksize = 20,
    activeRecords,
    paramName='y';

    var d3node = d3.select("#barsy");

    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0);

    var y = d3.scale.linear()
            .rangeRound([height, 0]);
    
    var yearScale;

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".0f"))
            .ticks(2);

    var svg = d3node.append("svg")
                .attr("width", widthTotal)
                .attr("height", heightTotal);
    
    var g = svg.select("g");
    
    function chart(){

        var data = group.all().slice(0).sort(function(a,b){
                    return (+labels[a.key])-(+labels[b.key]);
                });

        x.domain(
                data
                .map(function(d) {
                    return labels[d.key];
                })
        );
        
        y.domain([0, d3.max(data, function(d) {
            return d.value.getFeatureByIndexing(feature());
            })]);
        
        yAxis
                .tickValues(y.domain())
                .tickFormat(formatter(feature()));

        if(!controlsObj){
            controlsObj = controls(d3node,labels,step,finish,texts);
        }
        var helperText = [
                          "Aktuálny výber: "+texts.yearsText+". ",
                          "Tento komponent slúži na porovnanie, sledovanie trendov a filtráciu zločinnosti podľa rokov. Štatistiku pre konkrétny rok je možné získať prostredníctvom kliknutia na stĺpec v grafe. Výber je možné zrušiť opätovným kliknutím na vybraný rok, alebo kliknutím na zrušenie filtra X.",
                          "Hodnoty kriminality sú v stĺpcovom grafe reprezentované výškou stĺpca, kde vyšší stĺpec znamená vyššiu hodnotu kriminality (pre všetky veličiny, ktoré nie sú uvádzané v percentách, teda vyšší stĺpec znamená horšiu hodnotu).",
                          "Zobrazovaná štatistika: "+texts.finalTitle()[1],
                          texts.finalTitle()[0]
                          ];
        controlsObj.setHelpertext(helperText);

        if(g.empty()){
            sortedLabels = labels.slice(0).sort();

            yearScale = d3.scale.linear()
                    .domain([0,data.length])
                    .range([0,width]);
            
            g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            g.append("g")
                .attr("class", "x axis")
                .classed({"hand":true})
                .attr("transform", "translate(0," + height + ")");
        
            g.append("g")
                .attr("class", "y axis")
                .call(yAxis);
        
            g.append("clipPath")
                        .attr("id", "clip")
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", width)
                        .attr("height", height);

              g.selectAll(".bar")
                  .data(["background", "foreground"])
                .enter().append("path")
                  .on("click",onBarClick)
                  .attr("class", function(d) { return d + " bar"; })
                  .classed({"hand":true});
          
          g.select(".foreground.bar")
                        .attr("clip-path", "url(#clip)");
          
            svg.select(".x.axis").call(xAxis)
                    .selectAll("text")  
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", function(d) {
                        return "rotate(-65)"; 
                        });
            
            g.selectAll(".tick text")
                        .on("click",mouseclick)
                        .attr("id", function(d) { return "l"+d;});
                

        }
        
        svg.select(".y.axis").call(yAxis);
        
        g.selectAll(".bar")
                .on("click",onBarClick)
                .datum(data)
                .transition()
                .attr("d", barPath);
        
        activeRecords = all.years.keys();
        if(activeRecords.length<labels.length){
            deactivateAll();
            activateArr(activeRecords);
        }else{
            removeActsAll();
        }
    }
    
    function barPath(groups) {
        var path = [],
            i = -1,
            n = groups.length,
            d;
        while (++i < n) {
          d = groups[i];
          path.push("M", 5+x(labels[d.key]), ",", height, "V", y(d.value.getFeatureByIndexing(feature())), "h"+ticksize+"V", height);
        }
        return path.join("");
      }
      
      function isActive(d){
          return g.select("text#l"+d).classed("active");
      }
      
      function deactivateAll(){
          g.selectAll(".x.axis text").classed({"inactive":true,"active":false});
      }

      function activate(d){
          g.select("text#l"+d).classed({"inactive":false,"active":true});
          g.select("#clip rect")
//                  .transition()
                  .attr("x", 5+x(d))
                        .attr("width", ticksize);
      }
      
      function activateArr(arr){
          for (var i=0;i<arr.length;i++){
              activate(arr[i]);
          }
      }
      
      function removeActsAll(){
          g.selectAll(".x.axis text").classed({"inactive":false,"active":false});
          g.select("#clip rect").attr("x", 0)
                        .attr("width", width);
      }
      
      function mouseclick(d){
          if(!controlsObj.isPlaying()){
              if(isActive(d)){
                  //removeActsAll();
                  chart.filter(null);
                  controlsObj.setX(0);
              }else{
                //deactivateAll();
                //activate(d);
                chart.filter(labels.indexOf(d));
                controlsObj.setX(sortedLabels.indexOf(d));
              }
              renderFunction();
          }
      }
      
     function onBarClick(d){
         var x = d3.mouse(this)[0];
         var position = Math.round(yearScale.invert(x-13));
         var year = labels[d[position].key];
         mouseclick(year);
     }

    function step(turn){
        deactivateAll();
        chart.filter(labels.indexOf(sortedLabels[turn]));
        renderFunction();
    }

    function finish(){
        chart.filter(null);
        renderFunction();
    }
    
    chart.dimension = function(_) {
        if (!arguments.length)
            return dimension;
        dimension = _;
        return chart;
    };
    
    chart.group = function(_) {
        if (!arguments.length)
            return group;
        group = _;
        return chart;
    };
    
    chart.labels = function(_) {
        if (!arguments.length)
            return labels;
        labels = _;
        return chart;
    };
    
    chart.feature = function(_) {
        if (!arguments.length)
            return feature;
        feature = _;
        return chart;
    };
    
    chart.filter =function(_){
        dimension.filter(_);
        return chart;
    };
    
    chart.renderFunction = function(_) {
      if (!arguments.length) return renderFunction;
      renderFunction = _; return chart;
    };
    
    chart.formatter = function(_) {
      if (!arguments.length) return formatter;
      formatter = _; return chart;
    };
    
    chart.all = function(_) {
      if (!arguments.length) return all;
      all = _; return chart;
    };

    chart.texts = function(_) {
        if (!arguments.length)
            return texts;
        texts = _;
        return chart;
    };
    
    
    
    chart.pushParam = function(params) {
        if(activeRecords.length===1){
            params[paramName] = labels.indexOf(activeRecords[0]);
        }
        return params;
    };
    
    chart.applyParam = function(params) {
        var tmpNumber = parseInt(params[paramName],10);
        if(typeof tmpNumber === "number" && isFinite(tmpNumber) && tmpNumber >= 0 && tmpNumber <= labels.length){
            chart.filter(tmpNumber);
        }else{
            chart.filter(null);
        }
    };
    
    return chart;

}

