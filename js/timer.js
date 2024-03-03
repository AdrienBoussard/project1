var timer = {
    minutes : 20,
    secondes : 0,
    marqueurNum : 0,
    chrono : undefined,
    // MÉTHODES CRÉATION TIMER
    creation : function () {
    this.minutes = 20;
    this.secondes = 0;
    document.getElementById("timer-minutes").textContent = this.minutes;
    document.getElementById("timer-secondes").textContent = this.secondes;
    sessionStorage.setItem("minutes", this.minutes);
    sessionStorage.setItem("secondes", this.secondes);
    this.compteur();
    },
    compteur : function () {
        this.chrono = setInterval(function () {
            if (timer.secondes === 0) {
                timer.secondes = 60;
                timer.minutes--;
                document.getElementById("timer-minutes").textContent = timer.minutes;
                sessionStorage.setItem("minutes", timer.minutes);
                sessionStorage.setItem("secondes", timer.secondes);
            }
            if (timer.minutes <= -1) {
                timer.supprimer();
            }
            timer.secondes--;
            sessionStorage.setItem("secondes", timer.secondes);
            document.getElementById("timer-secondes").textContent = timer.secondes;
        }, 1000);
    },
    // MÉTHODES SUPPRESSION RESERVATION
    supprimer : function () {
        var station = JSON.parse(sessionStorage.getItem("station"));
        
        var marqueur = L.marker([station.position.lat, station.position.lng], {icon: map.marqueurBleu}).bindPopup(station.address).addTo(map.mapStations);
        this.marqueurNum = this.marqueurNum + 1;
        marqueur.setZIndexOffset(this.marqueurNum);
        
        marqueur.addEventListener("click", function () {
            sessionStorage.setItem("marqueur", JSON.stringify(station));
            map.infos(station);
        });
        
        map.infos(station);
        
        sessionStorage.removeItem("station");
        sessionStorage.removeItem("minutes");
        sessionStorage.removeItem("secondes");
        document.getElementById("timer").style.display = "none";
        clearInterval(this.chrono);

    },
    supprimerBouton : function () { 
        document.getElementById("supprimer").addEventListener("click", function (e) {
            if (confirm( "Appuyez sur OK pour confirmer la suppression de la réservation.")) {
                timer.supprimer();
            }
        })       
    },
    // RÉCUPERATION DONNÉES TIMER RESERVATION
    reprise : function () {
        if (sessionStorage.getItem("station"))
        {
            var station = JSON.parse(sessionStorage.getItem("station"));
            
            var marqueur = L.marker([station.position.lat, station.position.lng], {icon: map.marqueurVert}).bindPopup(station.address).addTo(map.mapStations);
            this.marqueurNum = this.marqueurNum + 1;
            marqueur.setZIndexOffset(this.marqueurNum);
            
            marqueur.addEventListener("click", function () {
                sessionStorage.setItem("marqueur", JSON.stringify(station));
                map.infos(station);
                document.getElementById("velos-disponible").textContent = (station.available_bikes - 1) + " vélos disponibles";
            });
            
            document.getElementById("adresse-station").textContent = station.address;
            document.getElementById("nom-prenom").textContent = localStorage.getItem("nom");
            document.getElementById("nom-prenom").textContent += " ";
            document.getElementById("nom-prenom").textContent += localStorage.getItem("prenom");
            document.getElementById("timer").style.display = "flex";
            
            this.minutes = sessionStorage.getItem("minutes");
            this.secondes = sessionStorage.getItem("secondes");
            document.getElementById("timer-minutes").textContent = this.minutes;
            document.getElementById("timer-secondes").textContent = this.secondes;
            this.compteur();
        }
    },
    // INITIALISATION TIMER
    init : function () {
    this.supprimerBouton();
    this.reprise();
    }
};
timer.init();