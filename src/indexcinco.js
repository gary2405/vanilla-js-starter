export async function actualizarTarea(apiUrl, id, completed) {
    try {
        const response = await fetch(`${"http://localhost:3000/api/todo"}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: completed })
        });
        if (!response.ok) {
            throw new Error('Error al actualizar la tarea');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}