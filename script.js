const d = document,
  $searchBar = d.getElementById("searchBar"),
  $container = d.getElementById("main-container"),
  $template = d.getElementById("template").content,
  $fragment = d.createDocumentFragment(),
  $pokemonNames = d.querySelectorAll(".pokemon-name");

const getPokemon = async () => {
  try {
    for (let i = 1; i <= 15; i++) {
      let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`),
        json = await res.json();

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
    }
    $container.appendChild($fragment);
  } catch (err) {
    let message = err.statusText || "Ocurrió un error";
    alert(`${message} ${err.status}`);
  }
};

d.addEventListener("DOMContentLoaded", getPokemon);

addEventListener("keyup", (e) => {
  let regExp = new RegExp(`${$searchBar.value}`, "gi");
  if (e === "Escape") $searchBar.value = "";
  $container.querySelectorAll(".pokemon-name").forEach((el) => {
    if (!regExp.test(el.textContent))
      el.parentElement.style.setProperty("display", "none");
    else el.parentElement.style.setProperty("display", "block");
  });
});
