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
window.onload= crimeMap;
function crimeMap(){
    
    
var locale = d3.locale({
  "decimal": ",",
  "thousands": " ",
  "grouping": [3],
  "currency": ["€", ""],
  "dateTime": "%a %b %e %X %Y",
  "date": "%m/%d/%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
var normalFormat = locale.numberFormat(",.0f");
var percentFormat = locale.numberFormat(".2%");
var decimalFormat = locale.numberFormat(",.2f");
var features=["Zistené činy", "Objasnené činy", "Spôsobená škoda", "Dodatočne objasnené činy", "Vplyv alkoholu (činy)", "Vplyv drog (činy)", "Maloletý páchateľ (činy)", "Mladistvý páchateľ (činy)", "Počet osôb", "Maloletý páchateľ (osoby)", "Mladistvý páchateľ (osoby)", "Vplyv alkoholu (osoby)", "Vplyv drog (osoby)"],
    featuresTitles=["Počet zistených trestných činov", "Počet objasnených trestných činov", "Spôsobená škoda v tisíc €", "Počet dodatočne objasnených tresných činov", "Počet trestných činov s vplyvom alkoholu", "Počet trestných činov s vplyvom drog", "Počet trestných činov s maloletým páchateľom", "Počet trestných činov s mladistvým páchateľom", "Počet páchateľov", "Počet maloletých páchateľov", "Počet mladistvých páchateľov", "Počet páchateľov pod vplyvom alkoholu", "Počet páchateľov pod vplyvom drog"],
    featuresSet = d3.set(features),
    ratioFeatures=["Objasnenosť (%)","Vplyv alkoholu (%)","Vplyv drog (%)","Maloletý páchateľ (%)","Mladistvý páchateľ (%)"],
    ratioFeaturesTitles=["Objasnenosť (%)","Vplyv alkoholu (%)","Vplyv drog (%)","Maloletý páchateľ (%)","Mladistvý páchateľ (%)"],
    ratioFeaturesSet = d3.set(ratioFeatures),
    types=["Vraždy", "Lúpeže", "Násilie na verej. činit.", "Úmyslené ublíženie na zdr.", "Organizovaný zločin", "Iná násilná", "Znásilnenie", "Pohlavné zneužívanie", "Obchodovanie s ľuďmi", "Iná mravnostná", "Krádeže vlámaním", "Krádeže ostatné", "Ostatné majetkové", "Výtržníctvo", "Požiare a výbuchy", "Drogy", "Nedovolené ozbrojovanie", "Iná ostatná", "Dopravné nehody cestné", "Ohroz. pod vplyvom", "Vojenské a proti rep.", "Iná zostávajúca", "Skrátenie dane", "Krádež", "Ochrana meny", "Ohroz. devízového hospod.", "Korupcia", "Sprenevera", "Podvod", "Poruš.autorských práv", "Iná ekonomická"],
    typeGroups=["Násilná", "Organizovaný zločin", "Mravnostná", "Majetková", "Ostatná", "Zostávajúca", "Ekonomická"],
    years=["2010", "2012", "2007", "2013", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2009", "2011", "2008"],
    regions=["BL", "TT", "TN", "NR", "ZA", "BB", "PO", "KE"],
    chartTitles={"map-chart":"Kraje","sunburst":"Typy kriminality","barsy":"Roky","featureCharts":"Veličiny"},
    regionsNames={"BL":"Bratislavský", 
                  "TT": "Trnavský", 
                  "TN": "Trenčiansky", 
                  "NR":"Nitriansky",
                  "ZA":"Žilinský", 
                  "BB":"Banskobystrický", 
                  "PO":"Prešovský", 
                  "KE":"Košický"},
    dataFile=(typeof DJANGO_STATIC_URL === 'undefined'?"":DJANGO_STATIC_URL)+"podla_druhucsv_3dimTypeHierarchy.csv",
    population ={
        "SR":{"1997":5387650,"1998":5393382,"1999":5398657,"2000":5402547,"2001":5378951,"2002":5379161,"2003":5380053,"2004":5384822,"2005":5389180,"2006":5393637,"2007":5400998,"2008":5412254,"2009":5424925,"2010":5435273,"2011":5404322,"2012":5410836,"2013":5415949},
        "BL":{"1997":618673,"1998":617599,"1999":616982,"2000":617049,"2001":599042,"2002":599736,"2003":599787,"2004":601132,"2005":603699,"2006":606753,"2007":610850,"2008":616578,"2009":622706,"2010":628686,"2011":606537,"2012":612682,"2013":618380},
        "TT":{"1997":549621,"1998":550652,"1999":551287,"2000":551441,"2001":550918,"2002":550911,"2003":552014,"2004":553198,"2005":554172,"2006":555075,"2007":557151,"2008":559934,"2009":561525,"2010":563081,"2011":555509,"2012":556577,"2013":557608},
        "TN":{"1997":610349,"1998":609739,"1999":609288,"2000":608786,"2001":604917,"2002":603494,"2003":602166,"2004":601392,"2005":600386,"2006":599847,"2007":599831,"2008":599859,"2009":599214,"2010":598819,"2011":594186,"2012":593159,"2013":592394},
        "NR":{"1997":717241,"1998":716560,"1999":715841,"2000":714602,"2001":712312,"2002":711002,"2003":709752,"2004":709350,"2005":708498,"2006":707305,"2007":706758,"2008":706375,"2009":705661,"2010":704752,"2011":689564,"2012":688400,"2013":686662},
        "ZA":{"1997":689504,"1998":691201,"1999":692582,"2000":693853,"2001":692434,"2002":693041,"2003":693499,"2004":694129,"2005":694763,"2006":695326,"2007":695698,"2008":696347,"2009":697502,"2010":698274,"2011":689601,"2012":690121,"2013":690420},
        "BB":{"1997":663845,"1998":663492,"1999":662932,"2000":662077,"2001":661343,"2002":660110,"2003":658953,"2004":658368,"2005":657119,"2006":655762,"2007":654668,"2008":653697,"2009":653186,"2010":652218,"2011":660128,"2012":658490,"2013":656813},
        "PO":{"1997":777301,"1998":780875,"1999":784451,"2000":787483,"2001":791335,"2002":793182,"2003":794814,"2004":796745,"2005":798596,"2006":800483,"2007":801939,"2008":803955,"2009":807011,"2010":809443,"2011":815806,"2012":817382,"2013":818916},
        "KE":{"1997":761116,"1998":763264,"1999":765294,"2000":767256,"2001":766650,"2002":767685,"2003":769068,"2004":770508,"2005":771947,"2006":773086,"2007":774103,"2008":775509,"2009":778120,"2010":780000,"2011":792991,"2012":794025,"2013":794756}
    },
    records,all,charts,formatNumber= d3.format(",d"),    
    fp = fileProgress({dataFile: dataFile}),
    featureSelection,
    pids = 0,
    colors = d3.scale.category20(),
    colorsDefined = ["#A8B4FF","#6CF2FF","#E8DE6B","#D48AE8","#6DCC82","#FFCC6C","#E86C62"];
    coloring = function(d){
        return d3.rgb(colorsDefined[d]);//d3.rgb(colors(d));
    };
    
    var absoluteElement;
    
    
    function featureTitleSelection(){
        if(featuresSet.has(featureSelection())){
            var currentTitle = featuresTitles[features.indexOf(featureSelection())];
            if(indexingSelection()==="index"){
                currentTitle = currentTitle + " na 1000 obyvateľov za rok";
            }
            return currentTitle;
        }else{
            return ratioFeaturesTitles[ratioFeatures.indexOf(featureSelection())];
        }
    }
    
    function indexingSelection(){
        return absoluteElement.classed("active")?"absolute":"index";
    }
    
    function formatter(feature){
        if(featuresSet.has(feature)){
            if(indexingSelection()==="absolute"){
                return normalFormat;
            }else{
                return decimalFormat;
            }
        }if(ratioFeaturesSet.has(feature)){
            return percentFormat;
        }
    }
    
    var Counter = function(){};
    Counter.prototype.keys=function(){
        var tmpArr = [];
        var keys = d3.keys(this);
        for(var i=0;i<keys.length;i++){
            if(this[keys[i]]>0){
                tmpArr.push(keys[i]);
            }
        }
        return tmpArr;
    };
    
d3.tsv(dataFile).on("progress",fp.onProgress).on("load",onLoadWithDelay).on("error", fp.onError).get();

function onLoadWithDelay(data){
    fp.tr({value:1,total:1,text:"Inicializujem"});
    setTimeout(function() { onLoad(data); }, 50);
}

function onLoad(data){
    
   var typeHierarchyStruct = {};
    
    data.forEach(function(d, i) {
        
        d.index = i;
        
        d.region = +d.region;
        d.reg = regions[d.region];
        
        d.yeari = +d.year;
        d.year = +years[+d.year];
        
        d.type = +d.type;
        d.typ = types[d.type];
        
        d.typeGroup = +d.typeGroup;
        d.typg = typeGroups[d.typeGroup];
        
        typeHierarchyStruct[d.type] = d.typeGroup;

        for (var j = 0; j < features.length; j++) { 
               d[features[j]] = +d["value"+j] | 0;
               delete d["value"+j];
        }
        
    });
    
    function initialization() {
        function computePop(p){
            if(!p.needToComputePop){
                return p.pop;
            }else{
                var years = p.years.keys();
                var regs = p.regs.keys();
                var popu = 0;
                for(var y = 0; y < years.length; y++){
                    for(var r = 0; r < regs.length; r++){
                        popu+= population[regs[r]][years[y]];
                    }
                }
                p.pop=popu;
                p.needToComputePop = false;
                return popu;
            }
        }
        function divideDelimit(numerator,denominator){
            if(denominator===0){
                return +(numerator>0);
            }
            return numerator/denominator;
        }
        var p = {
            getIndex : function(feature){
                return +p[feature]/computePop(p)*1000;
            },
            id:pids++,
            regs: new Counter(),
            types: new Counter(),
            typeGroups: new Counter(),
            years: new Counter(),
            needToComputePop:false,
            hasChanged:false,
            pop:0,
                        
            getFeature:function(feature){
                if(featuresSet.has(feature)){
                    return p[feature];
                }else if(ratioFeaturesSet.has(feature)){
                    return p[feature]();
                }else{
                    return p.getIndex(feature.replace(" index",""));
                }
            },
            getFeatureByIndexing:function(feature){
                if(featuresSet.has(feature)){
                    if(indexingSelection()==="absolute"){
                        return p[feature];
                    }else{
                        return p.getIndex(feature.replace(" index",""));
                    }
                }if(ratioFeaturesSet.has(feature)){
                    return p[feature]();
                }
            },
            getByPositions:function(positions){
                var retArr = [];
                for(var i=0;i<positions.length;i++){
                    retArr.push({key:features[positions[i]],value:p.getFeatureByIndexing(features[positions[i]])});
                }
                return retArr;
            },
            
            getByPositionsRatios:function(positions){
                var retArr = [];
                for(var i=0;i<positions.length;i++){
                    retArr.push({key:ratioFeatures[positions[i]],value:p[ratioFeatures[positions[i]]]()});
                }
                return retArr;
            },
            
            getRatios: function(){
                var tmparr = [];
                for (var f=0;f<ratioFeatures.length;f++){
                    tmparr.push({key:ratioFeatures[f],value:p[ratioFeatures[f]]()});
                }
                return tmparr;
            }
            
           
        };
        var j;
        for (j = 0; j < features.length; j++) { 
            p[features[j]]=0;
        }
        
        for (j = 0; j < types.length; j++) { 
            p.types[j]=0;
        }
        for (j = 0; j < regions.length; j++) { 
            p.regs[regions[j]]=0;
        }
        for (j = 0; j < years.length; j++) { 
            p.years[years[j]]=0;
        }
        for (j = 0; j < typeGroups.length; j++) { 
            p.typeGroups[j]=0;
        }
        
        p["Objasnenosť (%)"] = function(){
            return divideDelimit((p["Objasnené činy"]+p["Dodatočne objasnené činy"]),p["Zistené činy"]);
        };
        p["Vplyv alkoholu (%)"] = function(){
            return divideDelimit(p["Vplyv alkoholu (činy)"],(p["Objasnené činy"]+p["Dodatočne objasnené činy"]));
        };
        p["Vplyv drog (%)"]  = function(){
            return divideDelimit(p["Vplyv drog (činy)"],(p["Objasnené činy"]+p["Dodatočne objasnené činy"]));
        };
        p["Maloletý páchateľ (%)"] = function(){
            return divideDelimit(p["Maloletý páchateľ (činy)"],(p["Objasnené činy"]+p["Dodatočne objasnené činy"]));
        };
        p["Mladistvý páchateľ (%)"] = function(){
            return divideDelimit(p["Mladistvý páchateľ (činy)"],(p["Objasnené činy"]+p["Dodatočne objasnené činy"]));
        };
        
        return p;
    }
    
    function reduceAdd (){
        return function (p, v) {
            for (var j = 0; j < features.length; j++) { 
                p[features[j]]+=v[features[j]];
            }
            p.needToComputePop = true;
            p.regs[v.reg]++;
            p.years[v.year]++;
            p.types[v.type]++;
            p.typeGroups[v.typeGroup]++;
            return p;
        };
    }
    function reduceRemove() {
        return function (p, v) {
            for (var j = 0; j < features.length; j++) { 
                p[features[j]]-=v[features[j]];
            }
            p.needToComputePop = true;
            p.hasChanged=true;
            p.regs[v.reg]--;
            p.years[v.year]--;
            p.types[v.type]--;
            p.typeGroups[v.typeGroup]--;
            return p;
        };    
    }

    var records = crossfilter(data),
    all = records.groupAll().reduce(reduceAdd(),reduceRemove(),initialization).value();
    
    var yearDim= records.dimension(function(d) {return d.yeari;}); 
    var typeDim = records.dimension(function(d) {return d.type;}); 
    var typeGroupDim = records.dimension(function(d) {return d.typeGroup;});
    var regionDim = records.dimension(function(d) {return d.region;});
    
    var yearGroup = yearDim.group().reduce(reduceAdd(),reduceRemove(),initialization);
    var typesGroup = typeDim.group().reduce(reduceAdd(),reduceRemove(),initialization);
    var regionGroup = regionDim.group().reduce(reduceAdd(),reduceRemove(),initialization);
    var typeGroupsGroup = typeGroupDim.group().reduce(reduceAdd(),reduceRemove(),initialization);
    

    var indexingComponentVar = indexingComponent(renderAll)
                                .indexingSelection(indexingSelection);
                        
    absoluteElement = d3.select("label.active");

    var featureChartsVar = featureCharts(600,300)
                .group(all)
                .labels(features.concat(ratioFeatures))
                .renderFunction(renderAll)
                .formatter(formatter);
    
    featureSelection = featureChartsVar.feature;
    
    var titleVar = title(chartTitles)
            .group(all)
            .labelsType(types)
            .labelsRegions(regions)
            .labelsYears(years)
            .labelsTypeGroup(typeGroups)
            .regionsNames(regionsNames)
            .feature(featureSelection)
            .featureTitle(featureTitleSelection)
            .formatter(formatter)
            .indexing(indexingSelection);

    featureChartsVar.texts(titleVar.texts());
    
    var charts = [
        map(600,200)
                .all(all)
                .group(regionGroup)
                .dimension(regionDim)
                .regions(regions)
                .labels(regionsNames)
                .feature(featureSelection)
                .renderFunction(renderAll)
                .coloring(coloring)
                .formatter(formatter)
                .texts(titleVar.texts()),
        
        barsy(600,200)
                .all(all)
                .group(yearGroup)
                .dimension(yearDim)
                .labels(years)
                .feature(featureSelection)
                .renderFunction(renderAll)
                .formatter(formatter)
                .texts(titleVar.texts()),
        
        sunburst(600,200)
                .all(all)
                .group0(typeGroupsGroup)
                .group1(typesGroup)
                .dimension0(typeGroupDim)
                .dimension1(typeDim)
                .labels0(typeGroups)
                .labels1(types)
                .feature(featureSelection)
                .typeHierarchyStruct(typeHierarchyStruct)
                .renderFunction(renderAll)
                .coloring(coloring)
                .formatter(formatter)
                .texts(titleVar.texts())
        
    ];

    var chart = d3.selectAll(".chart").data(charts);

    var urlResolverVar = urlResolver()
                .components(charts.concat(indexingComponentVar,featureChartsVar));
        
    var dataDownloaderVar = dataDownloader()
                .dimension(yearDim);       
        
    function render(method) { 
        d3.select(this).call(method);
    }
    function renderAll() {
        titleVar();
        chart.each(render);
        featureChartsVar();
        urlResolverVar();
        dataDownloaderVar();
    }
   
   
    var modal = $('#myModal');
    window.interest = function(codedparams){
        modal.foundation('reveal', 'close');
        urlResolverVar.decodeUrl(codedparams)
        renderAll();
    };
    
    urlResolverVar.decodeUrl();
    renderAll();

    fp.done();

    init();
}
}

