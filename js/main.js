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

    var presentation = new Presentation(jQuery(this));
    presentation.setPages(pages);

    jQuery(this).css('background-color', '#' + (i + 1) + (i + 1) + (i + 1));
});
