import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar"; // Make sure the path is correct
import SearchBar from "./SearchBar";//this is the search bar component
import MyList from "./myList";
import Recommendation from "./Recommendation";
import AnimeDetail from "./Pages/AnimeDetail";
import BasedRecommendations from "./ForYou"; // Assuming you created this
// Assuming you created this
import {Toaster} from "react-hot-toast"; // For notifications

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900">





      <Router>       {/* Navbar component */}
        <Navbar />
        <Routes> {/* Define your routes here */}
          <Route path="/" element={
            <>
              <SearchBar />

              <div className="flex flex-col items-center justify-center text-center min-h-[80vh]">
                <h2 className="animate-bounce text-9xl md:text-7xl font-extrabold text-white text-center drop-shadow-lg tracking-tight font-bubble font-mono">
                  “Explore the universe of anime, one search at a time.”

                </h2>
              </div>

            </>
          } />

          
          <Route path="/my-list" element={<MyList />} />
          <Route path="/recommendations" element={<Recommendation />} />

            <Route path ="/anime/:id" element ={<AnimeDetail />}/>
            <Route path="/based-recommendations" element={<BasedRecommendations />} />


          </Routes>
        
        
      </Router>
      <Toaster position="top-right"  /> {/* For notifications */}
    </div>
  );
};

export default App;
