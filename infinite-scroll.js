const d = document,
  $searchBar = d.getElementById("searchBar"),
  $container = d.getElementById("main-container"),
  $template = d.getElementById("template").content,
  $fragment = d.createDocumentFragment(),
  $pokemonNames = d.querySelectorAll(".pokemon-name");

let startCount = 1,
  limit = 0;

const getPokemon = async () => {
  try {
    start = limit;
    console.log("start: ", start);
    limit = start + 20;
    console.log("limit: ", limit);

    for (start; start < limit; start++) {
      let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${startCount}/`),
        json = await res.json();

      if (!res) {
        lastCardVisible.unobserve(
          document.querySelectorAll(".card:last-child")
        );
        continue;
      }
      if (!res.ok) throw { status: res.status, statusText: res.statusText };
      //console.log(json.sprites);

      $template.querySelector(".pokemon-name").textContent = json.name;
      $template
        .querySelector(".pokemon-img")
        .setAttribute("src", `${json.sprites.front_default}`);
      $template
        .querySelector(".pokemon-img")
        .setAttribute("alt", `imagen de ${json.name}`);

      //Se pasa a clonar para reusar el template
      let $clone = d.importNode($template, true); //true para que pase todo el contenido
      $fragment.appendChild($clone); // Se stackean todas las iteraciones

      startCount++;
    }

    $container.appendChild($fragment);
  } catch (err) {
    let message = err.statusText || "Ocurrió un error";
    alert(`${message} ${err.status}`);
  }
};

d.addEventListener("DOMContentLoaded", getPokemon);

d.addEventListener("click", (e) => {
  if (e.target === d.getElementById("getChildren")) {
    console.log(
      d.querySelectorAll(".card"),
      document.querySelectorAll(".card:last-child")
    );
  }
});

const lastCardVisible = new IntersectionObserver((entries) => {
  const lastCard = entries[0]; //ESTO SE HARÁ PORQUE SUPONGO QUE 'lastCardVisible' TIENE UN ARRAY DONDE TIENE A LOS ELEMENTOS QUE FUERON ÚLTIMOS EN SU MOMENTO
  if (!lastCard.isIntersecting) return; //No se hará nada hasta que aparezca la última carta

  getPokemon(); //llamando a la "API"

  //Si no se hace este paso nunca se va a actualizar la nueva última carta
  //si no se hiciera esto, la carta 40 del documento original de HTML, va a seguir añadiendo nuevas cartas SOLO CUANDO PASEMOS POR LA CARTA 40 ORIGINAL
  lastCardVisible.unobserve(lastCard.target);
  lastCardVisible.observe(document.querySelector(".card:last-child"));
});

setTimeout(() => {
  // Observe the element
  document.querySelectorAll(".card").forEach((card) => {
    lastCardVisible.observe(card);
  });
}, 1000);

d.addEventListener("keyup", (e) => {
  let regExp = new RegExp(`${$searchBar.value}`, "gi");
  if (e === "Escape") $searchBar.value = "";
  $container.querySelectorAll(".pokemon-name").forEach((el) => {
    if (!regExp.test(el.textContent))
      el.parentElement.style.setProperty("display", "none");
    else el.parentElement.style.setProperty("display", "block");
  });
});
