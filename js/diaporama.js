var diaporama = {
    images : document.getElementsByClassName("image"),
    imageNum : 0,
    etat : undefined,
    chrono: undefined,
    // MÉTHODES CONTRÔLE DIAPORAMA
    image : function() {
        this.images[this.imageNum].style.display = "flex";
    },
    suivant : function() {
        this.images[this.imageNum].style.display = "none";
        if(this.imageNum === this.images.length - 1) {
            this.imageNum = 0;
        } else {
            this.imageNum++;
        }
        this.images[this.imageNum].style.display = "flex";
        sessionStorage.setItem("diaporama", this.imageNum);
    },
    precedent : function() {
        this.images[this.imageNum].style.display = "none";
        if(this.imageNum === 0) {
            this.imageNum = this.images.length - 1;
        } else {
            this.imageNum--;
        }
        this.images[this.imageNum].style.display = "flex";
        sessionStorage.setItem("diaporama", this.imageNum);
    },
    clavier : function(e) {
        if (e.keyCode === 39) {
            this.suivant();
        } else if (e.keyCode === 37) {
            this.precedent();
        }
    },
    // MÉTHODES DÉMARRAGE ARRÊT DIAPORAMA
    play : function () {
        this.chrono = setInterval(function () {
            diaporama.suivant();
        }, 5000);
        auto.textContent = "| |";
        this.etat = "play";
    },
    pause : function () {
        clearInterval(this.chrono);
        auto.textContent = ">>";
        this.etat = "pause";
    },
    auto : function () {
        if (this.etat === "pause") {
            this.play();
            sessionStorage.setItem("auto", this.etat);
        }
        else {
            this.pause();
            sessionStorage.setItem("auto", this.etat);
        }
    },
    // REDÉMARRAGE DIAPORAMA
    reprise : function () {
        if (sessionStorage.getItem("auto") === "pause") {
        this.etat = sessionStorage.getItem("auto");
        this.pause();            
        }
        if (sessionStorage.getItem("diaporama")) {
            this.imageNum = sessionStorage.getItem("diaporama");
            this.imageNum = Number(this.imageNum);
        }
    },
    // INITIALISATION DIAPORAMA
    init : function () {
        document.getElementById("suivant").addEventListener("click", diaporama.suivant.bind(diaporama));
        document.getElementById("precedent").addEventListener("click", diaporama.precedent.bind(diaporama));
        document.addEventListener("keydown", diaporama.clavier.bind(diaporama));
        document.getElementById("auto").addEventListener("click", diaporama.auto.bind(diaporama));
        this.play();
        this.reprise();
        this.image();
    }
};
diaporama.init();

