// Константы всякие
var KEY = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DEL: 8,
    TAB: 9,
    RETURN: 13,
    ENTER: 13,
    ESC: 27,
    PAGEUP: 33,
    PAGEDOWN: 34,
    SPACE: 32
};

// Кроссбраузерный фулскрин
function fullScreen(el) {
    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||
                         (document.mozFullScreen || document.webkitIsFullScreen);

    if (!isInFullScreen) {
        var element = el || document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            e = element;
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }
}

// Простой шалонизатор
var Template = {
    render: function(templateName, data) {
        var template = $('#' + templateName).html();

        data = data || {};

        var html = template.replace(/{{([\s\w]+)}}/g, function() {
            var varName = $.trim(arguments[1]);
            return data[varName] || '';
        });

        return html;
    }
};

// Инициализация проекта
$('.presentation').each(function(i) {
    var pages = [];

    switch (i) {
        case 0:
            pages = [
                'http://newsbeat.ru/images/stories/Hi-Tech/apple-12.jpg',
                'http://www.blogcdn.com/www.engadget.com/media/2011/10/iphone5apple2011liveblogkeynote1347.jpg',
                'http://www.gamer.ru/system/attached_images/images/000/139/494/original/apple-tablet-keynote_163.jpg?1264635235',
                'http://deepapple.com/i/news/2012-10-b/ipadmininew_21.jpg'
            ];
            break;
        default:
            pages = [
                'http://placehold.it/750x450',
                'http://placehold.it/750x550',
                'http://placehold.it/750x650',
                'http://placehold.it/750x750',
                'http://placehold.it/750x850',
                'http://placehold.it/750x950',
                'http://placehold.it/750x1050'
            ];
            break;
    }

    var color = '#' + (i + 1) + (i + 1) + (i + 1);
    jQuery(this).presentation(pages).css('background-color', color);
});