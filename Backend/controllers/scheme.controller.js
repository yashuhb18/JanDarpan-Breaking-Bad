import mongoose from "mongoose";
import Scheme from "../models/scheme.model.js";


const createScheme = async (req, res) => {
    try {
        const data = req.body.data;
        const scheme = new Scheme(data);
        await scheme.save();
        res.status(201).json(scheme);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAllSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.find();
        res.status(200).json(schemes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getSchemeFiltered = async (req, res) => {
    try {
        const { tags, gender, incomeGroup, age, state } = req.query;

        // Build the filter object
        let filter = {};

        // Filtering by state (since it is "all" in your data, this is an optional filter)
        if (state && state.length > 0 && state !== "all") {
            filter.state = { $in: state }; // Filter by state if it's provided and not "all"
        }



        // REMOVED TEMPORARILY
        // Filtering by tags (match any of the provided tags)
        // if (tags && tags.length > 0) {
        //     filter.tags = { $in: tags }; // Match if any tag exists in the tags array
        // }


        // Filtering by tags (match any of the provided tags)
        // Filtering by gender (male, female, other)
        if (gender && gender.length > 0) {
            filter['category.gender'] = { $in: gender }; // Filter by gender
        }

        // Filtering by income group (EWS, General, OBC, SC, ST)
        if (incomeGroup && incomeGroup.length > 0) {
            filter['category.incomeGroup'] = { $in: incomeGroup }; // Filter by income group
        }

        // Filtering by age (specific age groups or "all ages")
        if (age) {
            // Handle age as per the exact requirements (e.g., 18+, 30+, 60+, etc.)
            if (age === '18+') {
                filter.age = { $gte: 18 }; // Age 18 and above
            } else if (age === '30+') {
                filter.age = { $gte: 30 }; // Age 30 and above
            } else if (age === '60+') {
                filter.age = { $gte: 60 }; // Age 60 and above
            } else if (age === 'all') {
                // Allow all ages, no filter needed for "all ages"
            }
        }

        // Filtering by state (since it is "all" in your data, this is an optional filter)
        if (state && state.length > 0) {
            filter.state = { $in: state }; // Filter by state if it's provided
        }

        // Fetch filtered data from the database
        const schemes = await Scheme.find(filter);

        // If no data found, return an appropriate message
        if (schemes.length === 0) {
            return res.status(404).json({ message: 'No schemes found matching the filters.' });
        }

        // Return the filtered schemes
        return res.status(200).json(schemes);

    } catch (error) {
        console.error('Error filtering schemes:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getSchemeById = async (req, res) => {
    try {
        const { id } = req.params;
        const scheme = await Scheme.findById(id);
        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }
        res.status(200).json(scheme);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export {
    createScheme,
    getAllSchemes,
    getSchemeFiltered,
    getSchemeById
};
