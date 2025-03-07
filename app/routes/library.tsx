import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import ReactModal from "react-modal";
import { z } from "zod";
import { Edit, Trash } from "~/components/icons";
import { Playlist } from "~/components/Playlist";
import { checkedPlaylist, createPlaylist, deletePlaylist, getUserPlaylists, updatePlaylist } from "~/models/playlist.server";
import { requiredLoggedInUser } from "~/utils/auth_server";
import { deleteImageFromCloudinary } from "~/utils/deleteHandler";
import { getSession } from "~/utils/session";
import { uploadToCloudinary } from "~/utils/uploadHandler";
import { validateForm } from "~/utils/validateform";


export async function loader({ request }: LoaderFunctionArgs) {
  await requiredLoggedInUser(request);
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session?.get("userId");

  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const playlists = await getUserPlaylists(userId);

  return { playlists };
}


export const playlistSchema = z.object({
  name: z.string().min(1, "El título es obligatorio"),
  description: z.string().max(300, "La descripción no puede superar los 300 caracteres"),
  image: z.string().url("La URL de la imagen no es válida").optional(),
});


const playlistDeleteSchema = z.object({
  playlistId: z.string().min(1, "El ID de la playlist es obligatorio"),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  await requiredLoggedInUser(request);
  const formData = await request.formData();
  const cookie = await request.headers.get("cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");

  const actionType = formData.get("_action");

  switch (actionType) {
    case "createPlaylist":
      {
        const imageFile = formData.get("image") as File | null;
        let imageUrl = "";

        if (imageFile) {
          imageUrl = await uploadToCloudinary(imageFile);
          formData.set("image", imageUrl);
        }

        return validateForm(
          formData,
          playlistSchema,
          async ({ name, description, image }) => {
            await createPlaylist(userId, name, image || "", description);
            return json({ success: true });
          },
          (errors) => json({ errors }, { status: 400 })
        );
      }

    case "deletePlaylist":
      return validateForm(
        formData,
       playlistDeleteSchema,
        async ({ playlistId }) => {
          const playlist = await checkedPlaylist(playlistId, userId);
          if (!playlist) {
            return json({ error: "Playlist no encontrada" }, { status: 404 });
          }

          if (playlist.photo) {
            await deleteImageFromCloudinary(playlist.photo);
          }
          await deletePlaylist(playlistId);
          return json({ success: true });
        },
        (errors) => json({ errors }, { status: 400 })
      );

    case "updatePlaylist":
      {
        const playlistId = formData.get("playlistId") as string;
        const newImageFile = formData.get("image") as File | null;

        const playlist = await checkedPlaylist(playlistId, userId);
        if (!playlist) {
          return json({ error: "Playlist no encontrada" }, { status: 404 });
        }

        let finalImageUrl = playlist.photo;

        if (newImageFile) {
          if (playlist.photo) {
            await deleteImageFromCloudinary(playlist.photo);
          }
          finalImageUrl = await uploadToCloudinary(newImageFile);
        }

        formData.set("image", finalImageUrl);

        return validateForm(
          formData,
          playlistSchema,
          async ({ name, description, image }) => {
            await updatePlaylist(playlistId, name, description, image || "");
            return json({ success: true });
          },
          (errors) => json({ errors }, { status: 400 })
        );
      }

    default:
      return json({ error: "Acción no válida" }, { status: 400 });
  }
};




export default function UserLibrary() {
  const { playlists } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);

  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
    setSelectedPlaylist(null);
    setPlaylistName("");
    setPlaylistDescription("");
    setImage(null);
    setPreview(null);
  };

  const openEditModal = (playlist: any) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setSelectedPlaylist(playlist);
    setPlaylistName(playlist.name);
    setPlaylistDescription(playlist.description || "");
    setPreview(playlist.photo);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("_action", isEditMode ? "updatePlaylist" : "createPlaylist");
    formData.append("name", playlistName);
    formData.append("description", playlistDescription);

    if (image) {
      formData.append("image", image);
    }

    if (isEditMode && selectedPlaylist) {
      formData.append("playlistId", selectedPlaylist.id);
    }

    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });

    setIsModalOpen(false);
  };

  const handleDelete = (playlistId: string) => {
    const formData = new FormData();
    formData.append("_action", "deletePlaylist");
    formData.append("playlistId", playlistId);

    fetcher.submit(formData, { method: "POST" });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Tu Biblioteca</h1>

      <section className="mt-4">
        <h2 className="text-xl font-semibold">Playlists</h2>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mt-2"
        >
          Crear Playlist
        </button>

        <ul className="mt-4 grid grid-cols-4 gap-8">
          {playlists.map((playlist) => (
            <li key={playlist.id} className="p-2 rounded-md mt-2">
              <Playlist id={playlist.id} name={playlist.name} url={playlist.photo && playlist.photo !== "" ? playlist.photo : "/img/profilePicture.jpg"}/>

              <div className="flex gap-2">
                {playlist.name !== "Canciones que te gustan" && (
                  <button
                    onClick={() => openEditModal(playlist)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                  >
                    <Edit></Edit>
                  </button>
                )}

                {playlist.name !== "Canciones que te gustan" && (
                  <button
                    onClick={() => handleDelete(playlist.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    <Trash></Trash>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="md:h-fit lg:w-1/3 md:mx-auto md:mt-24 p-4 rounded-md bg-gray-900 text-white shadow-md outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="flex justify-between mb-4">
          <h1 className="text-lg font-bold">
            {isEditMode ? "Actualizar Playlist" : "Crear Playlist"}
          </h1>
          <button onClick={() => setIsModalOpen(false)} className="text-white text-2xl">
            &times;
          </button>
        </div>

        <fetcher.Form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="flex justify-center mb-4">
            <label htmlFor="fileUpload" className="cursor-pointer">
              <img
                src={preview && preview !== "" ? preview : "/img/profilePicture.jpg"}
                alt="Playlist Cover"
                className="w-24 h-24 rounded-md object-cover"
              />
            </label>
            <input
              id="fileUpload"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-400 text-sm mb-1">
              Título
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Nombre de la Playlist"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-lg outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-400 text-sm mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Descripción de la playlist..."
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-lg outline-none h-24"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-white text-black font-bold rounded-md hover:bg-gray-300 transition"
          >
            {isEditMode ? "Actualizar" : "Guardar"}
          </button>
        </fetcher.Form>
      </ReactModal>
    </div>
  );
}




