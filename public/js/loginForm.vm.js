var loginForm = new Vue({ 
    el : '#login-modal',
    data : {
        user : {
            email : 'me@here.com',
            password : 'dragons',
        }
    },
    created : function(){
        console.log('user ', user)
        if ( !user ){

            this.submitLoginForm().then(function(){
                window.location.pathname = '/lessons/1/overview'
            })
        }
    },
    methods : {
        submitLoginForm : function(event){
            return $.post('/login', this.user).then(function(data){
                if ( data.status === 'success' ) {
                    profileOrLogin.loggedIn = true
                    profileOrLogin.user = data.user
                    window.user = data.user
                    $('#login-modal button.close').trigger('click')
                    $(document).trigger('user-logged-in')
                }
            })
        }
    }
})
