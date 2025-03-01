import { bootstrapCameraKit } from "@snap/camera-kit";

let camerakitInstance: any = null;

export default async function startCamera(productId: string) {
  const apiToken =
    "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQwODMwNTYyLCJzdWIiOiJkMDdjMzNhMC0xM2UzLTRmNzQtYjY2Zi0yZjYwZDRkNDVkNzF-U1RBR0lOR35hZDk0N2RkZi1kNGM3LTQ0ZWItYTRiYy0yMGFkYmFlZGFjMzQifQ.kV335wzw-gZiJ62axm74ANeSAZA43zIyTUlAYpx7EsI";

  const lensMappings: Record<string, string> = {
    "jordan-mont": "8c11317c-871f-4a6e-9935-295d6bf68323",
    "black-dress": "248d86da-f27a-4f27-a124-8ca3bff5f862",
    "watch-wrist-black": "3f6af14c-3107-48e1-8678-4b88b768e7dd",
  };

  const groupId = "96ae2032-741c-43e9-adbf-1fc15d6dd25f";
  const lensId = lensMappings[productId];

  if (!lensId) {
    console.error(`Bu ürün için lens bulunamadı: ${productId}`);
    return;
  }

  const liveRenderTarget = document.getElementById("canvas") as HTMLCanvasElement | null;
  if (!liveRenderTarget) {
    console.error("Canvas bulunamadı!");
    return;
  }

  try {
    console.log("Camera Kit başlatılıyor...");

    if (!camerakitInstance) {
      camerakitInstance = await bootstrapCameraKit({ apiToken });
      console.log("Camera Kit başarıyla başlatıldı.");
    } else {
      console.warn("Camera Kit zaten başlatılmış, tekrar başlatılmadı.");
    }

    const session = await camerakitInstance.createSession({
      liveRenderTarget,
      displayOptions: { enableSnapchatBranding: false }
    });

    const mediastream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });

    if (!mediastream) {
      console.error("Mediastream alınamadı!");
      return;
    }
    
    await session.setSource(mediastream);
    await session.play();

    const lens = await camerakitInstance.lensRepository.loadLens(lensId, groupId);
    await session.applyLens(lens);

    const activeLens = await session.getActiveLens();
    if (!activeLens) {
      console.error("Lens aktif hale getirilemedi!");
    } else {
      console.log("Lens başarıyla aktif hale getirildi!", activeLens);
    }

    console.log(`Lens ${lensId} başarıyla uygulandı!`);

  } catch (error) {
    console.error("Kamera başlatılırken hata oluştu:", error);
  }
}
