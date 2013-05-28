/*global module:false*/
module.exports = function(grunt){

  // Project configuration.
  grunt
      .initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta : {
          banner: '/*!\n'+
          ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %>' + "\n" +
          ' <%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
          ' * ' + "\n" +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>' + "\n" +
          ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>' + "\n"+
          ' * <%= _.pluck(pkg.licenses, "url").join(", ") %>' + "\n"+
          ' * ' + "\n" +
          ' * Date: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss o") %>' + "\n" +
          ' */'
        },
        concat : {
          core : {
            src : [ '<banner:meta.banner>', 'src/**/p8core.js',
                'src/**/p8jquery.js', 'src/**/p8jquery-*.js',
                'src/**/p8webedit.js' ],
            dest : 'dist/<%= pkg.name %>-jquery.js'
          },
          jqueryui : {
            src : [ '<banner:meta.banner>', 'src/**/p8jqueryui.js',
                'src/**/p8jqueryui-*.js' ],
            dest : 'dist/<%= pkg.name %>-jqueryui.js'
          }
        },
        uglify: {
          options: {
            // the banner is inserted at the top of the output
            banner: '<banner:meta.banner>'
          },
          core: {
            files: {
              'dist/<%= pkg.name %>-jquery.min.js': ['<%= concat.core.dest %>']
            }
          },
          jqueryui: {
            files: {
              'dist/<%= pkg.name %>-jqueryui.min.js': ['<%= concat.jqueryui.dest %>']
            }
          }
        },
        qunit : {
          files : [ 'test/*.html' ]
        },
        jshint : {
          dist : {
            src : [ 'Gruntfile.js', 'src/**/*.js'],
            options : {
              curly : true,
              eqeqeq : true,
              immed : true,
              latedef : true,
              newcap : true,
              noarg : true,
              sub : true,
              undef : true,
              boss : true,
              eqnull : true,
              browser : true,
              globals : {
                jQuery : true,
                Ember : true,
                P8DS : true,
                ActiveXObject:true
              }
            }

          }
        }
      });

  grunt.loadNpmTasks("grunt-contrib-qunit");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // Default task.
  grunt.registerTask('default', [ 'jshint', 'qunit', 'concat', 'uglify' ]);
  grunt.registerTask('travis', [ 'jshint', 'qunit' ]);

};
