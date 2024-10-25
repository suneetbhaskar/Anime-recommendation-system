
/**
 * SearchResult Component
 *
 * This component handles the functionality of a single search result in the application. 
 * The component receives several props: 'result', 'setData', 'setLoading', 'setResults', and 'based'.
 *
 * The 'result' prop is an object that represents a single search result. It contains information 
 * such as the id and name of the anime.
 *
 * The 'getFiles' function is defined within the component. This function performs a fetch request to the backend API, 
 * passing the 'animeId' and the type of recommendation 'based' as parameters. The data received from the API is used 
 * to update the 'setData' state, which triggers a re-render of the data display component.
 *
 * The 'getFiles' function is called when the search result div is clicked. The div displays the name of the anime.
 *
 * Props:
 *  - result: Object containing a single search result.
 *  - setData: Function to update the displayed anime data.
 *  - setLoading: Function to update the loading state.
 *  - setResults: Function to update the search results.
 *  - based: Current search type.
 */
import "./SearchResult.css";

export const SearchResult = ({ result, setData, setLoading, setResults, based }) => {

  const getFiles = async (animeId) => {
    try {
      setLoading(true)
      setData([])
      
      const response = await fetch(`http://localhost:9099/recommend/${based}/${animeId}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // console.log(data)
      setLoading(false)
      setData(data)
      setResults([]);
      
    } catch (error) {
      console.error('Error getting files', error);
    }
  };

  return (
    <div
      className="search-result"
      onClick={() => getFiles(result.id)}
    >
      {result.name}
    </div>
  );
};
