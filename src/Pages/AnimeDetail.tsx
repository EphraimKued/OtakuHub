import { useParams } from "react-router-dom"; // Importing useParams from react-router-dom to access route parameters
import { useEffect, useState } from "react";//This is used to manage state and add side effects in the component
import { Link } from "react-router-dom"; // Importing Link to create links to other routes
export default function AnimeDetail() {
  const { id } = useParams(); //like variable id will be used to fetch the anime details based on the ID from the URL
  const [anime, setAnime] = useState<any>(null); // this state variable will hold the anime details fetched from the API
  const [recommendations, setrecommendations] = useState<any[]>([]); // State to hold recommendations, initialized as an empty array
  useEffect(() => {
    async function getAnimeDetails() {
      // GraphQL query to fetch anime details by ID
      const query = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            title {
              romaji
            }
            coverImage {
              large
            }
            description
            averageScore
            episodes
          }
        }
      `;
      const recQuery = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            recommendations {
              edges {
                node {
                  mediaRecommendation {
                   id
                   title {
                      romaji
                  }
                  coverImage {
                    large
                  }
                    averageScore
                    episodes
                }
              }
            }
          }
        }
      `;


      // Fetching data from the AniList GraphQL API
      // The fetch function is used to make a POST request to the AniList GraphQL API with the query and variables
      // This executes the GraphQL query defined above to get the anime details based on the ID passed in the URL

      // State to hold recommendations
      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query, //using the query defined above
          variables: { id: Number(id) }, // passing the id as a variable to the query
        }),
      });

      const data = await response.json(); //parse Json response 
      setAnime(data.data.Media); //stores the media data in the anine state


      const recRes = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },


        body: JSON.stringify({
          query: recQuery, //using the recommendation query defined above
          variables: { id: Number(id) }, // passing the id as a variable to the query
        }),
      });
      const recData = await recRes.json(); //parse Json response
      setrecommendations(recData.data.Media.recommendations.edges); //stores the recommendations in the recommendations state
    }
    getAnimeDetails(); // Call the function to fetch anime details
  }, [id]);

  if (!anime) return <div className="text-white text-center">Loading...</div>; // If anime data is not yet loaded, display a loading message


  return (
    <div className="p-6 text-white">
      <h1 className="text-4xl font-bold mb-4">{anime.title.romaji}</h1>
      <img src={anime.coverImage.large} alt={anime.title.romaji} className="mb-4" />
      <p className="mb-2">Score: {anime.averageScore}</p>
      <p className="mb-2">Episodes: {anime.episodes}</p>
      <p dangerouslySetInnerHTML={{ __html: anime.description }} />



      {recommendations.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-4">Recommended Anime</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((rec: any) => (

              <Link
                key={rec.node.mediaRecommendation.id} 
                 to = {`/anime/${rec.node.mediaRecommendation.id}`}
                  className="bg-gray-800 p-4 rounded-lg shadow text-white block  overflow-hidden hover:shodow-lg hover:scale-105 transition-transform duration-300"
                  >
            
              

                <img
                  src={rec.node.mediaRecommendation.coverImage.large}
                  alt={rec.node.mediaRecommendation.title.romaji}
                  className=" w-full h-48 object-cover"
                />
                < div className="p-4">
                  <h3 className="text-lg font-semibold text-black">{rec.node.mediaRecommendation.title.romaji}</h3>
                  <p className="text-sm">Score: {rec.node.mediaRecommendation.averageScore}</p>
                  <p className="text-sm">Episodes: {rec.node.mediaRecommendation.episodes}</p>
                </div>
        </Link>
            ))};

        </div>
  </div>
  )
}











    </div >
      
  );
  
}
