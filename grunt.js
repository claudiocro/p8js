/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*!\n'+
        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> -' + "\n" +
        ' <%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        ' * ' + "\n" +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>' + "\n" +
        ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>' + "\n"+
        ' * <%= _.pluck(pkg.licenses, "url").join(", ") %>' + "\n"+
        ' * ' + "\n" +
        ' * Date: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss o") %>' + "\n" +
        ' */'
    },
    concat: {
      core: {
        src: ['<banner:meta.banner>', 'src/**/p8core.js', 'src/**/p8jquery.js','src/**/p8jquery-*.js'],
        dest: 'dist/<%= pkg.name %>-jquery.js'
      },
      jqueryui: {
        src: ['<banner:meta.banner>', 'src/**/p8jqueryui.js', 'src/**/p8jqueryui-*.js'],
        dest: 'dist/<%= pkg.name %>-jqueryui.js'
      }
    },
    min: {
      core: {
        src: ['<banner:meta.banner>', '<config:concat.core.dest>'],
        dest: 'dist/<%= pkg.name %>-jquery.min.js'
      },
      jqueryui: {
        src: ['<banner:meta.banner>', '<config:concat.jqueryui.dest>'],
        dest: 'dist/<%= pkg.name %>-jqueryui.min.js'
      }
    },
    qunit: {
      files: ['test/*.html']
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        p8ElementId: true,
        p8WidgetType: true,
        p8Cat: true,
        p8User:true,
        p8Options:true,
        ActiveXObject:true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');
  grunt.registerTask('travis', 'lint qunit');
  
};
