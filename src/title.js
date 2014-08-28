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
function title() {
    
    var group,featureTitle,regionsNames,feature,formatter,indexing;
    
    var labels = {
        types:{},
        regs:{},
        years:{},
        typeGroups:{}
    };

    var texts = {
        regsText:"",
        regsTextInflected:"",

        yearsText:"",
        yearsTextInflected:"",

        typeGroupsText:"",
        typesText:"",
        tp:"",

        featureText: "",
        valueText: "",

        finalTitle: function(){
            return  [this.featureText + " : "+this.valueText,
                     this.tp + " " + this.regsTextInflected  + " " + this.yearsTextInflected + " "];
        }
    };
    
    var sumTitle = ["Slovenská republika","Všetky typy kriminality","",""];
    
    var div = d3.select("#title");
    
    var arr = ["regs","types","typeGroups","years"];
    
    var divs = {};
    
    var divContainer = div.append("div")
                        .attr("class","container");
    
    divs.feature = divContainer.append("div")
                    .attr("class","feature");
    
    divs.value = divContainer.append("div")
                    .attr("class","value");
    
    for(var i=0;i<arr.length;i++){
        divs[arr[i]]=div.append("div").attr("class","subtitle");
    }
    
    function chart(){

        var selection = {};
        var summed = {};

        texts.featureText = featureTitle();
        divs.feature.text(texts.featureText);
        
        for(var i=0;i<arr.length;i++){
            var data = group[arr[i]].keys();
            summed[arr[i]] = false;
            if(data.length===labels[arr[i]].length){
                summed[arr[i]]=true;
                data = [sumTitle[i]];
            }
            if(arr[i]==="types" && data.length>1){
                summed[arr[i]]=true;
                data = [""];
            }
            
            
            selection[arr[i]] = divs[arr[i]].selectAll("span")
                .data(data);
        
            selection[arr[i]].enter().append("span");
            
            selection[arr[i]].exit().remove();
        }

        selection.regs.text(function(d){
                    texts.regsText = summed.regs?d:regionsNames[d];
                    texts.regsTextInflected = "v ";
                    if(summed.regs){
                        texts.regsTextInflected = texts.regsTextInflected+"Slovenskej republike";
                    }else{
                        texts.regsTextInflected = texts.regsTextInflected + regionsNames[d].substring(0, regionsNames[d].length -6)+"om kraji";
                    }
                    return texts.regsText;
                });
                
        selection.years.text(function(d){
                    if(summed.years){
                        texts.yearsText = "roky "+d3.min(group.years.keys())+" - "+d3.max(group.years.keys());
                        texts.yearsTextInflected = "za "+ texts.yearsText;
                    }else{
                        texts.yearsText = "rok " + d;
                        texts.yearsTextInflected = "v roku " + d;
                    }
                    return texts.yearsText;
                });
                
        selection.types.text(function(d){
                    texts.typesText = summed.types?d:labels.types[d];
                    return texts.typesText;
                });
                
        selection.typeGroups.text(function(d){
            if(summed.typeGroups||(!summed.types&&!summed.typeGroups)){
                texts.typeGroupsText = "";
            }else{
                texts.typeGroupsText = labels.typeGroups[d];
            }
            return texts.typeGroupsText;
        });

        texts.tp = texts.typeGroupsText?texts.typeGroupsText:texts.typesText;
        
        
        
        texts.valueText = formatter(feature())(group.getFeatureByIndexing(feature()));
        divs.value.text(texts.valueText);
        
//        regs.text(d3.keys(group.regs));
//        types.text(d3.keys(group.types));
//        years.text(d3.keys(group.years));
//        
//        var tg = typeGroups
//                .selectAll("span")
//                .data(group.typeGroups.keys());
//        
//        tg.enter().append("span");
//        
//        tg.text(function(d){return labelsTypeGroup[d];});
        
    }
    
    
    chart.group = function(_) {
        if (!arguments.length)
            return group;
        group = _;
        return chart;
    };
    
    chart.labelsType = function(_) {
        if (!arguments.length)
            return labels.types;
        labels.types = _;
        return chart;
    };
    
    chart.labelsTypeGroup = function(_) {
        if (!arguments.length)
            return labels.typeGroups;
        labels.typeGroups = _;
        return chart;
    };
    
    chart.labelsRegions = function(_) {
        if (!arguments.length)
            return labels.regs;
        labels.regs = _;
        return chart;
    };
    
    chart.regionsNames = function(_) {
        if (!arguments.length)
            return regionsNames;
        regionsNames = _;
        return chart;
    };
    
    chart.labelsYears = function(_) {
        if (!arguments.length)
            return labels.years;
        labels.years = _;
        return chart;
    };
    
    chart.featureTitle = function(_) {
        if (!arguments.length)
            return featureTitle;
        featureTitle = _;
        return chart;
    };
    
    chart.feature = function(_) {
        if (!arguments.length)
            return feature;
        feature = _;
        return chart;
    };
    
    chart.formatter = function(_) {
        if (!arguments.length)
            return formatter;
        formatter = _;
        return chart;
    };

    chart.texts = function(_) {
        if (!arguments.length)
            return texts;
        texts = _;
        return chart;
    };

    chart.indexing = function(_) {
        if (!arguments.length)
            return indexing;
        indexing = _;
        return chart;
    };
    
    return chart;
}