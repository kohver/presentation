/**
 * Объект простой презентации.
 * Хочется выделить Page как отдельный объект,
 * но так как это демо, решил использовать минимум кода.
 * Проект доступен на ГитХабе https://github.com/kohver/presentation
 * @author https://github.com/kohver
 * @class
 * @property {boolean} isStaticEventsBound
 * @property {Presentation} focusedPresentation
 * @param {jQuery} $el
 */
var Presentation = function($el) {
    this.$el = $el;
    this.pages = [];
    this.pageNumber = 0;

    Presentation.focusedPresentation = this;
    Presentation.bindStaticEvents();
};

/**
 * @private
 * @type {boolean}
 */
Presentation.isStaticEventsBound = false;

/**
 * Сфокусированная презентация.
 * То есть та, которая переключается клавишами вперед-назад
 * @protected
 * @type {Presentation}
 */
Presentation.focusedPresentation = null;

/**
 * @static
 */
Presentation.bindStaticEvents = function() {
    if (this.isStaticEventsBound) {
        return;
    }

    this.isStaticEventsBound = true;
    var self = this;
    $(document).on('keydown', function(e) {
        switch (e.keyCode) {
            case KEY.RIGHT:
                self.focusedPresentation.nextPage();
                break;
            case KEY.LEFT:
                self.focusedPresentation.prevPage();
                break;
        }
    });
};

/**
 * Флаг видимости кнопок поверх презентации
 * @private
 * @type {boolean}
 */
Presentation.prototype.isActionsHidden = false;

/**
 * jQuery-объект, в котором будет отрисовываться презентация
 * @protected
 * @type {jQuery}
 */
Presentation.prototype.$el = null;

/**
 * Коллекция страниц
 * @protected
 * @type {object}
 */
Presentation.prototype.pages = null;

/**
 * Текущий номер страницы
 * @protected
 * @type {number}
 */
Presentation.prototype.pageNumber = null;

/**
 * @private
 * @type {boolean}
 */
Presentation.prototype.isEventsBound = false;

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

    this.preloadPage(this.pageNumber + 1).updateView();
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

    this.preloadPage(this.pageNumber - 1).updateView();
    return this;
};

/**
 * Инициализация обработчиков событий
 * @returns {Presentation}
 */
Presentation.prototype.bindEvents = function() {
    var self = this;

    if (this.isEventsBound) {
        return this;
    }

    this.$el.on('dblclick', function() {
        fullScreen(self.$el[0]);
    });

    this.$el.on('mousemove click', function() {
        Presentation.focusedPresentation = self;

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

    this.isEventsBound = true;
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

// Плагин для jQuery? Да легко!
(function($) {
    /**
     * @param {Object} pages
     * @returns {jQuery}
     */
    $.fn.presentation = function(pages) {
        this.presentation = new Presentation(this);
        this.presentation.setPages(pages);
        return this;
    };
})(jQuery);