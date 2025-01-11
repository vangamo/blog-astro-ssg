const FlexSearch = require("flexsearch");

const index = new FlexSearch.Index({
  preset: "match",
  tokenize: "full",
  context: true,
  language: "es",
  //  encode: "advanced",
});

/*
const document = new FlexSearch.Document(options);
const worker = new FlexSearch.Worker(options);

index.add(id, text);
index.search(text);
index.search(text, limit);
index.search(text, options);
index.search(text, limit, options);
index.search(options);
*/

index.add(
  "/posts/ideas-para-proyectos-personales/",
  "Ideas y sugerencias de proyectos personales Frontend"
);

index.append(
  "/posts/ideas-para-proyectos-personales/",
  `Nanas quest
Proyecto personal de Aida Narros, Adalaber
Mood for Spotify
Catch the penguin
Proyecto personal de Lupe Morales, Adalaben`
);

console.log(index.search("proyecto personal", {}));

console.log(index.search("idea", { suggest: true }));
console.log(index.search("nana", { suggest: true }));
