Sel(document).on('ready', function () {
    Sel('ul').set('style', {
        backgroundColor: 'red'
    });

    console.log(Sel('ul').get('style'));
});