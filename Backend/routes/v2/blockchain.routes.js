import express from "express";
import Project from "../../models/project.model.js";
import { verifyHashChain, submitToPolygon } from "../../services/blockchainService.js";

const router = express.Router();

/**
 * @route GET /api/v2/blockchain/verify/:projectId
 * @desc Verify the integrity of a project's entire blockchain hash chain
 */
router.get("/verify/:projectId", async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const hashChain = project.blockchainHashes || [];
        const verification = verifyHashChain(hashChain);

        return res.status(200).json({
            success: true,
            projectName: project.projectName,
            totalBlocks: hashChain.length,
            verification,
            chainSummary: hashChain.map(h => ({
                blockNumber: h.blockNumber,
                txType: h.txType,
                dataHash: h.dataHash.substring(0, 18) + "...",
                previousHash: h.previousHash.substring(0, 18) + "...",
                timestamp: h.timestamp,
                isOnChain: h.isOnChain,
                polygonTxHash: h.polygonTxHash ? h.polygonTxHash.substring(0, 18) + "..." : null
            }))
        });
    } catch (err) {
        console.error("Blockchain Verify Error:", err);
        return res.status(500).json({ message: "Failed to verify blockchain hash chain" });
    }
});

/**
 * @route GET /api/v2/blockchain/ledger/:projectId
 * @desc Get the full immutable hash ledger for a project
 */
router.get("/ledger/:projectId", async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        return res.status(200).json({
            success: true,
            projectName: project.projectName,
            totalBlocks: (project.blockchainHashes || []).length,
            ledger: project.blockchainHashes || []
        });
    } catch (err) {
        console.error("Blockchain Ledger Error:", err);
        return res.status(500).json({ message: "Failed to fetch blockchain ledger" });
    }
});

/**
 * @route POST /api/v2/blockchain/anchor/:projectId
 * @desc Anchor the latest hash to Polygon Amoy testnet
 */
router.post("/anchor/:projectId", async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const hashChain = project.blockchainHashes || [];
        if (hashChain.length === 0) {
            return res.status(400).json({ message: "No hashes to anchor — project has no blockchain entries" });
        }

        const latestHash = hashChain[hashChain.length - 1];
        
        if (latestHash.isOnChain) {
            return res.status(200).json({
                success: true,
                message: "Latest hash already anchored on Polygon",
                polygonTxHash: latestHash.polygonTxHash
            });
        }

        const result = await submitToPolygon(latestHash.dataHash);

        if (result.success) {
            // Update the latest hash entry with Polygon tx hash
            project.blockchainHashes[hashChain.length - 1].polygonTxHash = result.polygonTxHash;
            project.blockchainHashes[hashChain.length - 1].isOnChain = true;
            await project.save();
        }

        return res.status(200).json({
            success: result.success,
            message: result.note,
            network: result.network,
            polygonTxHash: result.polygonTxHash,
            explorerUrl: result.explorerUrl || null,
            blockNumber: latestHash.blockNumber,
            dataHash: latestHash.dataHash
        });
    } catch (err) {
        console.error("Blockchain Anchor Error:", err);
        return res.status(500).json({ message: "Failed to anchor hash to Polygon" });
    }
});

export default router;
