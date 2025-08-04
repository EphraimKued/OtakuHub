import { Link } from "react-router-dom"; //replace <a> to link
//import{useState } from "react";  //handling jsx

//just a classic navbar component


export default function Navbar() { //component

    //const [search, setSearch] = useState("");

    //const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       //setSearch(e.target.value);
        //Calls search function here if needed


   // };

   //declaring the components

  return (

    <nav className="bg-gray-900 text-white  shadow-md"> {/*container for nav css*/}

        
      <div className="flex justify-between items-center px-7 py-10">
        <h1 className="text-6xl  font-extrabold font-mono">
          <Link to="/">AnimeRecs</Link> {/*title link to something*/}
        </h1>


        <div className="space-x-6 text-2xl font-semibold font-mono">
          <Link to="/" className="hover:text-indigo-400">Home</Link>  
          <Link to="/my-List" className="hover:text-indigo-400">My List</Link>
          <Link to="/recommendations" className="hover:text-indigo-400">Trending </Link>
          <Link to="/based-recommendations" className="hover:text-indigo-400">For You</Link>

        </div>
      </div>
    </nav>
    
  );
}
