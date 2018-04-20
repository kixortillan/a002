module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    'public/stylesheets/app.css': 'resources/sass/app.scss'
                }
            }
        },
        shell: {
            options: {
                // Task-specific options go here.
            },
            webpack: {
                command: 'npx webpack'
            }
        },
        watch: {
            css: {
                files: 'resources/sass/*.scss',
                tasks: ['sass']
            },
            js: {
                files: 'resources/js/*.js',
                tasks: ['shell:webpack']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['watch']);
}