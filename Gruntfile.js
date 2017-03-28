module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        clean: {
            dist: 'dist/'
        },

        copy: {
            app_common: {
                expand: true,
                cwd: 'app',
                src: ['**/*', '!**/*.js'],
                dest: 'dist/app'
            },
            app_unminified: {
                expand: true,
                cwd: 'app',
                src: ['**/*.js', '!**/*_test.js'],
                dest: 'dist/app/'
            },
            server: {
                expand: true,
                cwd: 'server',
                src: ['**', '!views/**'],
                dest: 'dist/server'
            },
            server_unminified: {
                expand: true,
                cwd: 'server',
                src: ['views/**'],
                dest: 'dist/server/'
            },
            bower_copy: {
                expand: true,
                src: ['bower_components/**'],
                dest: 'dist/app/'
            },
            knexfile: {
                src: 'knexfile.js',
                dest: 'dist/knexfile.js'
            }
        },

        less: {
            unminified: {
                files: {
                    'dist/app/app.css': 'app/app.less'
                }
            }
        },

        useminPrepare: {
            html: 'dist/server/views/index.html',
            options: {
                dest: 'dist/app/',
                root: 'dist/app/'
            }
        },

        usemin: {
            html: 'dist/server/views/index.html'
        },

        express: {
            server: {
                options: {
                    script: 'dist/server/main.js',
                    port: 9999
                }
            }
        },

        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            less: {
                files: 'app/**/*.less',
                tasks: ['compile-less']
            },
            app_markup: {
                files: ['app/**/*.html'],
                tasks: [
                    'copy-app-dist'
                ]
            },
            app_code: {
                files: ['app/**/*.js'],
                tasks: [
                    'copy-app-dist'
                ]
            },
            server: {
                files: ['server/**'],
                tasks: [
                    'copy-server-dist',
                    'express'
                ]
            },
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['build-dist', 'express']
            }
        }

    });

    grunt.registerTask('copy-app-dist', 'Copy app files to dist',
    function() {
        grunt.task.run([
            'copy:app_common',
            'copy:app_unminified',
            'copy:bower_copy'
        ]);
    });

    grunt.registerTask('copy-server-dist', 'Copy server files to dist',
    function() {
        grunt.task.run('copy:server'); 
        grunt.task.run('copy:knexfile'); 
        grunt.task.run('copy:server_unminified');
    });

    grunt.registerTask('compile-less', 'Compile LESS to CSS',
    function() {
        grunt.task.run('less:unminified');
    });
    
    grunt.registerTask('build-dist', [
        'clean',
        'copy-app-dist',
        'copy-server-dist',
        'compile-less'
    ]);

    grunt.registerTask('default', [
        'build-dist',
        'express',
        'watch'
    ]);
};