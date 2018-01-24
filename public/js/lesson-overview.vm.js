var lessonOverview = new Vue({
    el: '#main',
    data: {
        definitions: definitions,

    },
    created: function(){
        this.definitions.forEach(function(definition){
            $(`[data-tooltip="${definition.definitionTag}"]`).attr('data-toggle', 'tooltip').attr('title', definition.definition)
        })
        $(function(){
            $('[data-toggle="tooltip"]').tooltip()
        })
    },
})
