// Simple test - just company name
const formData = new FormData();
formData.append("companyName", "Test Company");

fetch(
  "https://nextjs-with-supabase-ai-git-main-kodekenobis-projects.vercel.app/api/upload",
  {
    method: "POST",
    body: formData,
  }
)
  .then((r) => r.text())
  .then(console.log)
  .catch(console.error);
