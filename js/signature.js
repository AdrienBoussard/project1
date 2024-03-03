var signature = {
    canvas : document.getElementById("canvas"),
	ctx : canvas.getContext("2d"),
	ecriture : false,
	sourisPos : { x:0, y:0 },
	lastPos : this.sourisPos,
    // RÉCUPERATION POSITION SOURIS
    getSourisPos : function (canvasDom, sourisEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
			x : sourisEvent.clientX - rect.left,
			y : sourisEvent.clientY - rect.top
		}
	},
    // RÉCUPERATION POSITION TACTILE
    getTactilePos : function (canvasDom, tactileEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: tactileEvent.touches[0].clientX - rect.left,
            y: tactileEvent.touches[0].clientY - rect.top
        };
    },
    // ÉVÉNEMENT ÉCRITURE SOURIS
    ecritureSouris : function () {
        this.canvas.addEventListener("mousedown", function (e) {
		  signature.ecriture = true;
		  signature.lastPos = signature.getSourisPos(signature.canvas, e);
	});
        this.canvas.addEventListener("mouseup", function (e) {
            signature.ecriture = false;
	});
        this.canvas.addEventListener("mousemove", function (e) {
            signature.sourisPos = signature.getSourisPos(signature.canvas, e);
	});
    },
    // ÉVÉNEMENT ÉCRITURE TACTILE
    ecritureTactile : function () {
        this.canvas.addEventListener("touchstart", function (e) {
            signature.sourisPos = signature.getTactilePos(signature.canvas, e);
            var tactile = e.touches[0];
            var sourisEvent = new MouseEvent("mousedown", {
                clientX: tactile.clientX,
                clientY: tactile.clientY
            });
            signature.canvas.dispatchEvent(sourisEvent);
        });
        this.canvas.addEventListener("touchend", function (e) {
            var sourisEvent = new MouseEvent("mouseup", {});
            signature.canvas.dispatchEvent(sourisEvent);
        });
        this.canvas.addEventListener("touchmove", function (e) {
            var touche = e.touches[0];
            var sourisEvent = new MouseEvent("mousemove", {
                clientX: tactile.clientX,
                clientY: tactile.clientY
            });
            signature.canvas.dispatchEvent(sourisEvent);
        });
        // Empêche le défilement du site
        document.body.addEventListener("touchstart", function (e) {
            if (e.target == signature.canvas) {
                e.preventDefault();
            }
        });
        document.body.addEventListener("touchend", function (e) {
            if (e.target == signature.canvas) {
                e.preventDefault();
            }
        });
        document.body.addEventListener("touchmove", function (e) {
            if (e.target == signature.canvas) {
                e.preventDefault();
            }
        });    
    },
    // MÉTHODES CRÉATION SIGNATURE
    animation : function (callback) {
        return window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimaitonFrame ||
            function (callback) {
            window.setTimeout(callback, 1000/60);
        };
    },
    creation : function () {
        if (this.ecriture) {
            this.ctx.moveTo(this.lastPos.x, this.lastPos.y);
            this.ctx.lineTo(this.sourisPos.x, this.sourisPos.y);
            this.ctx.stroke();
            this.lastPos = this.sourisPos;
        }
    },
    loop : function () {
        var e = signature.animation();
        e(signature.loop);
        signature.creation();
    },
    // APPARITION INFORMATIONS RESERVATION TIMER
    infosReservation : function (station) {
        document.getElementById("adresse-station").textContent = station.address;
        document.getElementById("nom-prenom").textContent = sessionStorage.getItem("nom");
        document.getElementById("nom-prenom").textContent += " ";
        document.getElementById("nom-prenom").textContent += sessionStorage.getItem("prenom");
        document.getElementById("timer").style.display = "flex";
    },
    // BOUTONS EFFACER VALIDER SIGNATURE
    boutons : function () {
        document.getElementById("effacer").addEventListener("click", function (e) {
            signature.canvas.width = signature.canvas.width; // Efface la signature
         });
        document.getElementById("valider").addEventListener("click", function (e) {
            if ((document.getElementById("nom").value.lenght <= 0) || (document.getElementById("prenom").value <= 0)) {
                event.preventDefault();
                alert("Veuillez rentrer un nom et prénom.");
            }
            else {
                var station = map.infosStation;
                
                sessionStorage.setItem("station", JSON.stringify(station));
                sessionStorage.removeItem("signature");
                localStorage.setItem("nom", document.getElementById("nom").value);
                localStorage.setItem("prenom", document.getElementById("prenom").value);
                
                signature.infosReservation(station);
                document.getElementById("signature").style.display = "none";
                
                var marqueur = L.marker([map.infosStation.position.lat, station.position.lng], {icon: map.marqueurVert}).bindPopup(station.address).addTo(map.mapStations);
                timer.marqueurNum = timer.marqueurNum + 1;
                marqueur.setZIndexOffset(timer.marqueurNum);
                
                marqueur.addEventListener("click", function () {
                    sessionStorage.setItem("marqueur", JSON.stringify(station));
                    map.infos(station);
                    document.getElementById("velos-disponible").textContent = (station.available_bikes - 1) + " vélos disponibles";
                });
                
                map.infos(station);
                document.getElementById("velos-disponible").textContent = (station.available_bikes - 1) + " vélos disponibles";
                
                timer.creation();
                signature.canvas.width = signature.canvas.width; // Efface la signature
            }
        });       
    },
    // RÉAPPARITION SIGNATURE
    reprise : function () {
        if (sessionStorage.getItem("signature")) {
            document.getElementById("signature").style.display = "flex";
        }
    },
    // INITIALISATION SIGNATURE
    init : function () {
        this.loop();
        this.ecritureSouris();
        this.ecritureTactile();
        this.boutons();
        this.reprise();
    }
};
signature.init();