var map = {
    mapStations : L.map("map-stations").setView([48.786763, 2.455756], 13), // Initialisation de la map 
    infosStation : undefined,
    // MARQUEURS
    marqueurBleu : L.icon({
        iconUrl: "img/marqueur-bleu.png",
        iconAnchor:   [12, 9]
    }),
    marqueurRouge : L.icon({
    iconUrl: "img/marqueur-rouge.png",
    iconAnchor:   [12, 9]
    }),
    marqueurVert : L.icon({
        iconUrl: "img/marqueur-vert.png",
        iconAnchor:   [12, 9]
            }),
    // CRÉATION MAP
    creation : function () {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: "mapbox.streets",
        }).addTo(this.mapStations);
    },
    // RÉCUPERATION NOM PRÉNOM
    repriseIdentite : function () {
        if (sessionStorage.getItem("nom")) {
            document.getElementById("nom").value = sessionStorage.getItem("nom");
        }
        else {
            document.getElementById("nom").value = localStorage.getItem("nom");
            sessionStorage.setItem("nom", document.getElementById("nom").value);
        }
        if (sessionStorage.getItem("prenom")) {
            document.getElementById("prenom").value = sessionStorage.getItem("prenom");
        }
        else {
            document.getElementById("prenom").value = localStorage.getItem("prenom");
            sessionStorage.setItem("prenom", document.getElementById("prenom").value);
        }
    },
    // PLACEMENT MARQUEURS STATION | ÉVÉNEMENT APPARATION INFORMATIONS STATION
    infos : function (station) {
        map.repriseIdentite();
        map.infosStation = station;
        sessionStorage.setItem("marqueur", JSON.stringify(station));
        document.getElementById("station-selection").style.display = "none";
        document.getElementById("station-choisi").style.display = "flex";
        document.getElementById("station-adresse").textContent = station.address;
        document.getElementById("velos-place").textContent = station.available_bike_stands + " places";
        document.getElementById("velos-disponible").textContent = station.available_bikes + " vélos disponibles";
    },
    marquer : function () {
        ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Creteil&apiKey=f5da0c92a379f84c65c97aeb0a42a1b1cfc4a6bd", function (reponse) {
            var stations = JSON.parse(reponse);
            stations.forEach(function (station) {
            if (station.available_bikes > 0) {
                var marqueur = L.marker([station.position.lat, station.position.lng], {icon: map.marqueurBleu}).bindPopup(station.address).addTo(map.mapStations);
                marqueur.addEventListener("click", function () {
                    map.infos(station);
            });
            } else {
            var marqueur = L.marker([station.position.lat, station.position.lng], {icon: map.marqueurRouge}).bindPopup(station.address).addTo(map.mapStations);
            marqueur.addEventListener("click", function () {
                    map.infos(station);
                    document.getElementById("velos-disponible").style.color = "red";
                    document.getElementById("reserver").style.display = "none";
            });
            }
        });
    })
    },
    // ÉVÉNEMENT CAPTURE NOM PRENOM
    capture : function () {
        document.addEventListener("keyup", function () {
            sessionStorage.setItem("nom", document.getElementById("nom").value);
            sessionStorage.setItem("prenom", document.getElementById("prenom").value);  
        });
    },
    // BOUTON RESERVATION STATION
    reserver : function () {
        document.getElementById("reserver").addEventListener("click", function () {
            if ((document.getElementById("nom").value.lenght <= 0) || (document.getElementById("prenom").value <= 0)) {
                event.preventDefault();
                alert("Veuillez rentrer un nom et prénom.");
            }
            else if (sessionStorage.getItem("station")) {
                event.preventDefault();
                alert("Supprimez votre précedente réservation pour continuer.");
            }
            else {
            event.preventDefault();
            document.getElementById("signature").style.display = "flex";
            window.scrollTo(0, 10000);
            sessionStorage.setItem("signature", true);
            }
        })
    },
    // RÉCUPERATION DONNÉES STATION IDENTITÉ
    reprise : function () {
        if (sessionStorage.getItem("marqueur")) {
            var station = JSON.parse(sessionStorage.getItem("marqueur"));
            this.infos(station);
            var marqueur = L.marker([station.position.lat, station.position.lng], {icon: map.marqueurBleu}).addTo(map.mapStations);
            marqueur.bindPopup(station.address).openPopup();
            if (sessionStorage.getItem("station").address === sessionStorage.getItem("marqueur").address) {
                document.getElementById("velos-disponible").textContent = (station.available_bikes - 1) + " vélos disponibles";
            }
        }
    },
    // INITIALISATION MAP
    init : function () {
        this.creation();
        this.marquer();
        this.capture();
        this.reserver();
        this.reprise();
    }
};
map.init();
                