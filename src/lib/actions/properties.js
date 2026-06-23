'use server';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createProperty = async (data) => {
    try {
        const res = await fetch(`${baseUrl}/api/properties`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        return {
            success: res.ok,
            message: result.message || (res.ok ? 'Property created' : 'Failed to create'),
            data: res.ok ? result.data : null
        };

    } catch (error) {
        return {
            success: false,
            message: 'Network error',
            data: null
        };
    }
};