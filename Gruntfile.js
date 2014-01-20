/*global module:false*/
module.exports = function(grunt){

  // Project configuration.
  grunt
      .initConfig({
        pkg: grunt.file.readJSON('package.json'),
        awss3: grunt.file.readJSON('aws.s3.synchronize.json'),
        meta : {
          banner: '/*!\n'+
          ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %>' + "\n" +
          ' <%= pkg.homepage ? "* " + pkg.homepage ' + "\n" + ' : "" %>' + "\n"+
          ' * ' + "\n" +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>' + "\n" +
          ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>' + "\n"+
          ' * <%= _.pluck(pkg.licenses, "url").join(", ") %>' + "\n"+
          ' * ' + "\n" +
          ' * Date: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss o") %>' + "\n" +
          ' * Git revision: <%= grunt.config.get("git-revision") %>' + "\n" +
          ' */' + "\n"
        },
        concat : {
          options: {
            // define a string to put between each file in the concatenated output
            banner: '<%= meta.banner %>',
            separator: ';'
          },
          core : {
            src : ['src/**/p8core.js',
                'src/**/p8jquery.js', 'src/**/p8jquery-*.js',
                'src/**/p8webedit.js' ],
            dest : 'dist/<%= pkg.name %>-jquery-<%= pkg.version %>.js'
          },
          jqueryui : {
            src : ['src/**/p8jqueryui.js',
                'src/**/p8jqueryui-*.js' ],
            dest : 'dist/<%= pkg.name %>-jqueryui-<%= pkg.version %>.js'
          }
        },
        uglify: {
          options: {
            preserveComments: "some"
          },
          core: {
            files: {
              'dist/<%= pkg.name %>-jquery-<%= pkg.version %>.min.js': ['<%= concat.core.dest %>']
            }
          },
          jqueryui: {
            files: {
              'dist/<%= pkg.name %>-jqueryui-<%= pkg.version %>.min.js': ['<%= concat.jqueryui.dest %>']
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
        },
        
        clean: {
          dist: {
            src: ["dist/*"]
          }
        },
        
        
        s3: {
          options: {
            key: '<%= awss3.accesskey %>',
            secret: '<%= awss3.secretkey %>',
            bucket: 'p8builds',
            access: 'public-read'
          },
          dev: {
            // These options override the defaults
            options: {
              encodePaths: true,
              maxOperations: 20
            },
            // Files to be uploaded.
            upload: [
              {
                src: 'dist/*',
                dest: 'p8js'
              }
            ]
          }
        },
        
        
        "git-rev-parse": {
          dist: {
            options: {
              prop: 'git-revision',
              number: 6
            }
          }
        }
      });

  grunt.loadNpmTasks("grunt-contrib-qunit");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-git-rev-parse');
  
  // Default task.
  grunt.registerTask('default', [ 'clean', 'jshint', 'qunit', 'git-rev-parse', 'concat', 'uglify' ]);
  grunt.registerTask('travis', [ 'clean', 'jshint', 'qunit' ]);

};
