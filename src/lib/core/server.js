export const serverMutation = async (url, donationData, method = 'POST') => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(donationData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in server mutation:', error);
        throw error;
    }
}

export const serverQuery = async (url) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in server query:', error);
        throw error;
    }
}