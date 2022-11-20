import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Image from "next/image";

const Playlists = ({
  playlists,
}: {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
}) => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md h-full">
      <ul role="list" className="divide-y divide-gray-200">
        {playlists.map((playlist: SpotifyApi.PlaylistObjectSimplified) => (
          <li key={playlist.uri}>
            <Link
              href={`/playlist/${playlist.id}`}
              className="block hover:bg-gray-50"
            >
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="flex min-w-0 flex-1 items-center">
                  {playlist.images && (
                    <div className="flex-shrink-0">
                      <Image
                        className="h-12 w-12 rounded-full"
                        src={playlist.images[0].url}
                        alt=""
                        width={48}
                        height={48}
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                    <div>
                      <p className="truncate text-sm font-medium text-indigo-600">
                        {playlist.name}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="truncate">
                          {playlist.owner.display_name}
                        </span>
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div>
                        <p className="text-sm text-gray-900">
                          Uri: {playlist.uri}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <ChevronRightIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlists;
