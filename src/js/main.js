var Phrases = {};
var Categories = {};
var PhrasesHistory = [];

var API_URL = 'https://dopasuj.net/api';

var Game = {
    categoriesLoaded: {},
    currentPhrase: null,
    $play: null,
    $game: null,

    init: function () {
        var _ = this;
        _.$play = $('.play');
        _.$game = $('.game');
        _.getCategories();

        $('[data-toogle-categories]').on('click', function () {
            var $this = $(this),
                $categories = $this.closest('.play').find('ul');

            $categories.toggleClass('show');
        });

        $('[data-game-start]').on('click', function () {
            _.renderPhrase();
            $('body').addClass('game-started');
        });

        $('[data-game-restart]').on('click', function () {
            $('body').removeClass('game-started');
        });

        _.checkOk();
        _.checkNotOk();
    },

    runGame: function () {
        var _ = this;
        if (Object.keys(Categories).length == Object.keys(this.categoriesLoaded).length) {
            _.renderCategories();
            _.$play.find('.play-container').addClass('play-container--loaded');
        }
    },

    randomPhrase: function () {
        var _ = this;

        var i = 0;
        while (i < 1000) {
            var randomId = Math.floor(Math.random() * Object.keys(Phrases).length);
            if (Phrases[randomId] !== undefined) {
                _.currentPhrase = randomId;
                return Phrases[randomId];
            }

            ++i;
        }

        return '';
    },

    checkOk: function () {
        var _ = this;
        $('[data-phrase-ok]').on('click', function(){
            delete Phrases[_.currentPhrase];
            _.renderPhrase();
        });
    },

    checkNotOk: function () {
        var _ = this;
        $('[data-phrase-wrong]').on('click', function(){
            _.renderPhrase();
        });
    },

    renderPhrase: function () {
        var _ = this,
            phrase = _.randomPhrase();

        if(phrase.length == 0){
            return;
        }

        PhrasesHistory.push(phrase);

        _.$game.find('[data-phrase-category]').html(_.renderCategory(phrase.categoryId));
        _.$game.find('[data-phrase]').html(phrase.content);
    },

    renderCategories: function () {
        var $categories = $('[data-categories]');

        for (var categoryId in Categories) {
            var $rowCloned = this.renderCategory(categoryId);
            $categories.append('<li>'+ $rowCloned.html() + '</li>')
        }
    },

    renderCategory: function (categoryId) {
        var $row = $('<span><i class="fa" aria-hidden="true"></i> <strong></strong></span>'),
            $rowCloned = $row.clone(),
            category = Categories[categoryId];

        $rowCloned.find('i').addClass(category.icon);
        $rowCloned.find('strong').text(category.name);

        return $rowCloned;
    },

    getCategories: function () {
        var _ = this;
        $.ajax({
            'url': API_URL + '/v1/categories',
            'method': 'GET',
            'success': function (data) {
                _.getPhrases(data);
            }
        });
    },

    getPhrases: function (categories) {
        var _ = this;

        for (var categoryId in categories) {
            var category = categories[categoryId];

            Categories[category.id] = category;

            $.ajax({
                'url': API_URL + '/v1/phrases/' + category.id + '/1000',
                'method': 'GET',
                'success': function (data) {

                    for (var phraseId in data) {
                        var phrase = data[phraseId];

                        Phrases[phrase.id] = phrase;
                        _.categoriesLoaded[phrase.categoryId] = true;
                    }

                    _.runGame();
                }
            });
        }
    }
};


$(function () {
    Game.init();
});


