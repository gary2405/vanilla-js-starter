export async function guardarPost(apiUrl, textoTarea) {
  try {
      const response = await fetch("http://localhost:3000/api/todo", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ task: textoTarea})
      });
     
      return await response.json();
       
  } catch (error) {
      console.error(error);
  }
}