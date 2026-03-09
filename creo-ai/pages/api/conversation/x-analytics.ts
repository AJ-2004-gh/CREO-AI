import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // country can be changed to india, usa, uk etc
        const response = await fetch(
            "https://trendstools.net/json/twitter/india"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch trends");
        }

        const data = await response.json();

        res.status(200).json({
            success: true,
            trends: data,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error fetching trends",
        });
    }
}