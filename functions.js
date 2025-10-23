export const generateDialogHTML = (product) => {
  return `
    <div class="product-page">
      <div class="gauche">
        <img src="${product.img}" />
      </div>
      <div class="droite">
        <div class="titre">
          <h1>${product.nom}</h1>
          <div class="last">
            <i class="fa-solid fa-star"></i>
            <p>4.5</p>
          </div>
        </div>
        
        <p class="description">
          ${product.description}
        </p>
        </div>
        <div class="prix"> ${product.prix}</div>
        <div class="footer">
          <button class="ajouter">
            <div class="icon">
             <a href="https://www.facebook.com/share/19qKLBS8qy/">
             <i class="fa-solid fa-comments-dollar"></i></div>
            <p>commander</p>
          </button>
        </div>
      </div>
    </div>
    <div class="accessoire">
      <div class="avantages">
        <div class="carte-service">
          <div class="icone">
            <i class="fa-solid fa-undo"></i>
          </div>
          <p>Retour gratuit</p>
        </div>
        <div class="carte-service">
          <div class="icone">
           <i class="fa-solid fa-truck"></i> 
          </div>
          <p>Livraison disponible</p>
        </div>
        <div class="carte-service">
          <div class="icone">
            <i class="fa-solid fa-credit-card"></i>
          </div>
          <p>Paiement à la livraison</p>
        </div>
      </div>
    </div>
    `;
};

// On crée une fonction qui va nous permettre de générer le HTML pour chaque produit
export function generateProductHTML(product) {
  return `
    <div class="img">
            <img src='${product.img}' alt="" />
            <div class="icons">
              <div class="first">
                 <i class="fa-solid fa-truck-fast"></i>
              </div>
              <div class="last">
                <i class="fa-solid fa-star"></i>
                <p>4.5</p>
              </div>
            </div>
          </div>
          <div class="text">
            <h3>${product.nom}</h3>
          </div>
          <div class="footer">
            <div class="prix">
              <p class="prix-actuel">${product.prix}</p>
            </div>
          </div>
      
    `;
}
