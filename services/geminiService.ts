import { GoogleGenAI, Modality, ContentPart } from "@google/genai";

const model = 'gemini-2.5-flash-image';

export const editImageWithGemini = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string,
  referenceImage?: { base64: string; mimeType: string; }
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const parts: ContentPart[] = [
      {
        inlineData: {
          data: base64ImageData,
          mimeType: mimeType,
        },
      },
      {
        text: prompt,
      },
    ];

    if (referenceImage) {
        parts.unshift({
             inlineData: {
                data: referenceImage.base64,
                mimeType: referenceImage.mimeType,
             }
        });
    }

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    
    if (imagePart && imagePart.inlineData) {
      const newBase64 = imagePart.inlineData.data;
      const newMimeType = imagePart.inlineData.mimeType;
      return `data:${newMimeType};base64,${newBase64}`;
    } else {
      console.error("API did not return an image. Response:", response);
      throw new Error("The AI did not return an image. It might have refused the request. Please check the prompt or image.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
