import translations from "../i18n/translations.json";

import React, { useState, useEffect } from "react";
import FlexSearch from "flexsearch";

const index = new FlexSearch.Index({
  preset: "match",
  tokenize: "full",
  context: true,
  language: "es",
  //  encode: "advanced",
});

const renderDate = (completeDate) => {
  const MONTHS = {
    "01": "enero",
    "02": "febrero",
    "03": "marzo",
    "04": "abril",
    "05": "mayo",
    "06": "junio",
    "07": "julio",
    "08": "agosto",
    "09": "septiembre",
    10: "octubre",
    11: "noviembre",
    12: "diciembre",
  };
  const [date, time] = completeDate.split(" ");
  const [year, month, day] = date.split(".");

  const dayNumber = parseInt(day, 10);

  return `${dayNumber} de ${MONTHS[month]} de ${year}`;
};

const renderImgSrc = (imageData, title) => {
  if (!imageData?.url) {
    return `https://placehold.co/400x400/999999/dddddd?font=mono&text=${title.substring(0, title.indexOf(" "))}`;
  }

  return imageData.url;
};

async function importData() {
  const data = await fetch("/api/search.json").then((response) =>
    response.json()
  );

  const keys = Object.keys(data);
  keys.forEach(async (key) => {
    if (key !== "cnt") {
      await index.import(key, data[key] ?? null);
    }
  });

  return data.cnt;
}

function debounce(callback, delay = 250) {
  let timeout;

  return (...args) => {
    const later = () => {
      console.log("clearTimeout");
      clearTimeout(timeout);
      callback(...args);
    };
    console.log("setTimeout");
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

// <https://stackoverflow.com/questions/75556418/how-to-use-debounce-hooks-in-react#answer-75556865>

function useDebounce(callback, delay = 250) {
  const callbackRef = React.useRef(callback);
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  return React.useMemo(
    () => debounce((...args) => callbackRef.current(...args), delay),
    [delay]
  );
}

export default function Search({ lang }) {
  const [posts, setPosts] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");

  const t = translations[lang];

  useEffect(() => {
    const fetchResults = async () => {
      const fetchedPosts = await importData();

      setPosts(fetchedPosts);

      const queryParams = new URLSearchParams(window.location.search);
      const sanitizedSearchTerm = queryParams
        .get("s")
        .trim()
        .replace(/\s+/g, " ");

      setSearch(sanitizedSearchTerm);
    };

    fetchResults();
  }, []);

  useEffect(
    useDebounce(() => {
      console.log(search);
      if ("" !== search) {
        const results = index.search(search, {
          suggest: true,
          limit: 10,
        });

        setResults(
          results.filter((r, idx) => !results.slice(idx + 1).includes(r))
        );
      } else {
        setResults([]);
      }
    }),
    [search]
  );

  return (
    <div className="grid gap-4 mt-4">
      <div className="grid gap-2">
        <h2 className="text-2xl font-bold">{t["sidebar.Search"]}</h2>
        <div className="relative">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"></div>
          <input
            className="flex h-10 border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-lg bg-background pl-8"
            placeholder={t["sidebar.Search.placeholder"]}
            data-id="99"
            type="search"
            value={search}
            onInput={(ev) => {
              setSearch(ev.target.value);
            }}
          />
        </div>
      </div>
      {search === "" && (
        <div className="mt-4">
          <p className="mb-2">
            Prueba a escribir algo en el campo de búsqueda.
          </p>
        </div>
      )}
      {search !== "" && results.length === 0 && (
        <div className="mt-4">
          <p className="mb-2">No hemos encontrado resultados.</p>
          <p>
            Prueba con otra búsqueda o repasa los últimos artículos del{" "}
            <a href="/blog/">blog</a>.
          </p>
        </div>
      )}
      <ul className="grid gap-6 mt-4">
        {results.map((resultIndex) => {
          const content = {
            data: posts[resultIndex],
            collection: posts[resultIndex].collection,
          };
          return (
            <li className="grid md:grid-cols-[200px_1fr] gap-4">
              <img
                src={renderImgSrc(content.data.image, content.data.title)}
                alt="Blog post cover"
                width={200}
                height={150}
                className="rounded-lg object-cover"
                style={{ aspectRatio: "200/150", objectFit: "cover" }}
              />
              <div className="space-y-2">
                <a
                  href={
                    "/" + content.collection + "/" + content.data.slug + "/"
                  }
                  className="cursor-default"
                >
                  <h3 className="text-xl font-bold">{content.data.title}</h3>
                </a>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div>{content.data.author}</div>
                  <div
                    data-orientation="vertical"
                    role="none"
                    className="shrink-0 bg-border h-full w-[1px]"
                    data-id="25"
                  />
                  <div>{renderDate(content.data.date.published || content.data.date.edited)}</div>
                </div>
                <p className="text-muted-foreground line-clamp-3">
                  {content.data.brief}
                </p>
                <a
                  href={
                    "/" + content.collection + "/" + content.data.slug + "/"
                  }
                  className="text-primary font-medium hover:underline"
                >
                  Leer más
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
