import { StoredPlaylist } from "../../utils/database/models/Playlist";
import { fetcherMap } from "../../utils/swr";
import { Button } from "../Button";
import { Card } from "../Card";
import { Spinner } from "../Spinner";
import Image from "next/image";
import spotifyLogo from "../../images/spotify-white.png";
import useSWR, { mutate } from "swr";
import { shortDateFormat } from "../../utils";
import { AppModal } from "../Modal";
import { useState } from "react";
import { Spotify } from "react-spotify-embed";
import Feedback from "../FeedBack";

export function PanelPlaylists() {
  const {
    data: playlists,
    isLoading,
    error,
    isValidating,
    mutate,
  } = useSWR("/api/playlists", fetcherMap);

  const [open, setOpen] = useState(false);
  const [openFeed, setOpenFeed] = useState(false);
  const [playlist, setPlaylist] = useState<StoredPlaylist | null>(null);
  console.log(playlists);

  return (
    <div>
      {isLoading && (
        <div className="w-full flex flex-col items-center justify-center text-black dark:text-white">
          <Spinner></Spinner>
          Cargando...
        </div>
      )}
      <AppModal title="Previsualizar playlist" open={open} setOpen={setOpen}>
        <Spotify link={playlist?.url!}></Spotify>
      </AppModal>
      <AppModal title="Evaluar playlist" open={openFeed} setOpen={setOpenFeed}>
        <Feedback
          playlistId={playlist?.id!}
          onFeedbackSent={() => {
            mutate();
          }}
        ></Feedback>
      </AppModal>
      {(playlists as (StoredPlaylist & { feedbacks: number })[])?.map((p) => (
        <Card
          key={p.uri}
          className="border-gray-700 bg-gray-900"
          title={p.name}
        >
          <div>Generada el día {shortDateFormat(new Date(p.date!))}</div>
          <div className="pt-4 flex">
            <a href={p.url}>
              <Button className="bg-spotify-green rounded-lg text-white flex items-center gap-x-2">
                <Image
                  src={spotifyLogo}
                  width={32}
                  height={32}
                  alt={"spotify logo"}
                ></Image>
              </Button>
            </a>
            <Button
              onPress={() => {
                setOpen(true);
                setPlaylist(p);
              }}
              className="bg-black rounded-lg text-white flex items-center gap-x-2"
            >
              Previsualizar
            </Button>
            {p.feedbacks == 0 && (
              <Button
                onPress={() => {
                  setOpenFeed(true);
                  setPlaylist(p);
                }}
                className="bg-yellow-400 rounded-lg text-black flex items-center gap-x-2"
              >
                ★ Evaluar
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
