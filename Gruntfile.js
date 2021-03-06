module.exports = function(grunt) {
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean:  {
        options: {force:true},
        default: '<%=pkg.dest%>'
    },

    jshint: { files: ['Gruntfile.js','<%=pkg.src%>/**/*.js'] , options: { force :true } },

    concat: {
      default: {
        files:[
            {
                src: [
                    'legacyFoundation/js/vendor/modernizr.js',
                    'legacyFoundation/js/vendor/jquery.js',
                    'legacyFoundation/js/vendor/fastclick.js',
                    'legacyFoundation/js/foundation.min.js',
                    'node_modules/d3/d3.js',
                    'node_modules/crossfilter/crossfilter.js',
                    'node_modules/topojson/build/topojson.js',
                    '<%=pkg.src%>/init.js',
                    '<%=pkg.src%>/urlResolver.js',
                    '<%=pkg.src%>/dataDownloader.js',
                    '<%=pkg.src%>/controls.js',
                    '<%=pkg.src%>/fileProgress.js',
                    '<%=pkg.src%>/indexingComponent.js',
                    '<%=pkg.src%>/title.js',
                    '<%=pkg.src%>/map.js',                    
                    '<%=pkg.src%>/barsy.js',
                    '<%=pkg.src%>/featureCharts.js',
                    '<%=pkg.src%>/sunburst.js',
                    '<%=pkg.src%>/crimemap-stat.js'],
                dest: '<%= pkg.dest %>/<%= pkg.path %>.js'
            },

            {
                src: ['<%=pkg.src%>/crimemap-stat.css',
			'legacyFoundation/css/normalize.css',
			'legacyFoundation/css/app.css'],
                dest: '<%=pkg.dest%>/<%=pkg.path%>.css'
            }
        ]

      }
    },

    copy: {
        default: {
            files: [
                { expand: true, flatten: true, src: 'images/*.png', dest: '<%=pkg.dest%>/images/'},
                { expand: true, flatten: true, src: ['<%=pkg.src%>/*.csv'], dest: '<%=pkg.dest%>'},
                { expand: true, flatten: true, src:
			[
			 'legacyFoundation/css/images/fi-link.svg',
			 'legacyFoundation/css/images/fi-download.svg',
			 'legacyFoundation/css/images/fi-database.svg',
			 'legacyFoundation/css/images/fi-social-github.svg',
			 'legacyFoundation/css/images/fi-mail.svg',
			 'legacyFoundation/css/images/fi-lightbulb.svg'
			], 
			dest: '<%=pkg.dest%>/images/' }
            ]
        }
    },

    uglify: {
        options: { mangle: false, compress: false },
        build: {
            files: {'<%= pkg.dest %>/<%= pkg.path %>.min.js': ['<%= pkg.dest %>/<%= pkg.path %>.js']}
        }
    },

    cssmin: {
        compress: {
            files: [
                {dest: '<%=pkg.dest%>/<%=pkg.path%>.min.css', src: '<%=pkg.dest%>/<%=pkg.path%>.css'}
            ]
        }
    },

    processhtml: {
        options:{
            strip: true
        },
        default: {
            files: [
             { src: "<%=pkg.src%>/crimemap-stat.html", dest : "<%=pkg.dest%>/index.html" },
             { src: "<%=pkg.src%>/help.html", dest : "<%=pkg.dest%>/help.html" },
             { src: "<%=pkg.src%>/about.html", dest : "<%=pkg.dest%>/about.html" }
            ]
        }
    },
    
    
//    ,
//
//    ver: {
//        build: {
//            phases: [
//                { files: ['<%=pkg.dest%>/*.min.js','<%=pkg.dest%>/*.min.css'], references: '<%=pkg.html_deploy_folder%>/<%=pkg.name%>.html'},
//                { files:['<%=pkg.dest%>/*.csv'], references: ['<%=pkg.dest%>/*.js','<%=pkg.html_deploy_folder%>/<%=pkg.name%>.html']}
//            ],
//            versionFile: '<%=pkg.dest%>/<%=pkg.name%>-version.json'
//        }
//    }
});

grunt.registerTask('default', [], function () {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.task.run('clean:default','jshint','concat','copy:default','uglify','cssmin','processhtml:default');
});

};
