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
function sunburst() {

    var margin = {top: 100, right: 300, bottom: 100, left: 300},
    radius = Math.min(margin.top, margin.right, margin.bottom, margin.left) - 10;
    
    var radiusWidth = 25;
    var legendSpacing = 20;
    var counter = {},texts;
    
    var dimension0,dimension1, 
        group0,group1,
        labels0,labels1, 
        feature,renderFunction,coloring,formatter,format,all,
        controlsObj,
        data0;


    function active0(){
        return svg.select("path.active[depth=d1]");
    }
    
    function getActive1(){
        return svg.select("path.active[depth=d2]");
    }

    var d3node = d3.select("#sunburst");

    var svg = d3node.append("svg")
            .attr("width", margin.left + margin.right)
            .attr("height", margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class","hand");

    var arc = d3.svg.arc()
            .startAngle(function(d) {
                return d.x;
            })
            .endAngle(function(d) {
                return d.x + d.dx - 0.01 / (d.depth );
            })
            .innerRadius(function(d) {
                return radiusWidth * d.depth;
            })
            .outerRadius(function(d) {
                return radiusWidth * (d.depth + 1) - 1;
            });

    function getStruc2(groups){
        var tmp = {};
        for(var i=0;i<groups.length;++i){
            if(groups[i].value.typeGroups.keys().length===0){
                continue;                
            }
            var typeGr = +groups[i].value.typeGroups.keys()[0];
            if(!tmp.hasOwnProperty(typeGr)){
                tmp[typeGr]={
                    name:labels0[typeGr],
                    children:[]
                };
            }
            var type = +groups[i].key;
            tmp[typeGr].children.push({
               name:labels1[type],
               size:groups[i].value.getFeatureByIndexing(feature()) || 0
            });
        }
        return {name:"Celková Kriminalita",children:d3.values(tmp)};
    }

    function chart() {

        if(!controlsObj){
            controlsObj = controls(d3node,labels0,step,finish);
        }
        var helperText = [
                          "Aktuálny výber: "+texts.tp+". ",
                          "Tento komponent slúži na porovnanie a filtráciu zločinnosti podľa typu zločinu. Ledenda na ľavej strane a vnútorné medzikružie reprezentujú skupiny typov kriminality, vonkajšie medzikružie a pravá strana legendy reprezentujú typy kriminality prislúchajúce jednotlivým skupinám. Štatistiku pre požadovanú skupinu alebo typ kriminality je možné získať prostredníctvom kliknutia medzikružie alebo legendu. Výber je možné zrušiť opätovným kliknutím na vybraný typ kriminality, alebo kliknutím na zrušenie filtra X.",
                          "Hodnoty pre jednotivé typy kriminality sú reprezentované veľkosťou výseku medzikružia, kde väčší výsek znamená vyšší podiel daného typu kriminality na celkovej kriminalite. Pre všetky veličiny, ktoré nie sú uvádzané v percentách, teda väčší výsek znamená významnejší podiel daného typu kriminality na celkovej kriminalite. Pre veličiny, ktoré sú uvádzané v percentách, nemá veľkosť kruhového výseku štatistický význam.",
                          "Podrobné vysvetlivky k jednotlivým hlavným skupinám a typom kriminality sa nachádzajú v pomocníkovi.",
                          "Zobrazovaná štatistika: "+texts.finalTitle()[1],
                          texts.finalTitle()[0]
                          ];
        controlsObj.setHelpertext(helperText);

        format = formatter(feature());

        var data = getStruc2(group1.all().slice(0));
        
        var partition = d3.layout.partition()
            .sort(function(a, b) {
//                return (a.depth%2===0?-1:1)*a.value-(a.depth%2===0?-1:1)*b.value;
//                return a.depth%2===1?d3.descending(a.name,b.name):d3.descending(a.value,b.value);
                return d3.descending(a.name,b.name);
            })
            .size([2 * Math.PI, radiusWidth*3]);    
    
        var index = 0;
        
        partition
                .value(function(d) {
                    return d.size;
                })
                .nodes(data)
                .forEach(function(d) {
                    d._children = d.children;
                    d.sum = d.value;
                    d.key = key(d);
                    d.fill = fill(d);
                    d.fullname = (d.depth === 2) ? ("p"+labels0.indexOf(d.parent.name)+"-"+labels1.indexOf(d.name)) : ("p"+labels0.indexOf(d.name));
                    d.index = index++;
                });

        partition.children(function(d, depth) {
                    return depth < 2 ? d._children : null;
                })
                .value(function(d) {
                    return d.sum;
                });
                
        data0 = group0.all()
                .slice(0)
                .sort(function(a,b){
                    return (+b.value.getFeatureByIndexing(feature()))-(+a.value.getFeatureByIndexing(feature()));
                });
                        
        var padding = labels0.length*legendSpacing/2;
        var legend = svg.selectAll(".legend0")
                .data(data0,function(d){
                    return d.key;
            });
        
        var legendEnter = legend.enter().append("g")
                .attr("class", "legend0")
                .attr("id", function(d,i){return "l0_"+d.key;})
                .on("click",legend0Click);

        legendEnter.append("rect")
                .attr("x", 0)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d){
                    return coloring(d.key);
                });

        legendEnter.append("text")
                .attr("x", 20)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function(d) {
                    return labels0[d.key];
                });
        
        legendEnter.append("text")
                .attr("class","legend0Values")
                .attr("x", 190)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end");
        
        legend.transition() 
            .attr("transform", function(d, i) {
                        return "translate("+ (-margin.left+10)+"," + (-padding + i * legendSpacing) + ")";
                    });

        var path = svg.selectAll("path")
                .data(partition.nodes(data),function(d){return d.key;});
        
        path.exit().remove();
        
        path.enter().append("path")
                .attr("id",function(d){
                    if(d.depth===1){
                        return "p0_"+labels0.indexOf(d.name);
                    }else if (d.depth===2){
                        return "p1_"+labels1.indexOf(d.name);
                    }
                    return "";
                })
                .attr("depth",function(d){return "d"+d.depth;})
                .each(function(d) { this._current = updateArc(d); })
                .on("click", pathMouseclick)
                .on("mouseover", onMouseover)
                .on("mouseout", onMouseout);
        
        path.attr("title",function(d){
                return d.name+" "+format(d.sum);
            })
            .style("fill", function(d) {
                    return d.depth === 0?"white":d.fill;
                });

        path.transition().attrTween("d", function(d) {
                            return arcTween.call(this, updateArc(d));
                        });
                        
        svg.select("path[depth=d0]").on("click",reset);
        
        var activeRecords0 = all.typeGroups.keys();
        if(activeRecords0.length<labels0.length){
            deactivateAll0();
            activateArr0(activeRecords0);
        }
        
        if(!active0().empty())
            redrawLegend1(d3.select(active0().node()).datum());
        
        var activeRecords1 = all.types.keys();
        if(activeRecords1.length===1){
            deactivateAll1();
            activateArr1(activeRecords1);
        }
        
        if(getActive1().empty()){
            legend.selectAll(".legend0Values")
                    .text(function(d) {
                return format(d.value.getFeatureByIndexing(feature()));
            });    
        }else{
            legend.selectAll(".legend0Values")
                    .text("");    
        }

    }
    
    function activateArr0(arr){
        for(var i=0;i<arr.length;i++){
            activate0(svg.select("path#p0_"+arr[i]).datum());
        }
    }
    
    function activateArr1(arr){
        deactivateAll1();
        for(var i=0;i<arr.length;i++){
//            var d = svg.select("path#p1_"+arr[i]).datum();
//            activate1(d.name);
            activate1(labels1[+arr[i]]);
        }
    }
    
    function deactivateAll0(){
        svg.selectAll("g.legend0").classed({"active":false,"inactive":false});
        svg.selectAll("path[depth=d1]").classed({"active":false,"inactive":false});
    }
    
    function activate0(d){
        var active1 = getActive1();
        if(!active1.empty() && d3.select(active1.node()).datum().parent.key!==d.key){
            deactivateAll1();
            chart.filter1(null);
        }
        svg.selectAll("g.legend0").classed({"active":false,"inactive":true});
        svg.selectAll("path[depth=d1]").classed({"active":false,"inactive":true});
        svg.select("g#l0_"+labels0.indexOf(d.key)).classed({"active":true,"inactive":false});
        svg.select("path#p0_"+labels0.indexOf(d.key)).classed({"active":true,"inactive":false}).style("fill","white");
    }
    
    function isActive0(key){
        return svg.select("g#l0_"+labels0.indexOf(key)).classed("active");
    }
    
    function action0(d){
        if(isActive0(d.key)){
            deactivateAll0();
            chart.filter0(null);
            deactivateAll1();
            chart.filter1(null);
        }else{
            deactivateAll0();
            activate0(d);
            chart.filter0(labels0.indexOf(d.key));
        }
    }
    
    function deactivateAll1(){
        svg.selectAll("g.legend1").classed({"active":false,"inactive":false});
        svg.selectAll("path[depth=d2]").classed({"active":false,"inactive":false});
    }
    
    function activate1(key){
        
        svg.selectAll("g.legend1").classed({"active":false,"inactive":true});
        svg.selectAll("path[depth=d2]").classed({"active":false,"inactive":true});
        
        svg.select("g#l1_"+labels1.indexOf(key)).classed({"active":true,"inactive":false});
        svg.select("path#p1_"+labels1.indexOf(key)).classed({"active":true,"inactive":false});
    }
    
    function isActive1(key){
        return svg.select("path#p1_"+labels1.indexOf(key)).classed("active");
    }
    
    function action1(d){
        if(isActive1(d.name)){
            deactivateAll1();
            chart.filter1(null);
        }else{
            deactivateAll1();
            activate0(d.parent);
            activate1(d.name);
            
            chart.filter1(labels1.indexOf(d.name));
            chart.filter0(labels0.indexOf(d.parent.key));
        }
    }
    
    function reset(){
        deactivateAll0();
        deactivateAll1();
        chart.filter0(null);
        chart.filter1(null);
        renderFunction();
    }
    
    function legend0Click(d){
        if(!active0().empty()){
            if(active0().datum().name===labels0[d.key]){
                reset();
                return;
            }
            action0(active0().datum());
            renderFunction();   
        }
        action0(svg.select("path#p0_"+d.key).datum());
        renderFunction();
    }
    
    function legend1Click(d){
        if(!getActive1().empty()){
            if(getActive1().datum().name === d.name){
                deactivateAll1();
                chart.filter1(null);
                renderFunction();
                return;
            }
            action1(getActive1().datum());    
            renderFunction();
        }
//        action1(svg.select("path#p1_"+labels1.indexOf(d.name)).datum());
        action1(d);
        renderFunction();
    }
    
    
    function onMouseout(){
        
        if(active0().empty()){
            svg.selectAll(".legend1").remove();
        }else{
//            redrawLegend1(active0);
        }
    }
    
    function onMouseover(d){

        if(d.depth===0){
            return;
        }
        if(d.depth===2){
            d=d.parent;
        }

        redrawLegend1(d);
           
    }

    function step(turn){
        //deactivateAll0();
        chart.filter0(data0[turn].key);
        renderFunction();
    }

    function finish(){
        deactivateAll0();
        deactivateAll1();
        chart.filter0(null);
        chart.filter1(null);
        onMouseout();
        renderFunction();
    }

//    function labelMouseclick(d){
//
//        if(d.depth === 0){
//            reset();
//        } else if(d.depth === 1){
//            action0(d);
//        }else{
//            action1(d);
//        }
//
//        renderFunction();
//    }
    
    function pathMouseclick(d){
        
        if(d.depth === 0){
            reset();
        } else if(d.depth === 1){
            action0(d);
        }else{
            action1(d);
        }
          
        renderFunction();
    }
    
    function redrawLegend1(d0){
        var data =d0.children.slice(0).sort(function(a,b){return +(b.size)-(+a.size);});
        var padding = d0.children.length*legendSpacing/2;
        var legend = svg.selectAll(".legend1")
                    .data(data,function(d){
                                    return d.fullname;
                                });

        legend.exit().remove();

        var legendEnter = legend.enter().append("g")
                    .attr("class", "legend1")
                    .on("click",legend1Click);


        legendEnter.append("rect")
                .attr("x", 0)
                .attr("width", 18)
                .attr("height", 18)
                .attr("class","rects");

        legendEnter.append("text")
                .attr("class","legend1Text")
                .attr("x", 20)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start");
        
        legendEnter.append("text")
                .attr("class","legend1Values")
                .attr("x", 210)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end");

        legend.attr("transform", function(d, i) {
                        return "translate("+ margin.right/3.5+"," + (-padding + i * legendSpacing) + ")";
                    })
                .attr("id", function(d){
                    return "l1_"+labels1.indexOf(d.name);
                });

            legend.selectAll(".legend1Text")
                  .text(function(){
                      var dd = d3.select(this.parentNode).datum();
                      return dd.name;
            });
            
            legend.selectAll(".legend1Values")
                  .text(function(){
                      var dd = d3.select(this.parentNode).datum();
                      return format(dd.sum);
            });
                        
            legend.selectAll(".rects")
                .style("fill", function(){
                    return d3.select(this.parentNode).datum().fill;
                });
    }
    

    function key(d) {
        var k = [], p = d;
        while (p.depth){
            k.push(p.name);
            p = p.parent;
        }
        return k.reverse().join(".");
    }

    function fill(d) {
        if (d.depth > 1){
            var p = d.parent;
            counter[p.name]++;
            if(counter[p.name]%2===0){
                return coloring(labels0.indexOf(p.name))
                    .darker([(counter[p.name])/4]);
            }else{
                return coloring(labels0.indexOf(p.name))
                    .brighter([(counter[p.name])/8]);
            }
        }else{
            counter[d.name] = 0;
            return coloring(labels0.indexOf(d.name));
        }
    }

    function arcTween(b) {
        var i = d3.interpolate(this._current, b);
        this._current = i(0);
        return function(t) {
            return arc(i(t));
        };
    }

    function updateArc(d) {
        return {depth: d.depth, x: d.x, dx: d.dx};
    }


    chart.dimension0 = function(_) {
        if (!arguments.length)
            return dimension0;
        dimension0 = _;
        return chart;
    };
    
    chart.dimension1 = function(_) {
        if (!arguments.length)
            return dimension1;
        dimension1 = _;
        return chart;
    };
    
    chart.labels0 = function(_) {
        if (!arguments.length)
            return labels0;
        labels0 = _;
        return chart;
    };
    
    chart.labels1 = function(_) {
        if (!arguments.length)
            return labels1;
        labels1 = _;
        return chart;
    };

    chart.group0 = function(_) {
        if (!arguments.length)
            return group0;
        group0 = _;
        return chart;
    };
    
    chart.group1 = function(_) {
        if (!arguments.length)
            return group1;
        group1 = _;
        return chart;
    };
    
    chart.coloring = function(_) {
        if (!arguments.length)
            return coloring;
        coloring = _;
        return chart;
    };
    
    chart.filter0 = function(_){
        if (!arguments.length)
            return group0;
        dimension0.filter(_);    
        return chart;
    };
    
    chart.filter1 = function(_){
        if (!arguments.length)
            return group1;
        dimension1.filter(_);    
        return chart;
    };
    
    chart.filter = function(_){
        if (!arguments.length)
            return chart;
        dimension0.filter(_[0]);    
        dimension1.filter(_[1]);
        return chart;
    };
    
    chart.renderFunction = function(_) {
      if (!arguments.length) return renderFunction;
      renderFunction = _; return chart;
    };
    
    chart.feature = function(_) {
        if (!arguments.length)
            return feature;
        feature = _;
        return chart;
    };
    
    chart.formatter = function(_) {
      if (!arguments.length) return formatter;
      formatter = _; return chart;
    };

    chart.texts = function(_) {
        if (!arguments.length)
            return texts;
        texts = _;
        return chart;
    };
    
    chart.all = function(_) {
      if (!arguments.length) return all;
      all = _; return chart;
    };

    return chart;
}