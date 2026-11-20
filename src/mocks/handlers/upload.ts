import { http, HttpResponse, delay } from "msw";

const API = import.meta.env.VITE_API_URL;

export const uploadHandlers = [
  http.post(`${API}/api/history/spotify/upload`, async ({ request }) => {
    await delay(80);
    const formData = await request.formData();
    const uploadedFile = formData.get("history");

    if (!uploadedFile) {
      return HttpResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      success: true,
      message: "Successfully uploaded listening history",
    });
  }),
];
