var compteurNodes = 0;
var compteurNodesEntree = 0;
var compteurNodesSortie = 0;
var compteurLigne = 0;
var compteurInterrupteurs = 0;
var compteurAffichages = 0;

var nodeCliquee = null;

var nodeSelectionne = null;
var curseurSuivie = false;
var idLignesDeplacees = [];
var idLignesLieesAffichage = [];

var largeurChamp = 1200;
var hauteurChamp = 500;

class node extends HTMLElement {
  constructor() {
    super();
  }
  /*exécuté quand l'élément est ajouté à la page*/
  connectedCallback() {
    var typeNode = this.parentElement.classList[0];
    this.setAttribute("type-node", typeNode);
    this.id = "node" + compteurNodes;
    compteurNodes += 1;
    
    var entrees = this.appendChild(document.createElement("div"))
    entrees.className = "entrees";
    
    if(typeNode == "interrupteur") {
      this.setAttribute("type-node", typeNode);
      var interrupteurBouton = this.appendChild(document.createElement("div"));
      interrupteurBouton.setAttribute("etat", 0);
      interrupteurBouton.classList.add("cercle");
      var barre = interrupteurBouton.appendChild(document.createElement("div"));
      barre.className =  "interrupteur-barre";
      interrupteurBouton.classList.add("interrupteur-bouton");
      interrupteurBouton.addEventListener("click", changeValeurInterrupteur);
    }
    else if(typeNode == "operateur-not"){
      var nomNode = this.appendChild(document.createElement("div"));
      nomNode.className = "nom-node";
      nomNode.appendChild(document.createTextNode("NOT"));
    }
    else if(typeNode == "operateur-and"){
      var nomNode = this.appendChild(document.createElement("div"));
      nomNode.className = "nom-node";
      nomNode.appendChild(document.createTextNode("AND"));
    }
    else if(typeNode == "operateur-or") {
      var nomNode = this.appendChild(document.createElement("div"));
      nomNode.className = "nom-node";
      nomNode.appendChild(document.createTextNode("OR"));
    }
    else if(typeNode == "affichage") {
      var affichage = this.appendChild(document.createElement("div"));
      affichage.className = "cercle signal-affichage";
      affichage.style.width = "100px";
      affichage.style.height = "100px";
      affichage.style.backgroundColor = "#29344b";
    }

    var sorties = this.appendChild(document.createElement("div"))
    sorties.className = "sorties";
    
    entrees.appendChild(document.createElement("entree-node"));
    if(typeNode == "operateur-and" || typeNode == "operateur-or"){
      entrees.appendChild(document.createElement("entree-node"));
    }
    sorties.appendChild(document.createElement("sortie-node"));
  }
}

class entreeNode extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    
    if(this.closest("signal-node").getAttribute("type-node") != "interrupteur") {
      var circle = this.appendChild(document.createElement("div"));
      circle.className = "cercle";
      circle.style.width = "50px";
      circle.style.height = "50px";
      
      circle.addEventListener("click", lierNodes);

      /*detecte un clic droit*/
      circle.addEventListener("contextmenu", lanceDelierNodes);
    }
    this.setAttribute("etat", 0);
    this.setAttribute("node-liee", "non-utilise");
    compteurNodesEntree += 1;
    this.id = "node-entree-" + compteurNodesEntree;
    
  }

  /*élément dont les modifications sont "trackées"*/
  static get observedAttributes() {
    return ["etat"];
  }

  attributeChangedCallback(nom, ancienneValeur, nouvelleValeur) {
    majSortie(this.closest("signal-node"));
  }
}

class sortieNode extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    if(this.closest("signal-node").getAttribute("type-node") == "affichage") {
    }
    else {
      var circle = this.appendChild(document.createElement("div"));
      circle.className = "cercle";
      circle.style.width = "50px";
      circle.style.height = "50px";
      circle.addEventListener("click", lierNodes);
      
      /*detecte un clic droit*/
      circle.addEventListener("contextmenu", lanceDelierNodes);
    }
    
    this.setAttribute("etat", 0);
    this.setAttribute("node-liee", "non-utilise");
    compteurNodesSortie += 1;
    this.id = "node-sortie-" + compteurNodesSortie;
    
  }
  
  static get observedAttributes() {
      return ["etat", "node-liee"];
  }
  
  attributeChangedCallback(nom, ancienneValeur, nouvelleValeur) {
    if(nom == "node-liee") {
      /*au chargement la valeur est mise à "non-utilise" car à ce moment la, executer cette fonction renvoie une erreur, cette valeur est plus tard mise à "aucune"*/
      if(this.getAttribute("node-liee") != "non-utilise" && (ancienneValeur == "non-utilise" || ancienneValeur == "aucune")) {
        var nodeLiee = document.getElementById(nouvelleValeur);
        dessineLigne(recuperePositionsEntreeEtSortie(this.getElementsByClassName("cercle")[0], nodeLiee.getElementsByClassName("cercle")[0]), this.closest("signal-node").id, nodeLiee.id,false, null);      
      }
    }
  }
}
  

class interrupteur extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.classList.add("interrupteur", "simulation-objet");
    
    var top = 10 + 150 * (compteurInterrupteurs);
    this.style.top = top + "px";
    
    this.id = "interrupteur" + compteurInterrupteurs;
    compteurInterrupteurs += 1;
    var signalNode = this.appendChild(document.createElement("signal-node"));
  }
}

class affichage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add("affichage", "simulation-objet");
    
    var top = 10 + 150 * (compteurAffichages);
    this.style.top = top + "px";
    
    this.id = "affichage" + compteurAffichages;
    compteurAffichages += 1;
    var signalNode = this.appendChild(document.createElement("signal-node"));
    
  }
}


class operateurNot extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add("operateur-not", "simulation-objet");
    var signalNode = this.appendChild(document.createElement("signal-node"));
    this.addEventListener("dblclick", lanceSuivreCurseur);
  }
}

class operateurAnd extends HTMLElement{
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add("operateur-and", "simulation-objet");
    var signalNode = this.appendChild(document.createElement("signal-node"));
    this.addEventListener("dblclick", lanceSuivreCurseur);
  }
}

class operateurOr extends HTMLElement{
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add("operateur-or", "simulation-objet");
    var signalNode = this.appendChild(document.createElement("signal-node"));
    this.addEventListener("dblclick", lanceSuivreCurseur);
  }
}

customElements.define("signal-node", node);

customElements.define("signal-interrupteur", interrupteur);
customElements.define("signal-operateur-not", operateurNot);
customElements.define("signal-operateur-and", operateurAnd);
customElements.define("signal-operateur-or", operateurOr);
customElements.define("signal-affichage", affichage);
customElements.define("entree-node", entreeNode);
customElements.define("sortie-node", sortieNode);



function changeValeurInterrupteur(evenement) {
  var objetCible = evenement.target;
  var parentObject = objetCible.closest("signal-interrupteur");
  if(objetCible.getAttribute("etat") == 0) {
    objetCible.setAttribute("etat", 1);
    var barre = parentObject.getElementsByClassName("interrupteur-barre")[0];
    barre.style.backgroundColor = "#ffe02f";
    barre.style.transform = "rotate(90deg)";
  }
  else {
    objetCible.setAttribute("etat", 0);
    var barre = parentObject.getElementsByClassName("interrupteur-barre")[0];
    barre.style.backgroundColor = "#1c2333";
    barre.style.transform = "rotate(0deg)";
  }

  parentObject.getElementsByTagName("entree-node")[0].setAttribute("etat", objetCible.getAttribute("etat"));
}


function majSortie(node) {
  /*Cette fonction est appelé au chargement de la page alors que les enfants de l'élément n'existe pas encore d'où ce test*/
  if(node.getElementsByClassName("sorties")[0].childElementCount > 0) {
    var typeNode = node.getAttribute("type-node");
    var nodeSortie = node.getElementsByTagName("sortie-node")[0];
    var valeurEntree = node.getElementsByTagName("entree-node")[0].getAttribute("etat");
    if(typeNode == "interrupteur" || typeNode == "affichage") {
      nodeSortie.setAttribute("etat", valeurEntree);
    }
    else if(typeNode == "operateur-not"){
      /*inverse le signal*/
      nodeSortie.setAttribute("etat", 1 - valeurEntree)
    }
    else if(typeNode == "operateur-and") {
      var etat = 1;
      for (var entree of node.getElementsByTagName("entree-node")) {
        if(entree.getAttribute("etat") == 0) {
          etat = 0;
        }
      }
      nodeSortie.setAttribute("etat", etat);
    }
    else if(typeNode == "operateur-or") {
      var etat = 0;
      for (var entree of node.getElementsByTagName("entree-node")) {
        if(entree.getAttribute("etat") == 1) {
          etat = 1;
        }
      }
      nodeSortie.setAttribute("etat", etat);
    }
    if(node.getAttribute("type-node") == "affichage") {
      var affichage = node.getElementsByClassName("signal-affichage")[0]; 
      affichage.setAttribute("etat", valeurEntree);
      if(valeurEntree == 1) {
        affichage.style.backgroundColor = "#ffe02f";
      }
      else {
        affichage.style.backgroundColor = "#29344b";
      }
    }

    /*transmet le signal à la node suivante*/
    var entreeNodeSuivante = document.getElementById(nodeSortie.getAttribute("node-liee"));
    if (entreeNodeSuivante != null) {
      entreeNodeSuivante.setAttribute("etat", nodeSortie.getAttribute("etat"));
    }

    /*met à jour la ligne*/
    if(nodeSortie.getAttribute("id-ligne") != null) {
      ligne = document.getElementById("ligne" + nodeSortie.getAttribute("id-ligne"));
      positions = ligne.getAttribute("positions").split(",");
      dessineLigne([[positions[0], positions[1]], [positions[2], positions[3]]], ligne.getAttribute("id-node-debut"), ligne.getAttribute("id-node-entree"), true, nodeSortie.getAttribute("id-ligne"));
    }
  }
}


function lierNodes(evenement) {
  nodeCible = evenement.target.parentElement;
  if(nodeCible.getAttribute("node-liee") == "non-utilise" || nodeCible.getAttribute("node-liee") == "aucune") {
    if(nodeCliquee == null) {
      nodeCliquee = nodeCible;
    }
    else if(nodeCible.tagName != nodeCliquee.tagName){
      nodeCliquee.setAttribute('id-ligne', compteurLigne);
      nodeCible.setAttribute('id-ligne', compteurLigne);
      
      nodeCible.setAttribute("node-liee", nodeCliquee.id);
      nodeCliquee.setAttribute("node-liee", nodeCible.id);

      if(nodeCible.parentElement.classList.contains("entrees")) {
        majSortie(nodeCliquee.closest("signal-node"));
      }
      else {
        majSortie(nodeCible.closest("signal-node"));
      }
      nodeCliquee = null;
    }
  }
}

function lanceDelierNodes(evenement) {
  /*empeche le menu du clic droit par default de s'ouvrir*/
  evenement.preventDefault();
  
  nodeCible = evenement.target.parentElement;
  if(nodeCible.getAttribute("node-liee") != "non-utilise" && nodeCible.getAttribute("node-liee") != "aucune") {
    nodeLiee = document.getElementById(nodeCible.getAttribute("node-liee"));
    delierNodes(nodeCible, nodeLiee);
  }
}

function delierNodes(node1, node2) {
  /*supprime la ligne*/
  var ligne = document.getElementById("ligne" + node1.getAttribute("id-ligne"));
  if(ligne != null) {
    /*supprime l'id de la ligne dans la liste des lignes liées aux affichages*/
    for (var i = 0; i < idLignesLieesAffichage.length; i++) {
      if(idLignesLieesAffichage[i] = ligne.id.match(/(\d+)/)[0]){
        idLignesLieesAffichage.splice(i, 1);
      }
    }
    ligne.remove();
  }
  
  if(node2 != null) {  
    if(node2.parentElement.classList.contains("entrees")) {
      node2.setAttribute("etat", 0);
    }
    else{
      node1.setAttribute("etat", 0);
    }
      
    node2.setAttribute("node-liee", "aucune");
    node2.removeAttribute("id-ligne");
    node1.setAttribute("node-liee", "aucune");
    node1.removeAttribute("id-ligne");
  }
}

function lanceSuivreCurseur(evenement) {
  curseurSuivie = true;
  if(evenement.target.parentElement.id == "champ-simulation") {
    nodeSelectionne = evenement.target;
  }
  else {
    nodeSelectionne = evenement.target.closest("signal-node").parentElement;
  }
  for (var entree of nodeSelectionne.getElementsByTagName("entree-node")) {
    if(entree.hasAttribute("id-ligne")) {
      idLignesDeplacees.push(parseInt(entree.getAttribute("id-ligne")));
    }
  }
  
  for (var sortie of nodeSelectionne.getElementsByTagName("sortie-node")) {
    if(sortie.hasAttribute("id-ligne")) {
      idLignesDeplacees.push(parseInt(sortie.getAttribute("id-ligne")));
    }
  }
}
  
function suivreCurseur(evenement) {
  if(curseurSuivie) {
    nodeSelectionne.style.top = (evenement.pageY - 400) + "px";
    nodeSelectionne.style.left = (evenement.pageX - 50) + "px";  
    
    for (var idLigne of idLignesDeplacees) {
      ligne = document.getElementById("ligne" + idLigne);
      positions = ligne.getAttribute("positions").split(",");
      idNodeDebut = ligne.getAttribute("id-node-debut");
      var idNodeEntree = ligne.getAttribute("id-node-entree");
      if(idNodeDebut == nodeSelectionne.getElementsByTagName("signal-node")[0].id) {
        var boiteNode = nodeSelectionne.getElementsByTagName("sortie-node")[0].getBoundingClientRect();
        dessineLigne([[boiteNode.left + (boiteNode.right - boiteNode.left) / 2 - 50 + window.scrollX, boiteNode.top + (boiteNode.bottom - boiteNode.top) / 2 - 400 + window.scrollY], [parseInt(positions[2]), parseInt(positions[3])]], idNodeDebut, idNodeEntree, true, idLigne);
      }
      else {
        var boiteNode = null;
        if(nodeSelectionne.getElementsByTagName("signal-node")[0].getAttribute("type-node") != "operateur-not") {
          
          for (var i = 0; i < 2; i++) {
            if(nodeSelectionne.getElementsByTagName("entree-node")[i].id == idNodeEntree) {
              boiteNode = nodeSelectionne.getElementsByTagName("entree-node")[i].getBoundingClientRect();
            }
          }
        }
        else {
          boiteNode = nodeSelectionne.getElementsByTagName("entree-node")[0].getBoundingClientRect();
        }
        
        dessineLigne([[parseInt(positions[0]), parseInt(positions[1])], [boiteNode.left + (boiteNode.right - boiteNode.left) / 2 - 50 + window.scrollX, boiteNode.top + (boiteNode.bottom - boiteNode.top) / 2 - 400 + window.scrollY]], idNodeDebut, idNodeEntree, true, idLigne);
      }
    }
  }
}

function dessineLigne(positions, idNodeDebut, idNodeEntree, remplace, idLigne) {
  var canvas = document.getElementById("champ-simulation").appendChild(document.createElement("canvas"));
  canvas.setAttribute("positions", positions);
  canvas.className = "ligne";
  if(remplace) {
    document.getElementById("ligne" + idLigne).remove();
    canvas.id = "ligne" + idLigne;
  }
  else {
    canvas.id = "ligne" + compteurLigne;
    compteurLigne += 1;
  }
  canvas.setAttribute("id-node-debut", idNodeDebut);
  canvas.setAttribute("id-node-entree", idNodeEntree);
  canvas.setAttribute("width", largeurChamp + "px");
  canvas.setAttribute("height", hauteurChamp + "px");
  
  if(document.getElementById(idNodeEntree).parentElement.parentElement.getAttribute("type-node") == "affichage" && !remplace) {
    idLignesLieesAffichage.push(compteurLigne - 1);
  }
  
  var canvas2D = canvas.getContext("2d");
  if(document.getElementById(document.getElementById(idNodeEntree).getAttribute("node-liee")).getAttribute("etat") == 1) {
    canvas2D.strokeStyle = "#ffe02f";
  }
  else {
    canvas2D.strokeStyle = "#29344b";
  }
  
  canvas2D.lineWidth = 5;
  canvas2D.beginPath();
  canvas2D.moveTo(positions[0][0], positions[0][1]);
  canvas2D.lineTo(positions[1][0], positions[1][1]);
  canvas2D.stroke();
}


function recuperePositionsEntreeEtSortie(debut, fin) {
  debutX = debut.getBoundingClientRect().left + window.pageXOffset + (debut.getBoundingClientRect().right - debut.getBoundingClientRect().left) / 2 - 50;
  debutY = debut.getBoundingClientRect().top + window.pageYOffset + (debut.getBoundingClientRect().bottom - debut.getBoundingClientRect().top) / 2 - 400;
  finX = fin.getBoundingClientRect().left + window.pageXOffset + (fin.getBoundingClientRect().right - fin.getBoundingClientRect().left) / 2 - 50;
  finY = fin.getBoundingClientRect().top + window.pageYOffset + (fin.getBoundingClientRect().bottom - fin.getBoundingClientRect().top) / 2 - 400;
  return [[debutX, debutY], [finX, finY]];
}

window.addEventListener("click", function(){
  if(curseurSuivie == true) {
    curseurSuivie = false;
    idLignesDeplacees = [];
  }
});

window.addEventListener("keydown", function(evenement) {
  if(evenement.code == "Delete") {
    if(nodeSelectionne != null) {
      for (var entree of nodeSelectionne.getElementsByTagName("entree-node")) {
        if(entree.hasAttribute("id-ligne")) {
          delierNodes(entree, document.getElementById(entree.getAttribute("node-liee")));
        }
      }
      
      for (var sortie of nodeSelectionne.getElementsByTagName("sortie-node")) {
        if(sortie.hasAttribute("id-ligne")) {
          delierNodes(sortie, document.getElementById(sortie.getAttribute("node-liee")));
        }
      }
      nodeSelectionne.remove();
      nodeSelectionne = null;
      curseurSuivie = false;
      idLignesDeplacees = [];
    }
  }
});

window.addEventListener("mousemove", suivreCurseur);

document.getElementById("entree+").addEventListener("click", function() {
  document.getElementById("champ-simulation").appendChild(document.createElement("signal-interrupteur"));
});

document.getElementById("sortie+").addEventListener("click", function() {
  document.getElementById("champ-simulation").appendChild(document.createElement("signal-affichage"));
});

document.getElementById("ajoute-not").addEventListener("click", function(){
  document.getElementById("champ-simulation").appendChild(document.createElement("signal-operateur-not"));
});

document.getElementById("ajoute-and").addEventListener("click", function(){
  document.getElementById("champ-simulation").appendChild(document.createElement("signal-operateur-and"));
});

document.getElementById("ajoute-or").addEventListener("click", function(){
  document.getElementById("champ-simulation").appendChild(document.createElement("signal-operateur-or"));
});


document.getElementById("entree-").addEventListener("click", function() {
  if(compteurInterrupteurs > 1) {
    var interrupteur = document.getElementById("interrupteur" + (compteurInterrupteurs - 1));
    compteurInterrupteurs -= 1;
    delierNodes(interrupteur.getElementsByTagName("sortie-node")[0], document.getElementById(interrupteur.getElementsByTagName("sortie-node")[0].getAttribute("node-liee")));
    interrupteur.remove();
  }
});

document.getElementById("sortie-").addEventListener("click", function() {
  if(compteurAffichages > 1) {
    var affichage = document.getElementById("affichage" + (compteurAffichages - 1));
    compteurAffichages -= 1;
    delierNodes(affichage.getElementsByTagName("entree-node")[0], document.getElementById(affichage.getElementsByTagName("entree-node")[0].getAttribute("node-liee")));
    affichage.remove();
  }
});

document.getElementById("champ-simulation").appendChild(document.createElement("signal-interrupteur"));
document.getElementById("champ-simulation").appendChild(document.createElement("signal-affichage"));


var formulaireTaillesElement = document.getElementById("formulaire-tailles");
document.getElementById("idLargeur").value = "1200";
document.getElementById("idHauteur").value = "500";

formulaireTaillesElement.addEventListener("input", function() {
  var formulaireTailles = new FormData(formulaireTaillesElement);
  var largeur = parseInt(formulaireTailles.get("largeur"));
  var hauteur = parseInt(formulaireTailles.get("hauteur"));

  var change = false;
  if(!isNaN(largeur) &&  largeur > 600) {
    largeurChamp = largeur;
    document.getElementById("champ-simulation").style.width = largeur + "px"; 
    change = true;
  }
  if(!isNaN(hauteur) &&  hauteur > 400) {
    hauteurChamp = hauteur;
    document.getElementById("champ-simulation").style.height = hauteur + "px";
    change = true;
  }

  /*met à jour les canvas et les lignes liées aux affichages(seuls élements déplacés)*/
  if(change) {
    for (var canvas of document.getElementsByTagName("canvas")) {
      canvas.style.width = largeurChamp;
      canvas.style.height = hauteurChamp;
    }

    
    for (var idLigne of idLignesLieesAffichage) {
      ligne = document.getElementById("ligne" + idLigne);
      positions = ligne.getAttribute("positions").split(",");
      boiteNode = document.getElementById(ligne.getAttribute("id-node-entree")).getBoundingClientRect();
      idNodeDebut = ligne.getAttribute("id-node-debut");
      idNodeEntree = ligne.getAttribute("id-node-entree");
      
      dessineLigne([[parseInt(positions[0]), parseInt(positions[1])], [boiteNode.left + (boiteNode.right - boiteNode.left) / 2 - 50, boiteNode.top + (boiteNode.bottom - boiteNode.top) / 2 - 400 + window.scrollY]], idNodeDebut, idNodeEntree, true, idLigne);
    }
  }
});

document.getElementById("aide-bouton").addEventListener("click", function() {
  document.getElementById("aide").style.visibility = "visible";
});

document.getElementById("fermer-aide").addEventListener("click", function() {
  document.getElementById("aide").style.visibility = "hidden";
});
