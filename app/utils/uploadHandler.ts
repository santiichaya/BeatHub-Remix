import cloudinary from "~/utils/cloudinary";

export async function uploadToCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<string>((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream({ folder: "playlists" }, (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url as string); // Devuelve la URL de la imagen subida
      })
      .end(buffer);
  });
}

