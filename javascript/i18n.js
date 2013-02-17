window.i18n = {
    setDefault: function() {

        this.title = "SMTUC Mass Transit Density Graph";
        this.catch_phrase = "Drag the slider and check out the mass transit trips density";
        this.draw_button = "Draw it!";
    },
    setLocale: function(){
        var self = this;
        $c().services("container.getLocale", {}, function(args) {
            self.locale = args[0];
            if (self.locale=='pt') {
                self.title = "Mapa de densidade de viagens dos SMTUC";
                self.catch_phrase = "Escolha um intervalo temporal para determinar a densidade de viagens no mapa";
                self.draw_button = "Desenhar!";
            }else {
                self.setDefault();
            }
        });
    }
};
