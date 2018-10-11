module.exports = function (grunt) {

    grunt.initConfig({
        uglify: {
            options: {
                mangle: true,
                sourceMap: true
            },
            sel: {
                files: {
                    'dist/sel.min.js': ['src/sel.js']
                }
            },

            // selIE9: {
            //     files: {
            //         'dist/sel.ie9.min.js': [
            //             'src/sel.js',
            //             'src/sel.ie9.js'
            //         ]
            //     }
            // },

            // selIE8: {
            //     files: {
            //         'dist/sel.ie8.min.js': [
            //             'src/sel.js',
            //             'src/sel.ie9.js',
            //             'src/sel.ie8.js'
            //         ]
            //     }
            // }
        },
        watch: {
            scripts: {
                files: 'src/*.js',
                tasks: ['uglify'],
                options: {
                    interrupt: true,
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 4400,
                    hostname: '127.0.0.1',
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('start', ['connect', 'watch']);

};
