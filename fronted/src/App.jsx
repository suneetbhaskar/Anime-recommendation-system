/**
 * App Component
 *
 * This is the main component of the application. It includes the SearchBar, SearchResultsList, and Data components,
 * and manages the state for search results, selected anime data, loading state, and type of recommendation.
 *
 * State Variables:
 *  - results: Array containing the search results.
 *  - data: Array containing the selected anime data.
 *  - loading: Boolean indicating the loading state.
 *  - based: String indicating the type of recommendation ("user" or "genre").
 *
 * The component uses a useRef hook to create a reference to the search bar. This reference is used to implement
 * functionality where clicking outside of the search bar hides the search results.
 *
 * The useEffect hook is used to add an event listener that hides the search results when a click is detected outside
 * the search bar. The event listener is removed when the component is unmounted.
 */

import { useEffect, useRef, useState } from "react";

import "./App.css";
import { SearchBar } from "./components/SearchBar";
import { SearchResultsList } from "./components/SearchResultsList";
import { Data } from "./components/Data"

function App() {
  const [results, setResults] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [based, setBased] = useState("user")

  const searchBarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="App">
      <div className="search-bar-container" ref={searchBarRef}>
        <SearchBar setResults={setResults} setBased={setBased} based={based} />
        {results && results.length > 0 && <SearchResultsList results={results} setData={setData} setLoading={setLoading} setResults={setResults} based={based} />}
      </div>
      <div className="data">
        {loading ? <h1 className="loader"></h1> :
          <Data data={data} />
        }
      </div>
    </div>
  );
}

export default App;
