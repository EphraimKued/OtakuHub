import { FiX } from "react-icons/fi"; //importing the close icon from react-icons
//This must recieve an anime object and a function to close the modal
export default function AnimeModal({ anime, onClose }: { anime: any, onClose: () => void }) {
    if (!anime) return null;// If no anime data is provided, return null to avoid rendering the modal

    return (

        //makest the modal full screen with a semi-transparent background
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full relative max-h-[90vh] overflow-y-auto">{/* Modal content container with padding, rounded corners, and max width */}

                <button
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
                >
                    <FiX />
                </button>

                <h2 className="text-2xl font-bold mb-4">{anime.title.romaji}</h2>

                {/* Finds trailer if it exists on youtube  */}
                {anime.trailer && anime.trailer.site === "youtube" ? (
                    <div className="mb-6">
                        <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                            title="Anime Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded"
                        ></iframe>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic mb-4">No trailer available.</p>
                )}

                {/*  Cover Image and the of the Info of anime  */}
                <img
                    src={anime.coverImage.large}
                    alt={anime.title.romaji}
                    className="w-full rounded mb-4"
                />
                <p className="text-sm text-gray-700 mb-2">Score: {anime.averageScore}</p>
                <p className="text-sm text-gray-700 mb-2">Episodes: {anime.episodes}</p>
                <p
                    className="text-gray-800 text-sm"
                    dangerouslySetInnerHTML={{ __html: anime.description }}
                />
            </div>
        </div>
    );
}