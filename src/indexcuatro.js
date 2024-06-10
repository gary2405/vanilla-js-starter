export const borrarTareas = async (apiUrl, id) => {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("Error deleting task:", error);
    }
};