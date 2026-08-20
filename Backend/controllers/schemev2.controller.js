import Schemev2 from "../models/schemev2.model.js";
import User from "../models/user.model.js";

const getAllSchemes = async (req, res) => {
    try {
        const { page = 1, limit = 9 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        };

        const schemes = await Schemev2.paginate({}, options);
        res.status(200).json({
            schemes: schemes.docs,
            totalPages: schemes.totalPages,
            currentPage: schemes.page,
            totalSchemes: schemes.totalDocs
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSchemeById = async (req, res) => {
    try {
        const scheme = await Schemev2.findById(req.params.id);
        res.status(200).json(scheme);
    }
    catch (error) {
        res.status(404).json({ message: "Scheme not found" });
    }
};

const getSchemeByCategory = async (req, res) => {
    try {
        const { page = 1, limit = 9 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        };

        const catRegex = new RegExp(req.params.category.trim(), 'i');

        const schemes = await Schemev2.paginate(
            {
                $or: [
                    { schemeCategory: { $elemMatch: { $regex: catRegex } } },
                    { category: { $elemMatch: { $regex: catRegex } } },
                    { schemeCategory: catRegex },
                    { category: catRegex },
                    { tags: catRegex }
                ]
            },
            options
        );
        res.status(200).json({
            schemes: schemes.docs,
            totalPages: schemes.totalPages,
            currentPage: schemes.page,
            totalSchemes: schemes.totalDocs
        });
    } catch (error) {
        res.status(404).json({ message: "Category not found" });
    }
};

const getFilteredSchemes = async (req, res) => {
    try {
        const { page = 1, limit = 9 } = req.query;
        const {
            search, openDate, closeDate, state, nodalMinistryName, level,
            category, tags, schemeName
        } = req.query;

        const andConditions = [];

        // 1. Search term
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            andConditions.push({
                $or: [
                    { schemeName: searchRegex },
                    { schemeShortTitle: searchRegex },
                    { detailedDescription_md: searchRegex },
                    { nodalMinistryName: searchRegex },
                    { state: searchRegex },
                    { level: searchRegex },
                    { tags: { $in: [searchRegex] } },
                    { category: { $in: [searchRegex] } },
                    { schemeCategory: { $in: [searchRegex] } }
                ]
            });
        }

        // 2. Flexible Category Filter
        if (category && category.trim()) {
            const cleanCat = category.trim();
            // Build intelligent keyword regex expansion
            let catPattern = cleanCat;
            if (cleanCat.includes("Education")) {
                catPattern = "Education|Student|School|College|Scholarship|Learning";
            } else if (cleanCat.includes("Agriculture")) {
                catPattern = "Agriculture|Farmer|Kisan|Crop|Rural";
            } else if (cleanCat.includes("Health")) {
                catPattern = "Health|Medical|Hospital|Insurance|Wellness";
            } else if (cleanCat.includes("Women")) {
                catPattern = "Women|Girl|Maternity|Mother|Child";
            } else if (cleanCat.includes("Housing")) {
                catPattern = "Housing|Shelter|Home|Awas";
            }

            const catRegex = new RegExp(catPattern, 'i');
            andConditions.push({
                $or: [
                    { schemeCategory: { $elemMatch: { $regex: catRegex } } },
                    { category: { $elemMatch: { $regex: catRegex } } },
                    { schemeCategory: catRegex },
                    { category: catRegex },
                    { tags: { $in: [catRegex] } },
                    { schemeName: catRegex },
                    { detailedDescription_md: catRegex }
                ]
            });
        }

        // 3. State Filter (Strict Isolation)
        let stateCondition = null;
        if (state && state.trim()) {
            const cleanState = state.trim();
            const stateRegex = new RegExp(cleanState, 'i');
            stateCondition = {
                $or: [
                    { state: stateRegex },
                    { state: "All States" },
                    { tags: { $in: [stateRegex] } }
                ]
            };
            andConditions.push(stateCondition);
        }

        // 4. Ministry Filter
        if (nodalMinistryName && nodalMinistryName.trim()) {
            andConditions.push({ nodalMinistryName: nodalMinistryName.trim() });
        }

        // 5. Level Filter
        if (level && level.trim()) {
            andConditions.push({ level: level.trim() });
        }

        // 6. Tags Filter
        if (tags && tags.trim()) {
            const tagsArray = tags.split(',').map(t => new RegExp(t.trim(), 'i'));
            andConditions.push({ tags: { $in: tagsArray } });
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        };

        // Execute query with strict $and
        let finalQuery = andConditions.length > 0 ? { $and: andConditions } : {};
        let schemes = await Schemev2.paginate(finalQuery, options);

        // Fallback: If over-constrained $and returned 0 docs, relax other filters BUT ALWAYS KEEP stateCondition strict!
        if (schemes.totalDocs === 0 && andConditions.length > 1) {
            console.log("[JanDarpan Search] Relaxing search filters while preserving strict state isolation...");
            
            // Other conditions except state
            const otherConditions = andConditions.filter(c => c !== stateCondition);
            
            if (stateCondition) {
                finalQuery = {
                    $and: [
                        stateCondition,
                        { $or: otherConditions }
                    ]
                };
            } else {
                finalQuery = { $or: andConditions };
            }
            
            schemes = await Schemev2.paginate(finalQuery, options);
        }

        res.status(200).json({
            schemes: schemes.docs,
            totalPages: schemes.totalPages,
            currentPage: schemes.page,
            totalSchemes: schemes.totalDocs
        });
    } catch (err) {
        console.error("Error retrieving filtered schemes:", err);
        res.status(500).json({ message: "Error retrieving filtered schemes", error: err.message });
    }
};

const saveFavoriteSchemes = async (req, res) => {
    try {
        const userId = req.user._id;
        const schemeId = req.body.schemeId;

        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: schemeId } },
            { new: true }
        );

        res.status(200).json({ message: "Favorite schemes saved successfully" });
    } catch (error) {
        console.error("Error saving favorite schemes:", error);
        res.status(500).json({ message: "Error saving favorite schemes" });
    }
};

const removeFavoriteSchemes = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: id } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Scheme removed from favorites"
        });
    } catch (error) {
        console.error("Error removing favorite scheme:", error);
        res.status(500).json({
            success: false,
            message: "Error removing favorite scheme"
        });
    }
};

const getFavoriteSchemes = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        res.status(200).json(user.favorites || []);
    } catch (error) {
        console.error("Error retrieving favorite schemes:", error);
        res.status(500).json({ message: "Error retrieving favorite schemes" });
    }
};

export { getAllSchemes, getSchemeById, getSchemeByCategory, getFilteredSchemes, saveFavoriteSchemes, removeFavoriteSchemes, getFavoriteSchemes };