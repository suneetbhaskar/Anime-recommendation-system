
/**
 * SearchBar Component
 *
 * This component handles the functionality of the search bar in the application. 
 * It contains a state variable 'input' for the search input and 'radioValue' for the selected radio button value.
 * The component receives three props: 'setResults', 'setBased', and 'based'.
 *
 * It defines the function 'fetchData', which performs a fetch request to the backend API, 
 * passing the search value as a parameter. The data received from the API is used to update the 'setResults' state,
 * which triggers a re-render of the search results.
 *
 * The 'handleChange' function is called when the input value changes. It updates the 'input' state 
 * and calls the 'fetchData' function with the new input value.
 *
 * The 'base' function is called when a radio button is selected. It updates the 'radioValue' state 
 * and calls the 'setBased' function with the new radio button value depending whether user has chosen
 * User Based or Genre Based Recommendation.
 *
 * The component's render function returns a div that contains an input field for the search input 
 * and radio buttons to select the type of search.
 *
 * Props:
 *  - setResults: Function to update the search results.
 *  - setBased: Function to update the search type.
 *  - based: Current search type.
 */
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = ({ setResults, setBased, based }) => {
  const [input, setInput] = useState("");
  const [radioValue, setRadioValue] = useState("user");

  const fetchData = async (value) => {
    try {
      const response = await fetch(`http://localhost:9099/search/${value}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const result = data.anime_matches;
      
      setResults(result);
      
    } catch (error) {
      console.error('Error getting files', error.message);
    }
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  const base = (val) => {
    setRadioValue(val)
    setBased(val)
  }

  return (
    <>
    <div className="radio-wrapper">
      <div>
        <input type="radio" 
            id="option1" 
            name="radio-group"
            onChange={e => base("user")} 
            />
            
        <label htmlFor="option1">User Based</label>
      </div>
      <div>
        <input type="radio" id="option2" name="radio-group"
        onChange={e => base("genre")}/>
        <label htmlFor="option2">Genre Based</label>
      </div>
    </div>
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Search any anime..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
    </>
  );
};
