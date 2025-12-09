import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export const useUploadMutation = () => {
  return useMutation({
    mutationFn: async ({
      file,
      folder,
    }: {
      file: File;
      folder: string;
    }): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.fileUrl;
    },
  });
};
