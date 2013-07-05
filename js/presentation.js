/**
 * Объект простой презентации.
 * Хочется выделить Page как отдельный объект,
 * но так как это демо, решил использовать минимум кода.
 * @param {jQuery} $el
 * @constructor
 */
var Presentation = function($el) {
    this.$el = $el;
    this.pages = [];
    this.pageNumber = 0;
};

/**
 * Флаг видимости кнопок поверх презентации
 * @property
 * @private
 * @type {boolean}
 */
Presentation.prototype.isActionsHidden = false;

/**
 * jQuery-объект, в котором будет отрисовываться презентация
 * @property
 * @protected
 * @type {jQuery}
 */
Presentation.prototype.$el = null;

/**
 * Коллекция страниц
 * @property
 * @protected
 * @type {object}
 */
Presentation.prototype.pages = null;

/**
 * Текущий номер страницы
 * @property
 * @protected
 * @type {number}
 */
Presentation.prototype.pageNumber = null;

/**
 * @property
 * @private
 * @type {boolean}
 */
Presentation.prototype.isEventsBinded = false;

/**
 * Задать страницы
 * @param {object} pages
 * @returns {Presentation}
 */
Presentation.prototype.setPages = function(pages) {
    this.pages = pages || [];
    this.updateView();
    return this;
};

/**
 * В фоне загрузить картинку страницы
 * @param {number} pageNumber
 * @returns {Presentation}
 */
Presentation.prototype.preloadPage = function(pageNumber) {
    if (pageNumber >= 0 && pageNumber <= this.pages.length - 1) {
        var image = new Image();
        image.src = this.pages[pageNumber];
    }
    return this;
};

/**
 * Задать номер страницы (начианиаются с нуля)
 * @param {number} pageNumber
 * @returns {Presentation}
 */
Presentation.prototype.setPage = function(pageNumber) {
    this.pageNumber = pageNumber || 0;
    this.updateView();
    return this;
};

/**
 * Показать следующую страницу
 * @returns {Presentation}
 */
Presentation.prototype.nextPage = function() {
    this.pageNumber++;

    if (this.pageNumber > this.pages.length - 1) {
        this.pageNumber = 0;
    }

    this.preloadPage(this.pageNumber + 1);
    this.updateView();
    return this;
};

/**
 * Показать предыдущую страницу
 * @returns {Presentation}
 */
Presentation.prototype.prevPage = function() {
    this.pageNumber--;

    if (this.pageNumber < 0) {
        this.pageNumber = this.pages.length - 1;
    }

    this.preloadPage(this.pageNumber - 1);
    this.updateView();
    return this;
};

/**
 * Инициализация обработчиков событий
 * @returns {Presentation}
 */
Presentation.prototype.bindEvents = function() {
    var self = this;

    if (this.isEventsBinded) {
        return this;
    }

    this.$el.on('dblclick', function() {
        fullScreen(self.$el[0]);
    });

    this.$el.on('mousemove click', function() {
        if (self.isActionsHidden) {
            self.showActions();
        }

        self.hideActions(2000);
    });

    this.$el.on('click', '.presentation-next', function() {
        self.nextPage();
    });

    this.$el.on('click', '.presentation-prev', function() {
        self.prevPage();
    });

    this.$el.on('click', '.presentation-preview', function() {
        self.setPage($(this).data('page-number'));

        // Чтобы .presentation-footer не скрывался после нажатия :3
        self.$el.find('.presentation-footer').addClass('force-visible');
        setTimeout(function() {
            self.$el.find('.presentation-footer').removeClass('force-visible');
        }, 0);
    });

    $(document).on('keydown', function(e) {
        switch (e.keyCode) {
            case KEY.RIGHT:
                self.nextPage();
            break;
            case KEY.LEFT:
                self.prevPage();
            break;
        }
    });

    this.isEventsBinded = true;
    return this;
};

/**
 * Обновляет DOM-представление презентации
 * @returns {Presentation}
 */
Presentation.prototype.updateView = function() {
    var self = this;
    var previews = '';
    var visibleRange = 2;
    $.each(this.pages, function(pageNumber, src) {
        if (self.pageNumber - visibleRange > pageNumber || self.pageNumber + visibleRange < pageNumber) {
            return;
        }

        previews += Template.render('presentation-preview', {
            src: src,
            pageNumber: pageNumber,
            selected: self.pageNumber == pageNumber ? ' presentation-preview-selected' : ''
        });
    });

    this.$el.html(Template.render('presentation', {
        title: 'Избражение ' + (this.pageNumber + 1) + ' из ' + this.pages.length,
        src: this.pages[this.pageNumber],
        previews: previews
    }));

    this.bindEvents();
    return this;
};

/**
 * Показать кнопки
 * @returns {Presentation}
 */
Presentation.prototype.showActions = function() {
    this.$el.removeClass('presentation-hidden-actions');
    return this;
};

/**
 * Скрыть кнопки
 * @param {number} [timeout=2000]
 * @returns {Presentation}
 */
Presentation.prototype.hideActions = function(timeout) {
    if (this._timeout) {
        clearTimeout(this._timeout);
    }

    if (typeof timeout == 'undefined') {
        timeout = 2000;
    }

    var self = this;
    this._timeout = setTimeout(function() {
        self.isActionsHidden = true;
        self.$el.addClass('presentation-hidden-actions');
    }, timeout);

    return this;
};

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

function fullScreen(el) {
    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||
                         (document.mozFullScreen || document.webkitIsFullScreen);

    var element = el || document.documentElement;
    if (!isInFullScreen) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }
}