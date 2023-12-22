import { useEffect, useState } from "react";
import { Spotify } from "react-spotify-embed"; // Importa el componente Spotify
import { StoredPlaylist } from "../utils/database/models/Playlist";
import { Button } from "../components/Button";

export default function UserPlaylist() {
  const [playlists, setPlaylists] = useState<StoredPlaylist[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/playlists");
        const data = await response.json();

        if (response.ok) {
          setPlaylists(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-slate-800 bg-opacity-80 backdrop-blur-md items-start justify-center">
      <div className="text-center flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-white m-10">
          Tus playlists
        </h1>
        <div className="flex flex-wrap justify-center gap-6 pb-10">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-item flex-shrink-0">
              <Button
                onPress={() => {
                  setOpen((o) => !o);
                }}
              >
                Mostrar
              </Button>
              {open && playlist.url && <Spotify link={playlist.url}></Spotify>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
