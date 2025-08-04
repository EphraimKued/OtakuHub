
import { useEffect, useState } from "react";
import AnimeCard from "./AnimeCard"; // Reuse your existing AnimeCard
import AnimeModal from "./AnimeModel"; // Modal to show details

export default function BasedRecommendations() { //this is the component for recommendations based on user's list
  // State to manage recommendations
  const [recommendations, setRecommendations] = useState<any[]>([]); //initial recommendations state with an empty array
  const [loading, setLoading] = useState(true); //tracks the loading state
  const [selectedAnime, setSelectedAnime] = useState<any>(null); //currently selected anime
  const [currentPage, setCurrentPage] = useState(1); //current page of recommendations

  const [savedList, setSavedList] = useState<any[]>([]);

  useEffect(() => {
  async function fetchRecommendations() {
    try {
      // Fetch saved anime list from backend
      const listResponse = await fetch("http://127.0.0.1:5000/anime-list");
      if (!listResponse.ok) throw new Error("Failed to fetch anime list");

      const savedListData = await listResponse.json();
      setSavedList(savedListData);

      // If list is empty, skip recommendations
      if (savedListData.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch recommendations from backend
      const recResponse = await fetch("http://127.0.0.1:5000/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: savedListData.map((anime: any) => anime.id) }),
      });
      if (!recResponse.ok) throw new Error("Failed to fetch recommendations");//error handles
//this will save the recommendations data to the state
      const recData = await recResponse.json();
      setRecommendations(recData);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchRecommendations();
}, []);







 // Pagination logic
  const itemsPerPage = 13; //how many items to show per page
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const displayedRecs = recommendations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //  Show a loading state while fetching recommendations
  if (loading)
    return (
      <div className="text-white text-center mt-10 text-2xl font-bold">
        Loading recommendations...
      </div>
    );

  // this is executed if the user’s list is empty
  if (!loading && savedList.length === 0)
    return (
      <div className="text-center text-white mt-20">
        <h2 className="text-3xl font-bold">Your list is empty 😢</h2>
        <p className="text-lg mt-2">Add anime to your list first to get recommendations!</p>
      </div>
    );

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        Recommendations Based on Your List
      </h1>

      {/*  Recommendations grid  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedRecs.map((anime: any) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            onClick={() => setSelectedAnime(anime)}
          />
        ))}
      </div>

      {/* Pagination css and controls */}
      {recommendations.length > itemsPerPage && (
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
            className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/*  Modal for showing detailes */}
      {selectedAnime && (
        <AnimeModal
          anime={selectedAnime}
          onClose={() => setSelectedAnime(null)}
        />
      )}
    </div>
  );
}
