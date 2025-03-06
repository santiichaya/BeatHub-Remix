import cloudinary from "./cloudinary";

export async function deleteImageFromCloudinary(imageUrl: string): Promise<void> {
    const publicId = imageUrl.split("/").pop()?.split(".")[0];
  
    if (!publicId) throw new Error("No se pudo extraer el publicId de la URL.");
  
    await cloudinary.v2.uploader.destroy(`playlists/${publicId}`);
  }