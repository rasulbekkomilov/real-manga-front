const uploadToImageKit = async (file) => {
   const formData = new FormData();
   formData.append("file", file);

   try {
      const response = await fetch("http://localhost:5000/upload", {
         method: "POST",
         body: formData,
      });

      const data = await response.json();
      if (response.ok) {
         return data; // data.url - rasm manzili
      } else {
         console.error("❌ Yuklash xatosi:", data.error);
         return null;
      }
   } catch (err) {
      console.error("🌐 Ulanishda xatolik:", err);
      return null;
   }
};

export default uploadToImageKit;
