import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Schemev2 from './models/schemev2.model.js';

import dns from 'dns';
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGODB_URL + '/scheme-seva');
    
    const karnatakaCount = await Schemev2.countDocuments({
        $or: [
            { state: new RegExp('Karnataka', 'i') },
            { tags: { $elemMatch: { $regex: new RegExp('Karnataka', 'i') } } }
        ]
    });
    
    const totalCount = await Schemev2.countDocuments({});
    
    console.log('TOTAL SCHEMES IN DB:', totalCount);
    console.log('KARNATAKA MATCHES:', karnatakaCount);
    
    const samples = await Schemev2.find({
        $or: [
            { state: new RegExp('Karnataka', 'i') },
            { tags: { $elemMatch: { $regex: new RegExp('Karnataka', 'i') } } }
        ]
    }).limit(5);

    console.log('SAMPLES:', samples.map(d => ({ name: d.schemeName, state: d.state, tags: d.tags })));

    // Now test state=Karnataka query via API logic
    const stateVal = "Karnataka";
    const stateRegex = new RegExp(`^${stateVal}$`, 'i');
    
    const testQuery = {
        $or: [
            { state: stateRegex },
            { state: "All States" },
            { tags: stateRegex }
        ]
    };
    
    const countWithTest = await Schemev2.countDocuments(testQuery);
    console.log('COUNT WITH STRICT QUERY:', countWithTest);

    const nonKarnataka = await Schemev2.find({
        ...testQuery,
        state: { $nin: [/Karnataka/i, "All States"] }
    }).limit(5);

    console.log('NON-KARNATAKA RETURNED BY QUERY:', nonKarnataka.map(d => ({ name: d.schemeName, state: d.state, tags: d.tags })));

    process.exit(0);
}

run();
