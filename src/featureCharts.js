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
function featureCharts() {
    if (!featureCharts.id) featureCharts.id = 0;

    var margin = {top: 10, right: 10, bottom: 20, left: 170},
            width = 600 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom,
            ticksize = 20,
            tickspacing = 3,
            group,
            g,
            subcharts,
            renderFunction,
            feature,formatter,texts,labels,
            allfeatures = {},controlsObj,currentOrder=[],fid=0,
            active,
            paramName='f';

            var tickWidth = 50;

    var div = d3.select("#featureCharts");

    function chart(){
        
        g = div.select("g");
        if (g.empty()) {

            g = div.append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            subcharts = [
                subchart(0,group.getByPositions,[0,8,1,3],0,2),
                subchart(5,group.getByPositions,[2],0,1),
                subchart(7,group.getByPositions,[7,10,6,9],0,2),

                subchart(0,group.getByPositionsRatios,[0],1,2),
                subchart(2,group.getByPositionsRatios,[1,4,3,2],1,2),
                subchart(7,group.getByPositions,[4,11,5,12],1,2),

            ];
        }


        currentOrder = [];

        for(var i=0;i<subcharts.length;i++){
            subcharts[i]();
        }


        function step(turn){
            div.selectAll("g.labels").classed({"active":false,"inactive":true});
            active = d3.select(currentOrder[turn].parentNode).classed({"active":true,"inactive":false}).datum().key;
            renderFunction();
        }

        function finish(){
            div.selectAll("g.labels").classed({"active":false,"inactive":true});
            active = d3.select(currentOrder[0].parentNode).classed({"active":true,"inactive":false}).datum().key;
            renderFunction();
        }

        if(!controlsObj){
            controlsObj = controls(div,currentOrder,step,finish);
        }
        var helperText = [
                          "Aktuálny výber: "+texts.featureText+". ",
                          "Tento komponent slúži na výber veličiny, prostredníctvom ktorej je možné porovnávať kriminalitu. Dostupné veličiny sú buď hodnoty nejakého ukazovateľa, alebo pomery týchto hodnôt (percentá). Pre veličiny, ktoré nie sú pomerom ukazovateľov, je možné aktivovať buď Absolútne hodnoty (t.j súčty), alebo Hodnoty na 1000 obyvateľov za rok.",
                          "Štatistiku pre požadovanú veličinu je možné získať prostredníctvom kliknutia na text alebo pruhový graf. Výber nie je možné zrušiť, vždy musí byť vo výbere práve jedna veličina. Pre veličiny, ktoré nie sú pomerom ukazovateľov, je možné aktivivať Absolútnu hodnotu alebo Hodnotu na 1000 obyvateľov za rok v hornej časti komponentu.",
                          "Hodnoty ukazovateľov v rámci jednotlivých veličín sú reprezentované v pruhovom grafe veľkosťou prislúchajúceho pruhu, kde väčší pruh znamená vyššiu hodnotu veličiny. Jednotlivé hodnoty je možné porovnávať len medzi veličinami v jednom podgrafe.",
                          "Podrobné vysvetlivky k veličinám sa nachádzajú v pomocníkovi.",
                          "Zobrazovaná štatistika: "+texts.finalTitle()[1],
                          texts.finalTitle()[0]
                          ];
        controlsObj.setHelpertext(helperText);



    }

    function subchart(topmargin,datafunction,positions,columnPos,columnCount) {

        var format = d3.format(".0f"),
            x = d3.scale.linear().range([0, tickWidth]),
            yaxis = d3.svg.axis().orient("left"),
            id = featureCharts.id++,
            names, //names mozno refactor
            maxvalue = function (data){return d3.max(data, function(d){return d.value;});};

                draw.maxvalue = function(_) {
            if (!arguments.length)
                return maxvalue;
            maxvalue = _;
            return draw;
        };
            
        function draw(){
            var data = datafunction(positions)
                    .splice(0);

            x.domain([0, maxvalue(data)]);
            
            var featureKeys = [];
            data.forEach(function(d){
                featureKeys.push(d.key);
                });
            
            var y = d3.scale.ordinal()
                        .rangeRoundBands([0, ticksize*featureKeys.length])
                        .domain(featureKeys);
            
            yaxis.scale(y);
            
            var subg = g.select("g #g-"+id);

            if(subg.empty()){

                subg = g.append("g")
                        .attr("id","g-"+id)
                        .attr("transform", "translate("+((width+margin.left+20)/columnCount*columnPos)+"," + ((ticksize+tickspacing)*topmargin+10)+ ")");

//                subg.append("clipPath")
//                        .attr("id", "clip-"+id)
//                        .append("rect")
//                        .attr("x", 0)
//                        .attr("y", 0)
//                        .attr("width", width)
//                        .attr("height", ticksize*featureKeys.length);

                subg.selectAll(".bar")
//                        .data(["background", "foreground"])
                        .data(["foreground"])
                        .enter().append("path")
                        .attr("class", function(d) {
                            return d + " bar";
                        });

//                subg.selectAll(".foreground.bar")
//                        .attr("clip-path", "url(#clip-" + id + ")");

//                subg.append("g")
//                        .attr("class", "axis x");
//                
//                subg.append("g")
//                        .attr("class", "axis y");
                
                
                
            }
            
            var labels = subg.selectAll("g.labels")
                        .data(data,function(d){
                            return d.key;
                        });
            
            var labelsEnter = labels.enter()
                    .append("g")
                    .attr("class",function(d){
                        return chart.feature()===d.key?"active":"inactive";
                    })
                    .classed({"labels":true,"hand":true});
            
            labelsEnter.append("text")
                    .attr("x",function(d){
                        return tickWidth+5;
                    })
                    .classed({"values":true});
            
            var sth = labelsEnter.append("text")
                    .classed({"names":true})
                    .attr("x",-5)
                    .attr("text-anchor","end")
                    .attr("id",function(d){
                        var ret = fid;
                        fid=fid+1;
                        allfeatures[d.key]=this;
                        return "feature"+ret;
                    });
                    
            labels.attr("transform", function(d,i){
                            return "translate(0,"+((i+0.5) * (ticksize+tickspacing/4))+")";
                    });
            
            var textValues = labels
                    .selectAll("text.values")
                    .datum(function(){
                        return d3.select(this.parentNode).datum();
                    })
                    .text(function(d,i){
                        var format = formatter(d.key);
                        return format(d.value);
                    })
                    .on("click",mouseclick);
            
            if(!names){
             names = labels
                    .selectAll("text.names")
                    .datum(function(){
                        return d3.select(this.parentNode).datum();
                    })
                    .text(function(d,i){
                        return d.key;
                    })
                    .on("click",mouseclick);   
            }

            subg.selectAll(".bar")
                        .datum(data)
                        .transition()
                        .attr("d", barPath);

            data.map(function(d,i){
                currentOrder.push(allfeatures[d.key]);
             });
            
        }

        function barPath(groups) {
            var path = [], i = -1, n = groups.length, d;
            while (++i < n) {
                d = groups[i];
                path.push("M", 0, ",", (i * ticksize)+tickspacing/2, "h", x(d.value), "v"+(ticksize-tickspacing)+"H", 0, "Z");
            }
            return path.join("");
        }
        
        function mouseclick(){
            div.selectAll("g.labels").classed({"active":false,"inactive":true});
            active= d3.select(this.parentNode)
                        .classed({"active":true,"inactive":false})
                        .datum().key;
            renderFunction();
        }        
        return draw;


    }

    chart.group = function(_) {
        if (!arguments.length)
            return group;
        group = _;
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

    chart.texts = function(_) {
      if (!arguments.length) return texts;
      texts = _; return chart;
    };
    
    chart.labels = function(_) {
      if (!arguments.length) return labels;
      labels = _; return chart;
    };

    chart.feature = function() {
        if(!active){
            active=labels[0];
        }
        return active;
    };

    chart.pushParam = function(params) {
        var position = labels.indexOf(chart.feature());
        if(position){
            params.f=position;
        }
        return params;
    };
    
    chart.applyParam = function(params) {
        if(params[paramName]){
            active=labels[params[paramName]];
        }else{
            active=0;
        }
    };
    


    return chart;
}