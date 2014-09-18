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
function map(){
var group,dimension,regions,labels,renderFunction,feature,coloring,indexingSelection,formatter,all,controlsObj,data,texts;
var activeRecords,paramName="m";
var width = 600,height = 200, scaleFactor= 3400;
 
var projection = d3.geo.mercator() 
   .scale(scaleFactor).center([19.68,48.57]).translate([Math.floor(65*width/100), Math.floor(height/2)]);  
var path = d3.geo.path().projection(projection).pointRadius(1); 

var startColor=d3.rgb("white"),endColor=d3.rgb("#4682B4");

var topology ={"type":"Topology","objects":{"kraje":{"type":"GeometryCollection","geometries":[
        {"type":"Polygon","properties":{"label":"Bratislavský kraj"},"id":"BL","arcs":[[0,1]]},
        {"type":"Polygon","properties":{"label":"Trnavský kraj"},"id":"TT","arcs":[[2,3,4,-1,5]]},
        {"type":"Polygon","properties":{"label":"Trenčiansky kraj"},"id":"TN","arcs":[[6,7,8,9,-3]]},
        {"type":"Polygon","properties":{"label":"Nitriansky kraj"},"id":"NR","arcs":[[-4,-10,10,11]]},
        {"type":"Polygon","properties":{"label":"Žilinský kraj"},"id":"ZA","arcs":[[12,13,14,-8]]},
        {"type":"Polygon","properties":{"label":"Banskobystrický kraj"},"id":"BB","arcs":[[-9,-15,15,16,17,-11]]},
        {"type":"Polygon","properties":{"label":"Prešovský kraj"},"id":"PO","arcs":[[18,19,-16,-14]]},
        {"type":"Polygon","properties":{"label":"Košický kraj"},"id":"KE","arcs":[[-20,20,-17]]}]}},"arcs":[[[203,4273],[57,82],[212,64],[37,-89],[167,116],[129,212],[56,242],[74,-114],[11,-123],[-99,-251],[-68,-99],[131,-197],[-93,-214],[78,-75],[119,-246],[19,-162],[47,-3],[43,-118],[-49,-178],[112,-213],[-69,-232],[70,-49],[-23,-106],[40,-22],[-17,-141],[-48,-15],[-32,-105],[-64,-43],[-89,136],[19,-145],[-88,-129],[-63,25],[4,-126],[81,-39],[-82,-226],[-43,-37],[-60,-163]],[[722,1490],[-9,56],[-143,-85],[-88,130],[-35,-59],[-38,61],[11,289],[33,73],[-35,57],[-27,178],[-34,-22],[-108,172],[-24,254],[-28,81],[19,153],[-57,41],[-53,202],[25,89],[-115,133],[-14,168],[29,4],[22,195],[-22,158],[68,138],[42,194],[62,123]],[[982,5746],[-9,-102],[-60,-104],[113,-10],[88,-62],[29,-95],[-39,-230],[69,-274],[47,-115],[48,96],[113,0],[15,91],[119,111],[72,-163],[134,-66],[34,62],[55,-72],[189,-133]],[[1999,4680],[10,-59],[-56,-98],[-100,51],[-87,-418],[75,-47],[125,-210],[-70,-197],[-27,-170],[-86,-244],[-15,-236],[-25,-44],[60,-107],[-37,-167],[64,-168],[-78,-170],[-31,99],[-34,-82],[50,-98],[-50,-101],[-81,0],[115,-227],[-31,-160],[120,-118],[-4,-163],[21,-184],[-14,-136],[23,-105],[-26,-79],[28,-89],[-142,-222],[-22,-258],[-59,-96],[-37,32],[-14,-173],[-43,-91]],[[1521,145],[-169,335],[-66,-42],[-76,273],[-130,109],[-35,187],[-175,387],[-97,2],[-51,94]],[[203,4273],[-28,348],[62,249],[-2,113],[53,131],[-1,79],[86,308],[71,95],[38,244],[78,74],[66,158],[94,-39],[115,-128],[85,-158],[62,-1]],[[982,5746],[94,173],[47,-22],[75,-153],[129,81],[68,143],[120,30],[141,296],[-3,47],[181,12],[49,426],[39,84],[97,27],[59,-40],[100,133],[59,234],[-17,234],[53,143],[-10,148],[32,86],[-3,232],[65,116],[0,86],[110,42],[131,108]],[[2598,8412],[88,20],[6,-84],[94,-261],[59,-323],[192,-266],[28,-148],[-50,-113],[65,-113],[0,-259],[-51,-138],[-106,-86],[-21,-96],[-60,-47],[19,-72],[91,-17],[53,54],[31,116],[34,-69],[70,40],[106,-28],[46,-117],[-46,-50],[24,-160],[-18,-268],[139,-183],[-1,-118],[56,-108],[31,-139]],[[3477,5379],[-34,-170],[-78,-80],[-28,-151],[-57,-106],[0,-118],[-100,71],[-100,-273],[-119,-145],[-57,39],[-34,-106]],[[2870,4340],[-219,-301],[-74,27],[-45,237],[-102,71],[-21,116],[73,173],[-46,96],[-114,83],[-103,286],[-200,50],[41,-441],[-61,-57]],[[2870,4340],[53,-207],[51,-64],[-13,-239],[51,-182],[27,-225],[-53,-139],[-13,-213],[63,205],[138,-17],[46,152],[116,227],[66,-209],[47,-35],[38,-263],[22,-1],[-9,-280],[-54,-141],[39,-187],[-54,-98],[15,-123],[53,61],[54,-79],[106,-14],[3,83],[176,101],[65,8],[-37,-181],[28,-140],[-91,-214],[0,-86]],[[3803,1840],[-56,-129],[-79,25],[-107,-59],[-52,29],[-44,-69],[-19,-270],[-68,-18],[6,-256],[-28,-89],[11,-261],[102,-118],[46,-172],[-91,34],[-100,-54],[-18,-118],[-82,-123],[-125,-50],[-122,35],[-63,-59],[-87,61],[-42,-51],[-234,-128],[-140,58],[-69,-9],[-155,84],[-86,5],[-58,-60],[-56,62],[-46,-71],[-91,-28],[-59,32],[-135,-32],[-135,104]],[[2598,8412],[97,81],[65,195],[-21,158],[53,-22],[73,86],[27,138],[98,175],[-1,172],[88,54],[35,-81],[108,66],[133,-90],[99,137],[226,13],[53,-81],[-21,-259],[49,-123],[-34,-97],[19,-96],[103,10],[25,96],[94,-61],[81,0],[76,54],[-19,96],[56,88],[25,328],[85,133],[141,3],[15,167],[67,129],[102,118],[25,-148],[82,-69],[0,-173],[43,-268],[48,-183],[53,-46],[52,56],[13,-118],[-31,-140],[51,-3],[115,-98],[35,96],[77,15],[26,-468],[-22,-106],[53,-138],[-54,-50],[-59,-273],[63,-94],[81,-29],[75,61]],[[5321,7823],[54,-118],[13,-143],[-45,-110],[29,-70],[25,111],[51,8],[76,101],[-90,-190],[7,-94],[149,-7],[-39,-470],[-92,-55],[53,-86],[69,-313],[45,-4],[-41,-99],[-75,-37]],[[5510,6247],[-226,7],[-103,35],[-103,-99],[-95,143],[-37,-25],[-50,92],[-86,39],[-174,-3],[-88,-83],[-112,-32],[-79,-148],[-52,-175],[-73,-7],[10,130],[-38,60],[-106,-80],[-34,23],[-144,-52],[-58,49],[-94,-216],[-2,-217],[41,-64],[-10,-139],[-38,-98],[-101,-19],[-68,48],[-15,97],[-98,-134]],[[5510,6247],[288,-97],[31,99],[160,-180]],[[5989,6069],[-44,-155],[-79,-145],[19,-234],[-44,-87],[0,-155],[48,-32],[108,-180],[51,-164],[-9,-244],[105,-87],[-41,-300],[-52,-101],[6,-210],[50,-88],[104,-35],[44,72],[78,-34]],[[6333,3890],[-85,-245],[-6,-254],[-78,-201],[12,-27],[-81,-205],[-3,-83],[-62,-60],[-97,99],[-11,-92],[-57,-76],[-109,30],[1,-153],[-116,-195],[-23,-101],[-44,42],[-96,-61],[-63,-185],[-65,-37],[25,121],[-28,103],[-135,15],[-47,-84],[-22,64],[41,106],[-75,146],[-72,-60],[-72,60],[-22,150],[-63,47],[-93,-180],[-88,-64],[-25,-264],[-37,-79],[-7,-206],[-44,-94],[-15,98],[-95,-91],[-25,40],[-144,-17],[-82,-92],[-28,-93],[-196,106],[-64,-8],[-58,-78],[-76,108]],[[5321,7823],[62,168],[108,-22],[68,-160],[117,-118],[25,391],[47,125],[30,220],[132,180],[162,-45],[19,316],[139,-55],[43,126],[81,-12],[58,-109],[117,-91],[64,136],[50,-3],[100,101],[81,-51],[4,-111],[60,-155],[43,2],[33,-141],[62,74],[121,-275],[111,84],[-11,74],[97,206],[88,0],[18,59],[-100,212],[134,106],[100,-155],[47,-24],[26,125],[94,185],[53,-69],[60,17],[53,-96],[50,5],[58,-116],[135,40],[86,110],[72,-27],[50,64],[48,-162],[71,10],[113,-188],[45,-147],[12,122],[77,69],[110,-221],[109,-25],[29,-184],[90,-178],[-7,-276],[83,-86],[115,-44],[82,-143],[34,62],[66,-171],[125,-93],[86,54],[38,-143],[65,-108],[49,27],[53,-81],[92,32],[24,-79],[-13,-387],[-119,-82],[-90,-327],[-8,-239],[-67,-121]],[[9680,6005],[-104,69],[-114,-49],[-53,330],[-68,7],[-55,-186],[-54,-33],[9,-231],[-105,14],[-70,-44],[-147,69],[-1,91],[-173,131],[-85,39],[-26,-105],[41,-400],[-31,-76],[-132,-145],[-50,-10],[-44,93],[-76,-34],[-121,98],[-28,155],[-66,160],[-16,164],[-122,-47],[-69,36],[16,-120],[-28,-104],[-89,-7],[-5,-114],[-66,-17],[-51,89],[-5,123],[40,42],[-121,131],[-26,-74],[-44,131],[-137,7],[-105,54],[-49,157],[-9,124],[-60,-64],[-128,148],[-50,-28],[-113,156],[-31,-173],[-56,3],[-29,78],[-68,-47],[-23,-100],[-59,-10],[-25,138],[-70,-42],[-89,157],[-85,-140],[0,62],[-84,96],[-170,-197],[-59,-136],[78,-91],[-63,-86],[-31,-170],[-37,-8]],[[9680,6005],[-13,-148],[21,-182],[-65,-150],[16,-158],[-34,-308],[-66,-41],[-91,-153],[-35,-143],[-71,-55],[-50,-228],[-9,-277],[-32,-512],[28,-120],[-29,-82],[-88,-47],[-111,89],[-50,-59],[-79,3],[-154,-111],[-43,25],[-3,-148],[-121,27],[-92,98],[-16,119],[-66,66],[1,111],[-76,281],[-13,231],[-126,-7],[-42,202],[-135,207],[-44,-139],[-167,11],[-24,-205],[-116,91],[-104,-115],[-33,17],[-57,-153],[-47,12],[-19,121],[-131,79],[-103,-57],[-70,205],[-68,-50],[-47,163],[-342,-106],[-118,-136],[-69,43],[-16,-85],[-54,33],[-3,-234],[-71,-140]]],"transform":{"scale":[0.0005733032303230325,0.00018825752575257537],"translate":[16.833246,47.731429]}
};

var kraje= topojson.feature(topology, topology.objects.kraje).features;    

var d3node = d3.select("#map-chart");

var svg = d3node.append("svg")
    .attr("width", width).attr("height", height)
    .attr("viewBox", "0 0 " + width + " " + height)
  ;// .attr("style", "background-color: #aa0000");
  
   var defs = svg.append('defs');
    var pattern = defs.append("pattern")
        .attr('id', 'hash')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', '10')
        .attr('height', '10')
        .attr("x", 0).attr("y", 0)
        .append("g").style("fill", "red")
            .style("stroke", "black")
            .style("stroke-width", 1);
    pattern.append("rect").attr("id","hashbackground").attr("x",0).attr("y",0).attr("width",10).attr("height",10).style("stroke-width","0");
    pattern.append("path").attr("d", "M0,0 l10,10").style("stroke-width","0.8");

    var linearGradient = defs
            .append("linearGradient")
            .attr("id","grad")
            .attr("x1","0%").attr("y1","0%")
            .attr("x2","100%").attr("y2","0%");
    
    linearGradient.append("stop")
            .attr("offset","0%")            
            .style({"stop-color":startColor,"stop-opacity":1});
    
    linearGradient.append("stop")
            .attr("offset","100%")            
            .style({"stop-color":endColor,"stop-opacity":1});

var g = svg.append("g")
            .attr("id","region");

var color = d3.scale.linear();

var color2 = d3.scale.linear()
        .range(["white","#444"]); 
//        .range(["#F5F8FB","#444"]);    

//   <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" />
var gradientWidth=100;
var gradientGroup = svg.append("g")
        .attr("transform","translate(410,155)");
        
    gradientGroup.append("rect")
//        .attr("x",0)
//        .attr("y",160)
        .attr("width",gradientWidth)
        .attr("height",16)
        .attr("fill","url(#grad)");

    var startText = gradientGroup
            .append("text")
            .text("0")
            .attr("dy","1em")
            .attr("dx","-0.5em")
            .style("text-anchor", "end");
    
    var endText = gradientGroup
            .append("text")
            .attr("x",gradientWidth)
            .attr("dy","1em")
            .attr("dx","0.5em")
            .style("text-anchor", "start");

var padding = 10;
var legendSpacing = 20;
        
    
function chart(){
    
        var format = formatter(feature());

        if(!controlsObj){
            controlsObj = controls(d3node,regions,step,finish);
        }
        var helperText = [
                          "Aktuálny výber: "+texts.regsText+". ",
                          "Tento komponent slúži na porovnanie a filtráciu zločinnosti podľa krajov SR. Štatistiku pre konkrétny kraj je možné získať prostredníctvom kliknutia na mapku alebo legendu. Výber je možné zrušiť opätovným kliknutím na vybraný kraj, alebo kliknutím na zrušenie filtra X.",
                          "Hodnoty kriminality na mape sú reprezentované sýtosťou farby, kde tmavšia farba znamená vyššiu hodnotu kriminality (pre všetky veličiny, ktoré nie sú uvádzané v percentách, tmavšia farba znamená horšiu hodnotu pre daný kraj). Pre objektívne porovnanie krajov je vhodné nastaviť veličinu na 1000 obyvateľov za rok, alebo pomernú veličinu (uvádzanú v percentách).",
                          "Zobrazovaná štatistika: "+texts.finalTitle()[1],
                          texts.finalTitle()[0]
                          ];
        controlsObj.setHelpertext(helperText);


        var dataTmp = group.all();

//        var minValue = d3.min(dataTmp, function(d) {
//                return d.value.getFeatureByIndexing(feature());
//            }),

        for(var i=0;i<kraje.length;i++){
            if(kraje[i].id===dataTmp[i].value.regs.keys()[0]){
                kraje[i].properties.data = dataTmp[i];
                continue;
            }
            for(var j=0;j<dataTmp.length;j++){
                if(kraje[i].id===dataTmp[j].value.regs.keys()[0]){
                    kraje[i].properties.data = dataTmp[i];
                    break;
                }
            }
            if(!kraje[i].properties.data){
                kraje[i].properties.data = dataTmp[i];
            }
        }
        
        
        data = kraje.slice(0);
        
        data.sort(function(a,b){
            return b.properties.data.value.getFeatureByIndexing(feature())-a.properties.data.value.getFeatureByIndexing(feature());
        });
        
        var minValue = 0;

        var maxValue = data[0].properties.data.value.getFeatureByIndexing(feature());
                
        endText.text(format(maxValue));
        startText.text(format(minValue));
        
        color.domain([minValue,maxValue])
            .range([startColor,endColor]);
    //        .range(["white", data[0].value.typeGroups.keys().length===1?coloring(data[0].value.typeGroups.keys()[0]):"black"]);

        color2.domain([minValue,maxValue]);

        var legend = svg.selectAll(".legend0")
                .data(data,function(d){
                    return "l"+d.properties.data.key;
                });
        
        
        var legendEnter=legend
                .enter().append("g")
                .classed({"legend0":true,"hand":true})
                .attr("id", function(d){return "l"+d.id;})
                .on("click",onClick)
                .attr("transform", function(d, i) {
                    return "translate("+ 10+"," + (padding + i * legendSpacing) + ")";
                });

        legendEnter.append("rect")
                .attr("x", 0)
                .attr("width", 18)
                .attr("height", 18);
                
        legendEnter.append("text")
                .attr("class","regionName")
                .attr("x", 20)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start");
                
                
        legendEnter.append("text")
                .attr("class","regionValue")
                .attr("x", 190)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end");
        
                
        legend.selectAll(".regionName")
                .text(function(d) {
                    return d.properties.label;
                });
        
        legend.selectAll("rect")
                .style("fill",function(d,i){
                    return color(d.properties.data.value.getFeatureByIndexing(feature()));
                });
                

        legend.selectAll("text.regionValue")
                .text(function(d) {
                    return format(d.properties.data.value.getFeatureByIndexing(feature()));
                });
                
        legend.transition().attr("transform", function(d, i) {
                    return "translate("+ 10+"," + (padding + i * legendSpacing) + ")";
                });

        var regionsEl = g
            .selectAll(".region")
            .data(data,function(d){
                    return "l"+d.properties.data.key;
                });

        regionsEl.enter()
            .append("path")
            .classed({"region":true,"hand":true})
            .attr("id", function(d) { return d.id;})
            .attr("d", path)
            .on("click", onClick);

//        regionsEl.style("fill",function(d,i){
//            return color(d.properties.data.value.getFeatureByIndexing(feature()));
//        });

        activeRecords = all.regs.keys();
        if(activeRecords.length<regions.length){
            deactivateAll();
            activateArr(activeRecords);
        }else{
            removeActsAll();
        }

        var active = svg.select("path.active").classed({"active":true});
        
        if(!active.empty()){
            regionsEl.style("fill",function(d,i){
                return color(d.properties.data.value.getFeatureByIndexing(feature()));
            });
            defs.select("#hashbackground")
                .style("fill", color(active.datum().properties.data.value.getFeatureByIndexing(feature())));
            active.style("fill","url(#hash)");
//            active.style("fill",color(active.datum().properties.data.value.getFeatureByIndexing(feature())));
        }else{
            regionsEl.style("fill",function(d,i){
                return color(d.properties.data.value.getFeatureByIndexing(feature()));
            });
        }
         
    }
    
    
    function isActive(d){
          return g.select("path#"+d).classed("active");
      }
      
      function deactivateAll(){
            svg.selectAll("g.legend0").classed({"active":false,"inactive":true});
            g.selectAll("path").classed({"active":false,"inactive":true});
      }

      function activate(d){
            svg.select("g.legend0#l"+d).classed({"active":true,"inactive":false});
            g.select("path#"+d).classed({"active":true,"inactive":false});
      }
      
      function activateArr(arr){
          for (var i=0;i<arr.length;i++){
              activate(arr[i]);
          }
      }
      
      function removeActsAll(){
            svg.selectAll("g.legend0").classed({"active":false,"inactive":false});
            g.selectAll("path").classed({"active":false,"inactive":false});
      }
      
      function onClick(d){
          if(isActive(d.id)){
              removeActsAll();
              chart.filter(null);
          }else{
            deactivateAll();
            activate(d.id);
            chart.filter(d.properties.data.key);
          }
          renderFunction();
      }
    

    function step(turn){
        chart.filter(data[turn].properties.data.key);
        renderFunction();
    }

    function finish(){
        removeActsAll();
        chart.filter(null);
        renderFunction();
    }    
    
    chart.dimension = function(_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };
    chart.regions = function(_) {
      if (!arguments.length) return regions;
      regions = _;
      return chart;
    };
    chart.labels = function(_) {
      if (!arguments.length) return labels;
      labels = _;
      return chart;
    };
    chart.indexingSelection = function(_) {
      if (!arguments.length) return indexingSelection;
      indexingSelection = _;
      return chart;
    };
    chart.filter = function(_){
//        var start = new Date().getTime();
        if (!arguments.length)
            return;
        dimension.filter(_);    
//        var end = new Date().getTime();
//        var time = end - start;
//        alert('Execution time: ' + time);
        return chart;
    };
    chart.group = function(_) {
      if (!arguments.length) return group;
      group = _; return chart;
    };
    chart.feature = function(_) {
      if (!arguments.length) return feature;
      feature = _; return chart;
    };
    chart.renderFunction = function(_) {
      if (!arguments.length) return renderFunction;
      renderFunction = _; return chart;
    };
    
    chart.coloring = function(_) {
        if (!arguments.length)
            return coloring;
        coloring = _;
        return chart;
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
            params[paramName] = regions.indexOf(activeRecords[0]);
        }
        return params;
    };
    
    chart.applyParam = function(params) {
        var tmpNumber = parseInt(params[paramName],10);
        if(typeof tmpNumber === "number" && isFinite(tmpNumber) && tmpNumber >= 0 && tmpNumber <= regions.length){
            chart.filter(tmpNumber);
        }else{
            chart.filter(null);
        }
    };
    

    return chart;
}



