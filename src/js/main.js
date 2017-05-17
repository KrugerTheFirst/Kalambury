$(function(){

    $('[data-toogle-categories]').on('click', function(){
        var $this = $(this),
            $categories = $this.closest('.play').find('ul');

        $categories.toggleClass('show');
    });
});