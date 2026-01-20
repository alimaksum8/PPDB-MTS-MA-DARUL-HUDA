
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const validateStudentData = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Validasi data pendaftaran siswa berikut ini. Berikan saran atau perbaikan jika ada format yang salah (misal No Telepon, Format Nama, dll). Data: ${JSON.stringify(data)}`,
      config: {
        systemInstruction: "Anda adalah asisten administrasi sekolah yang teliti di Indonesia. Berikan feedback singkat dan profesional dalam Bahasa Indonesia.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Validation Error:", error);
    return "Layanan asisten pintar sedang tidak tersedia.";
  }
};

export const suggestRombel = async (institution: string, age: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Seorang siswa mendaftar ke ${institution} dengan usia ${age} tahun. Berikan rekomendasi Tingkat/Rombel yang sesuai di sistem pendidikan Indonesia (MTs untuk SMP, MA untuk SMA).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestion: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["suggestion", "reason"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
};
