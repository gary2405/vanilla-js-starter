export const fetchtarea = async (apiUrl) => {
    try {
        const response = await fetch("http://localhost:3000/api/todo");
        return await response.json();
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
};





