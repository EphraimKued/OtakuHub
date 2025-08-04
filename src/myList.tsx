import { useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // For notifications


export default function MyList() {
  const [myList, setMyList] = useState<any[]>([]); // Initialize myList as an empty array

  const [sortOption, setSortOption] = useState("title"); // State to manage sorting option


 useEffect(() => {
  async function fetchMyList() {
    try {
      const response = await fetch("http://127.0.0.1:5000/anime-list");
      if (!response.ok) throw new Error("Failed to fetch list");

      const data = await response.json();
      setMyList(data); // Set state with data from backend
    } catch (err) {
      console.error("Error fetching list:", err);
    }
  }

  fetchMyList();
}, []);


  // Function to handle removing an anime from the list
  // This function will be called when the user clicks the "Remove from List" button
 const handleRemove = async (id: number) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/anime-list", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error("Failed to remove anime");

    // Update UI after successful removal
    const updatedList = myList.filter((item) => item.id !== id);
    setMyList(updatedList);
  } catch (err) {
    console.error("Error removing anime:", err);
  }
};


const handleClearAll = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/anime-list", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clearAll: true }), // We use this flag to tell Flask
    });
    if (!response.ok) throw new Error("Failed to clear list");
    setMyList([]); // Clear the UI list
  } catch (err) {
    console.error("Error clearing list:", err);
    toast.error("Could not clear list.");
  }
};







  return (






    <div className="w-full max-w-7xl mx-auto px-4 bg-gray-950 rounded shadow mt-10">
      <h1 className="text-3xl font-extrabold mb-8 text-white font-mono">My Anime List: </h1>

      <button
        onClick={handleClearAll}
        className="bg-amber-400 text-black px-4 py-2 rounded hover:bg-red-700 text-sm font-semibold"
      >
        Clear All
      </button>

      {
          myList.length === 0 ? (
            <p className="text-gray-600">No anime saved to your list.</p>
          ) : (
            <>
              {/* Sorting Dropdown */}
              <div className="flex justify-end mb-4">
                <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border rounded-md text-sm font-medium bg-amber-400"
        >
          <option value="title">Title A-Z</option>
          <option value="score">Score High-Low</option>
          <option value="episodes">Episodes High-Low</option>
        </select>
      </div>

      {/* Sorted Anime List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...myList]
          .sort((a, b) => {
            if (sortOption === "title") {
              return a.title.romaji.localeCompare(b.title.romaji);
            } else if (sortOption === "score") {
              return (b.averageScore || 0) - (a.averageScore || 0);
            } else if (sortOption === "episodes") {
              return (b.episodes || 0) - (a.episodes || 0);
            }
            return 0;
          })
          .map((anime) => (
            <div
              key={anime.id}
              className="bg-gray-100 p-4 rounded shadow hover:shadow-lg transition"
            >
              <img
                src={anime.coverImage.large}
                alt={anime.title.romaji}
                className="rounded w-full h-50 object-cover "
              />
              <h2 className="text-xl font-bold mt-2">{anime.title.romaji}</h2>
              <p className="text-sm text-gray-600">Episodes: {anime.episodes}</p>
              <p className="text-sm text-gray-600">Score: {anime.averageScore}</p>

              <button
                onClick={() => handleRemove(anime.id)}
                className="mt-3 w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm font-semibold"
              >
                Remove from List
              </button>
            </div>
          ))}
      </div>
    </>
  )
  }
        </div >




    );
}
