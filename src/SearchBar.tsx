import { useState } from "react"; //importing it 
import { fetchAnime } from "./util/fetchAnime"; //using the AnimeAPI we fetch animes
import { FiSearch,  FiLoader } from "react-icons/fi"; //finds the icon component for search
import AnimeCard from "./AnimeCard";
import AnimeModal from "./AnimeModel";





//javascript
export default function SearchBar() { //function component declared

  const [search, setSearch] = useState(""); //tracks the state of the search

  const [results, setResults] = useState<any | null>(null); //This stores the list of anime searched 

  const [loading, setLoading] = useState(false);// This state is used to track the loading status of the search operation

  const [selectedAnime, setSelectedAnime] = useState(null);




  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value); //handles the change event in the search state
    //Calls search function here if needed


  };

  //This function handles the search submit event, fetches the anime data, and updates the results state
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();//prevents the default form submission behavior
    if (search.trim()) { //checks if the search input is not empty
      setLoading(true); //sets loading to true when the search is submitted
      const anime = await fetchAnime(search); // fetches the anime data using the search term
      console.log(anime); //logs the fetched anime data to the console
      setResults(anime);  //updates the results state with the fetched anime data
      setLoading(false); //sets loading to false after the data is fetched
    }
  };

  //what will be contained within the component

  return (

    <div className="flex flex-col items-center justify-center  bg-white py-6 shadow-sm w-full"> {/*outer container for search bar*/}
      {/* Form used for searching with the variable handleSearchSubmit */}
      <form onSubmit={handleSearchSubmit} className="flex items-center w-full max-w-xl space-x-2">
        {/* Loading message displayed when loading state is true */}
        {loading && (
          <div className="mt-4 flex items-center justify-center text-indigo-600 animate-spin">
            <FiLoader className="text-3xl" />
          </div>

        )}

        {!loading && results && results.length === 0 && (
          <p className="mt-4 text-gray-500 text-lg">No anime found.</p>
        )}

        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search Anime . . ."
          className="flex-grow px-4 py-3 rounded-md border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-indigo-900 text-black text-xl font-mono font-semibold"
        /> {/*Using html and tailwindcss*/}
        {/* Search Button  created using the icon */}
        <button
          type="submit"
          className="h-12 px-6 bg-indigo-600 text-white font-semibold rounded-r-md hover:bg-indigo-700 flex items-center justify-center" >
          <FiSearch className="text-2xl" />

        </button>
      </form>


      {/* Render Results */}
      {/* If results are available, display them in a grid layout */}
      {results && (

        <div className="mt-8 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">  {/* Grid container for displaying anime results in form of cards */}
          {/* loops through the results and create a card for each anime */}
          {results.map((anime: any) => (
            <div key={anime.id} onClick={() => setSelectedAnime(anime)} className="cursor-pointer">
              <AnimeCard anime={anime} />
            </div>
          ))}

        </div>
      )}

      {/* Render Modal */}
      {selectedAnime && (
        <AnimeModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      )}

    </div>





  );
}
