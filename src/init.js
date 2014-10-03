/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function init(){
 $("#menu-crimemap-stat").addClass("active");
    var helpLink = "help.html";
    var links = [
            ["#about","O Aplikácii"],
            ["#data","Dáta"],
            ["#region","Kraje"],
            ["#year","Roky"],
            ["#type","Typy kriminality"],
            ["#feature","Veličiny"]
        ];
        
    var menuList = $("#menu-crimemap-list");
    var menuHelp = $("<li></li>").appendTo(menuList).addClass("has-dropdown");
        $("<a></a>").appendTo(menuHelp).html('Pomocník').attr("href",helpLink);
        
    var submenuHelp = $("<ul></ul>").appendTo(menuHelp).addClass("dropdown");
        links.forEach(function(d){
           var li = $("<li></li>").appendTo(submenuHelp);
           $("<a></a>").appendTo(li).attr("href",helpLink+d[0]).html(d[1]);
        });
        
    $(document).foundation();   
}