import translations from "../i18n/translations.json";

import { useState, useEffect } from "react";
import FlexSearch from "flexsearch";

const index = new FlexSearch.Index({
  preset: "match",
  tokenize: "full",
  context: true,
  language: "es",
  //  encode: "advanced",
});

async function importData() {
  const data = await fetch("/api/search.json").then((response) =>
    response.json()
  );

  console.log(data);

  const keys = Object.keys(data);
  console.log(keys);
  keys.forEach(async (key) => {
    if (key !== "cnt") {
      console.log(key);
      await index.import(key, data[key] ?? null);
    }
  });

  return data.cnt;
}

export default function Search({ lang }) {
  const [posts, setPosts] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");

  const t = translations[lang];

  useEffect(() => {
    const fetchResults = async () => {
      console.log("Allá que te va");
      const fetchedPosts = await importData();
      console.log("Llegó");

      console.log("setPosts");
      setPosts(fetchedPosts);

      console.log("setSearch");
      setSearch("Cómo aprender a programar en JavaScript");
    };

    fetchResults();
  }, []);

  useEffect(() => {
    console.log("useEffect search", search);
    if ("" !== search) {
      const results = index.search(search, {
        suggest: true,
        limit: 10,
      });

      console.log(results);
      setResults(
        results.filter((r, idx) => !results.slice(idx + 1).includes(r))
      );
    } else {
      setResults([]);
    }
  }, [search]);

  return (
    <div className="grid gap-4">
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
            setSearch(ev.currentTarget.value);
          }}
        />
      </div>
      <ul>
        {results.map((resultIndex) => (
          <li key={posts[resultIndex]}>
            <a href={posts[resultIndex]}>{posts[resultIndex]}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
