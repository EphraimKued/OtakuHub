
// This file is part of the Anilist API project.
//This runs a GraphQL query to fetch anime data from Anilist based on a search term.
const query = `
  query ($search: String) {
  # GraphQL query to fetch anime data from Anilist with 10 results per page
  Page(perPage: 10){
    media(search: $search, type: ANIME) { 
        id
         title { 
            romaji #gets the romaji title of the anime
        }
        coverImage { #gets the cover image of the anime
            large
        }
        description(asHtml: false) #gets the description of the anime in plain text
        averageScore
         episodes
        
         trailer{
         id
         site
       }
    }
}
}
`;
// This function fetches anime data from Anilist based on a search term using the GraphQL query defined above.
export async function fetchAnime(search: string) { // Function to fetch anime data from Anilist based on search term
    const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query,
            variables: { search },
        }),
    });

    const data = await response.json();
    return data.data.Page.media;
}
