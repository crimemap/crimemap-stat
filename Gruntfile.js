module.exports = function(grunt) {
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean:  {
        options: {force:true},
        default: '<%=pkg.dest%>',
        deploy: '<%=pkg.deploy_folder%>'
    },

    jshint: { files: ['Gruntfile.js','<%=pkg.src%>/**/*.js'] , options: { force :true } },

    concat: {
      default: {
        files:[
            {
                src: ['node_modules/d3/d3.js',
                    'node_modules/crossfilter/crossfilter.js',
                    'node_modules/topojson/topojson.js',
                    '<%=pkg.src%>/urlResolver.js',
                    '<%=pkg.src%>/controls.js',
                    '<%=pkg.src%>/fileProgress.js',
                    '<%=pkg.src%>/indexingComponent.js',
                    '<%=pkg.src%>/title.js',
                    '<%=pkg.src%>/barsy.js',
                    '<%=pkg.src%>/featureCharts.js',
                    '<%=pkg.src%>/sunburst.js',
                    '<%=pkg.src%>/map.js',
                    '<%=pkg.src%>/<%=pkg.name%>.js'],
                dest: '<%= pkg.dest %>/<%= pkg.name %>.js'
            },

            {
                src: '<%=pkg.src%>/<%=pkg.name%>.css',
                dest: '<%=pkg.dest%>/<%=pkg.name%>.css'
            }
        ]

      }
    },

    copy: {
        default: {
            files: [
                { expand: true, flatten: true, src: 'images/*.png', dest: '<%=pkg.dest%>/images/'},
                { expand: true, flatten: true, src: ['<%=pkg.src%>/*.json','<%=pkg.src%>/*.csv'], dest: '<%=pkg.dest%>'}
            ]
        },
        deploy: {
            files: [
                {expand: true, flatten: true,
                 src: ['<%=pkg.dest%>/<%=pkg.name%>.min.*.css',
                    '<%=pkg.dest%>/<%=pkg.name%>.min.*.js',
                    '<%=pkg.dest%>/images/*',
                    '<%=pkg.dest%>/*.csv'],
                dest: '<%=pkg.deploy_folder%>/'}
             ]
        }
    },

    uglify: {
        options: { mangle: false, compress: false },
        build: {
            files: {'<%= pkg.dest %>/<%= pkg.name %>.min.js': ['<%= pkg.dest %>/<%= pkg.name %>.js']}
        }
    },

    cssmin: {
        compress: {
            files: [
                {dest: '<%=pkg.dest%>/<%=pkg.name%>.min.css', src: '<%=pkg.dest%>/<%=pkg.name%>.css'},
                {src: '../../crimemap/static/crimemap/css/main.css', dest: '<%=pkg.dest%>/main.css'}
            ]
        }
    },

    processhtml: {
        options:{
            strip: true
        },
        default: {
            files: { "<%=pkg.dest%>/<%=pkg.name%>.html": ["<%=pkg.src%>/<%=pkg.name%>.html"] }
        },
        deploy: {
            files: { "<%=pkg.html_deploy_folder%>/<%=pkg.name%>.html": ["<%=pkg.src%>/<%=pkg.name%>.html"] }
        }
    },

    ver: {
        build: {
            phases: [
                { files: ['<%=pkg.dest%>/*.min.js','<%=pkg.dest%>/*.min.css'], references: '<%=pkg.html_deploy_folder%>/<%=pkg.name%>.html'},
                { files:['<%=pkg.dest%>/*.csv'], references: ['<%=pkg.dest%>/*.js','<%=pkg.html_deploy_folder%>/<%=pkg.name%>.html']}
            ],
            versionFile: '<%=pkg.dest%>/<%=pkg.name%>-version.json'
        }
    }
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

grunt.registerTask('deploy', [], function () {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-ver');

    grunt.task.run('clean:default','jshint','concat','copy:default','uglify','cssmin',
                    'clean:deploy','processhtml:deploy','ver','copy:deploy');
});

};
