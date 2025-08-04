import { useEffect, useState } from "react";
import AnimeCard from "./AnimeCard"; // Reuse your existing card component
//import{Link} from 'react-router-dom';
import AnimeModal from "./AnimeModel";


// Import Link for navigation
export default function Recommendations() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
//this is the query to fetch trending anime from AniList with the the data we called 
  const trendingQuery = `
    query($page: Int) {
      Page(page: $page, perPage: 9) {
        media(sort: TRENDING_DESC, type: ANIME) {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          averageScore
          episodes
          description
          trailer {
            id
            site
          }
        }
      }
    }
  `;
//this post a request to the AniList API to fetch the trending anime data stated within the sql query
  useEffect(() => {
    async function fetchTrendingAnime() {
      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: trendingQuery,
          variables: { page: pageNumber},
        }),
      });

      const data = await response.json();
      setAnimeList(data.data.Page.media);
      setLoading(false);
    }

    fetchTrendingAnime();
  }, [pageNumber]);

  if (loading) return <div className="text-white p-6">Loading...</div>; //shown while data is being fetched

  return (
    //this is the main container for the trending anime section which incluedes css for styling
    <div className="p-6 text-white justify-center">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Trending</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 ">
        {animeList.map((anime: any) => (
          <div
         key={anime.id} 
         onClick={() => setSelectedAnime(anime)}
         className="block hover:scale-105 transition-transform duration-300">

            <AnimeCard 
            anime={anime} 
            onClick={() => setSelectedAnime(anime)}
            />
          </div>

        ))}
      </div>
   

        {/* Pagination Buttons */}
        {/* This section used to make pages previous and next */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
          className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPageNumber((prev) => prev + 1)}
          className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
        >
          Next
        </button>
      </div>

      {/* Anime Modal shows the close up of the anime for more details */}
      {selectedAnime && (
        <AnimeModal
          anime={selectedAnime}
          onClose={() => setSelectedAnime(null)}
        />
      )}
    </div>
  );
}
