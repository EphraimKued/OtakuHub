import React from "react";  
import {toast} from "react-hot-toast"; // For notifications



// src/components/AnimeCard.tsx
//type is a way to define the structure of an object in TypeScript
//Creates a type for the props that the AnimeCard component will receive
type AnimeCardProps = {
    anime: {
        id: number;
        title: { romaji: string };
        coverImage: { large: string };
        episodes: number;
        averageScore: number;
    };
    onClick?: () => void; // Function to handle click events, typically for navigation
};

//any in typescript wont check anything no errorrs etc
export default function AnimeCard({ anime, onClick }: AnimeCardProps) { //this receives an anime object as a prop
  //handles the click event for adding the anime to the user's list
  const handleAddtoList = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the click event from bubbling up to the parent elements
    e.preventDefault();// Prevents the default action of the event, which is usually navigating to a link




//this checks if the anime is already in the user's list

   
  try {
    const response = await fetch("http://127.0.0.1:5000/anime-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(anime),
    });

    if (response.ok) {
      toast.success(`${anime.title.romaji} added to your list!`);
    } else {
      const errorData = await response.json();
      toast.error(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Failed to add anime:", error);
    toast.error("Could not connect to the server. Is Flask running?");
  }
};




  return (
    //by clicking on the anime card, the user will be taken to the anime detail page
    <div onClick={onClick} className="bg-gray-800 p-4 rounded-lg shadow text-white  h-full flex flex-col hover:shadow-lg transition cursor-pointer">
      <img
        src={anime.coverImage.large}
        alt={anime.title.romaji}
        className="rounded w-full h-64 object-cover"
      />
      <h2 className="text-xl font-bold mt-2">{anime.title.romaji}</h2>
        <p className="text-sm text-gray-600">Episodes: {anime.episodes}</p>
        <p className="text-sm text-gray-600">Score: {anime.averageScore}</p>

        <button
          onClick={handleAddtoList}
          className="mt-3 w-full bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 text-sm font-semibold"
        >
          Add to My List
        </button>



      </div>
  );
}