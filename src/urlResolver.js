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
function urlResolver() {
    
    var components = [],params = {};
    
    var div = d3.select("#urlResolver")
            
    var urlResolverClickable = d3.select(document.getElementById("urlResolverClickable"))
            .on("click",onUrlClick);
    
    var urlContent = d3.select(document.getElementById("urlContent"));
    
    var paramKeys = ["m","g","t","y","i","f"];
    
    function onUrlClick(){
        urlContent.node().focus();
        urlContent.node().select();
    }
     
    function simpleHash(s) {
        var hash = 0,
                strlen = s.length,
                i,
                c;
        if (strlen === 0) {
            return hash;
        }
        for (i = 0; i < strlen; i++) {
            c = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
    }
    
    function encodeParams(params){
        var sum = 0;
        paramKeys.forEach(function(d,i){
            var toSum = (+params[d])+1?+(params[d])+1:0;
            sum = sum + Math.pow(100,i) * toSum;
        });
        if(sum===0){
            return "";
        }
        var code = sum.toString(36);
        return code+"!"+simpleHash(code);
    }
    
    function decodeParams(codes){
        var params={};
        var hashPart = codes.split("!")[1];
        var code = codes.split("!")[0];
        if(!hashPart || !code || hashPart!==simpleHash(code)){
            return params;
        }
        var sum=parseInt(code,36);
        
        for(var i=0;i<paramKeys.length;i++){
            if(!sum || sum===0){
                return params;
            }
            var param = sum % 100;
            if(param){
                params[paramKeys[i]] = param-1;
            }
            sum = Math.floor(sum / 100);
        }
        return params;
    }
    
    function chart(){
        params = {};
        components.forEach(function(d){
            params= d.pushParam(params);
        });
        
        urlContent.attr("value",location.host+location.pathname+"?"+encodeParams(params));
    }
    
    chart.decodeUrl = function(_) {
        var params = {};
        if (!arguments.length){
            var search;
            if(location.search[location.search.length-1]==="/"){
                search = location.search.substr(1,location.search.length-2);
            }else{
                search= location.search.substr(1);
            }
            params = decodeParams(search);
        }else{
            params = decodeParams(_);
        }
        components.forEach(function(d){
            d.applyParam(params);
        });
    };
    
    chart.components = function(_) {
        if (!arguments.length)
            return components;
        components = _;
        return chart;
    };
    
    return chart;
    
}