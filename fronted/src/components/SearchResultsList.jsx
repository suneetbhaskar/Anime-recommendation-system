
/**
 * SearchResultsList Component
 *
 * This component handles the functionality of the search results list in the application. 
 * The component receives several props: 'results', 'setData', 'setLoading', 'setResults', and 'based'.
 *
 * The 'results' prop is an array that represents the list of search results. Each element in the array 
 * is an object that contains information about a single anime.
 *
 * The component maps over the 'results' array and for each result, renders a 'SearchResult' component, 
 * passing the 'result' and the other props down to it.
 *
 * Props:
 *  - results: Array containing the search results.
 *  - setData: Function to update the displayed anime data.
 *  - setLoading: Function to update the loading state.
 *  - setResults: Function to update the search results.
 *  - based: Current search type.
 */
import "./SearchResultsList.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results, setData, setLoading, setResults, based }) => {
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <SearchResult result={result} key={id} setData={setData} setLoading={setLoading} setResults={setResults} based={based} />;
      })}
    </div>
  );
};
