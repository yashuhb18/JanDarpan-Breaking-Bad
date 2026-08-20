import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'kn', name: 'Kannada', nativeName: '鉦𨫼疏鈳温疏鉦�' },
    { code: 'ta', name: 'Tamil', nativeName: '鉈戈悅鉈賴捎鉒�' },
    { code: 'te', name: 'Telugu', nativeName: '鈰戈�鈰耜�鈰鉮�' },
    { code: 'ml', name: 'Malayalam', nativeName: '鉥桌散鉥能晷鉥喪�' }
];

export const translations = {
    en: {
        // Nav & Header
        nav_home: "HOME",
        nav_schemes: "SCHEMES",
        nav_about: "ABOUT",
        nav_profile: "MY PROFILE",
        nav_login: "LOGIN",
        nav_signup: "SIGNUP",
        nav_logout: "LOGOUT",
        select_language: "LANGUAGE",

        // Hero
        hero_tag: "OFFICIAL PORTAL",
        hero_title_1: "DISCOVER GOVERNMENT SCHEMES",
        hero_title_2: "FOR YOU & MANY MORE",
        hero_subtitle: "Empowering citizens nationwide with instant AI scheme eligibility, real-time civic infrastructure photo audits, and tamper-proof blockchain budget tracking.",
        hero_search_placeholder: "Enter age, state, or occupation...",
        hero_search_btn: "SEARCH SCHEMES",

        // Stats
        stats_tag: "02. THE AWARENESS GAP",
        stats_header: "BRIDGING THE 4,290+ SCHEMES DISCONNECT",
        stats_problem_title: "OVER 4,290+ SCHEMES EXIST NATIONWIDE. CITIZENS KNOW FEWER THAN 20.",
        stats_problem_desc: "The Indian government runs over 4,290 active welfare schemes across Central, State, and UT levels. JanDarpan AI unifies them into a single eligibility engine.",
        stats_solution_title: "THE JANDARPAN SOLUTION",
        stats_solution_desc: "A single unified platform matching citizen profiles to all Central & State schemes in real-time.",
        stats_card_1_title: "Active Welfare Schemes",
        stats_card_1_val: "4,290+",
        stats_card_2_title: "Average Citizen Awareness",
        stats_card_2_val: "< 20",
        stats_card_3_title: "Unified AI Discovery",
        stats_card_3_val: "100%",

        // Categories
        cat_tag: "03. CATEGORIES",
        cat_header: "BROWSE BY SECTOR (4,290+ TOTAL SCHEMES)",
        cat_edu: "Education",
        cat_health: "Healthcare",
        cat_women: "Women Empowerment",
        cat_employ: "Employment",
        cat_housing: "Housing",
        cat_agri: "Agriculture",
        cat_skill: "Skill Development",
        cat_bank: "Banking & Finance",
        cat_energy: "Clean Energy",
        cat_digital: "Digital India",
        cat_welfare: "Social Welfare",
        cat_transport: "Transportation",

        // Search & Directory
        dir_title: "FIND SCHEMES FOR YOU",
        dir_showing: "Showing",
        dir_of: "of",
        dir_schemes: "schemes",
        filter_category: "Category",
        filter_ministry: "Ministry",
        filter_state: "State",
        filter_level: "Level",
        filter_gender: "Gender",
        filter_income: "Income Group",
        filter_search_ph: "Search for government schemes...",
        btn_search: "SEARCH",
        btn_view_details: "VIEW DETAILS",
        btn_save_fav: "SAVE TO FAVORITES",
        btn_remove_fav: "SAVED (CLICK TO REMOVE)",
        btn_retry: "RETRY FETCH",

        // About Us
        about_tag: "05. ABOUT",
        about_header: "WHO WE ARE",
        about_title_1: "BRIDGING CITIZENS &",
        about_title_2: "GOVERNMENT.",
        about_desc: "Empowering 1.4 Billion Indian Citizens with GLM-4 Forensic AI Auditing, Polygon Immutable Ledgering, Section 80 CPC Legal-BERT High Court Automation, and 2FA Executive Fund Sanctioning.",
        about_mission_title: "OUR AI FORENSIC MISSION",
        about_mission_desc: "To eliminate public infrastructure corruption by matching physical geotagged site photo proof against contractor billing claims with GLM-4 AI.",
        about_serve_title: "WHO WE SERVE",
        about_serve_desc: "Indian Citizens, Executive PWD Engineers, Municipal Commissioners, and Verified Contractors committed to transparent public infrastructure.",
        about_commit_title: "LEGAL & BLOCKCHAIN COMMITMENT",
        about_commit_desc: "Immutable SHA-256 Polygon ledgering of every rupee spent, Section 80 CPC PIL High Court court-room petition generation, and e-SHRAM labor protection.",
        about_btn: "EXPLORE FULL ARCHITECTURE →",

        // FAQ
        faq_tag: "06. FAQ",
        faq_header: "FREQUENTLY ASKED QUESTIONS",
        faq_title_1: "COMMON",
        faq_title_2: "QUESTIONS.",
        faq_desc: "Everything you need to know about applying for government schemes through JanDarpan.",
        faq_1_q: "How can I apply for a scheme?",
        faq_1_a: "You can apply for a scheme by visiting our 'Explore Schemes' section, selecting the relevant scheme, and following the application process outlined there.",
        faq_2_q: "What documents are required for application?",
        faq_2_a: "The required documents vary by scheme. Generally, you need proof of identity (Aadhaar card), address proof, income certificate, and category certificates.",
        faq_3_q: "Who is eligible for the central schemes?",
        faq_3_a: "Eligibility varies based on age, income, occupation, and location. Some schemes target specific groups like women, farmers, or students.",
        faq_4_q: "How long does the application process take?",
        faq_4_a: "Processing times vary. Some schemes offer instant approval while others take a few weeks. The estimated timeframe is listed in the scheme details.",
        faq_5_q: "Can I apply for multiple schemes simultaneously?",
        faq_5_a: "Yes, you can apply for multiple schemes as long as you meet the eligibility criteria for each program.",
        faq_6_q: "What should I do if my application is rejected?",
        faq_6_a: "Review the rejection reason provided, update any missing or incorrect documents, and reapply directly on the portal.",

        // Details
        det_eligibility: "ELIGIBILITY CRITERIA",
        det_benefits: "SCHEME BENEFITS",
        det_docs: "DOCUMENTS REQUIRED",
        det_faqs: "FREQUENTLY ASKED QUESTIONS",

        // Profile
        prof_title: "MY CITIZEN PROFILE",
        prof_completion: "PROFILE COMPLETION",
        prof_personal: "Personal Info",
        prof_demographics: "Demographics",
        prof_financial: "Income & Occupation",
        prof_saved: "Saved Schemes",
        prof_no_saved: "No saved schemes yet. Bookmark schemes while browsing to view them here."
    },
    kn: {
        // Nav & Header
        nav_home: "鉦桌�鉦遤�鉦� 鉦芹�鉦�",
        nav_schemes: "鉦能�鉦厢疏鈳��鉦喪�",
        nav_about: "鉦兒皎鈳温皎 鉦眇�鈳温�鈳�",
        nav_profile: "鉦兒疏鈳温疏 鉦芹�鉦啤�鉦徇�鉦耜�",
        nav_login: "鉦耜移鉦鉮窒鉦兒�",
        nav_signup: "鉦詮�鉦兒� 鉦�痕鈳�",
        nav_logout: "鉦耜移鉦鉮� 鉦𠰍�鈳�",
        select_language: "鉦冢移鉦獅� 鉦�盔鈳温�鈳�皎鉦擒瓷鉦�",

        // Hero
        hero_tag: "鉦�異鉦賴�鈳�略 鉦芹�鉦啤�鉦颴眷鈳�",
        hero_title_1: "鉦詮盒鈳温�鉦擒盒鉦� 鉦能�鉦厢疏鈳��鉦喪疏鈳温疏鈳�",
        hero_title_2: "鉦𨫼�鉦﹤�鉦嫩窒鉦﹤窒鉦能窒鉦啤窒",
        hero_subtitle: "鈳�,鈳兒陳鈳舟�鈳温�鈳� 鉦嫩�鉦𠼭�鉦𠼭� 鉦𨫼�鉦�畢鈳温盒 鉦桌略鈳温略鈳� 鉦啤移鉦厢�鉦� 鉦詮盒鈳温�鉦擒盒鉦� 鉦能�鉦厢疏鈳��鉦喪窒鉦鉮� 鉦兒窒鉦桌�鉦� 鉦�盒鈳温硃鉦戈�鉦能疏鈳温疏鈳� 鉦戈�鈳温眺鉦� 鉦芹盒鉦賴眸鈳�鉦耜窒鉦詮窒.",
        hero_search_placeholder: "鉦菽盔鉦詮�鉦詮�, 鉦啤移鉦厢�鉦� 鉦�畦鉦菽移 鉦凼畢鈳温盔鈳肀� 鉦兒皎鈳�畢鉦賴硫鉦�...",
        hero_search_btn: "鉦能�鉦厢疏鈳� 鉦嫩�鉦﹤�鉦𨫼窒",

        // Stats
        stats_tag: "鈳舟釣. 鉦�盒鉦賴眶鉦賴疏 鉦𨫼�鉦啤略鈳�",
        stats_header: "鈳�,鈳兒陳鈳�+ 鉦能�鉦厢疏鈳��鉦� 鉦桌移鉦嫩窒鉦戈窒 鉦詮�鉦戈�",
        stats_problem_title: "鉦舟�鉦嗣移鉦舟�鉦能�鉦� 鈳�,鈳兒陳鈳�+ 鉦能�鉦厢疏鈳��鉦喪窒鉦菽�. 鉦兒移鉦鉮盒鉦賴�鉦啤窒鉦鉮� 鈳兒釵鉦𨫼�鉦𨫼窒鉦�略 鉦𨫼瓷鉦賴皎鈳� 鉦戈窒鉦喪窒鉦舟窒鉦菽�.",
        stats_problem_desc: "鉦𨫼�鉦�畢鈳温盒 鉦桌略鈳温略鈳� 鉦啤移鉦厢�鉦� 鉦詮盒鈳温�鉦擒盒鉦鉮眾鈳� 鈳�,鈳兒陳鈳舟�鈳温�鈳� 鉦嫩�鉦𠼭�鉦𠼭� 鉦詮�鈳温盒鉦賴盔 鉦能�鉦厢疏鈳��鉦喪疏鈳温疏鈳� 鉦兒瓷鈳�硫鈳�略鈳温略鉦菽�. 鉦厢疏鉦舟盒鈳温痕鉦� AI 鉦脚眷鈳温眷鉦菽疏鈳温疏鈳� 鉦响�鉦舟� 鉦菽�鉦舟窒鉦𨫼�鉦鉮� 鉦戈盒鈳�略鈳温略鉦舟�.",
        stats_solution_title: "鉦厢疏鉦舟盒鈳温痕鉦� 鉦芹盒鉦賴硃鉦擒盒",
        stats_solution_desc: "鉦兒移鉦鉮盒鉦賴�鉦� 鉦芹�鉦啤�鉦徇�鉦耜��䓃�鈳� 鉦詮�鉦𨫼�鉦戈眶鉦擒畢 鉦𨫼�鉦�畢鈳温盒 鉦桌略鈳温略鈳� 鉦啤移鉦厢�鉦� 鉦能�鉦厢疏鈳��鉦喪疏鈳温疏鈳� 鉦兒�鉦� 鉦詮皎鉦能畢鉦耜�鉦耜窒 鉦嗣窒鉦徇移鉦啤硫鈳� 鉦桌移鉦﹤�鉦戈�鉦戈畢鈳�.",
        stats_card_1_title: "鉦耜痍鈳温盔鉦菽窒鉦啤�鉦� 鉦詮�鈳温盒鉦賴盔 鉦能�鉦厢疏鈳��鉦喪�",
        stats_card_1_val: "鈳�,鈳兒陳鈳�+",
        stats_card_2_title: "鉦詮盒鉦擒硫鉦啤窒 鉦兒移鉦鉮盒鉦賴�鉦� 鉦�盒鉦賴眶鈳�",
        stats_card_2_val: "< 鈳兒釵",
        stats_card_3_title: "鉦凼�鉦賴略 AI 鉦�盒鈳温硃鉦戈移 鉦戈痕鉦擒硫鉦␡�",
        stats_card_3_val: "鈳抉釵鈳�%",

        // Categories
        cat_tag: "鈳舟釧. 鉦菽窒鉦冢移鉦鉮�鉦喪�",
        cat_header: "鉦𨫼�鉦獅�鉦戈�鉦啤眶鉦擒盒鈳� 鉦能�鉦厢疏鈳��鉦喪� (鉦响�鈳温�鈳� 鈳�,鈳兒陳鈳�+ 鉦能�鉦厢疏鈳��鉦喪�)",
        cat_edu: "鉦嗣窒鉦𨫼�鉦獅產",
        cat_health: "鉦�盒鈳肀�鈳温盔 鉦詮�鉦菽�",
        cat_women: "鉦桌硃鉦賴眾鉦� 鉦詮痊鉦耜�鉦𨫼盒鉦�",
        cat_employ: "鉦凼畢鈳温盔鈳肀�",
        cat_housing: "鉦菽硫鉦戈窒 鉦能�鉦厢疏鈳�",
        cat_agri: "鉦𨫼�鉦獅窒 鉦桌略鈳温略鈳� 鉦啤�鉦� 鉦𨫼眷鈳温盔鉦擒產",
        cat_skill: "鉦𨫼�鉦嗣眷鈳温盔 鉦�痍鉦賴眶鈳�畢鈳温異鉦�",
        cat_bank: "鉦眇�鉦能移鉦��鉦賴�鉦鉮� 鉦桌略鈳温略鈳� 鉦嫩產鉦𨫼移鉦詮�",
        cat_energy: "鉦詮�鉦� 鉦嗣�鈳温略鉦�",
        cat_digital: "鉦﹤窒鉦厢窒鉦颴眷鈳� 鉦��鉦﹤窒鉦能移",
        cat_welfare: "鉦詮移鉦桌移鉦厢窒鉦� 鉦𨫼眷鈳温盔鉦擒產",
        cat_transport: "鉦詮移鉦啤窒鉦鉮�",

        // Search & Directory
        dir_title: "鉦兒窒鉦桌�鉦擒�鉦� 鉦能�鉦厢疏鈳��鉦喪疏鈳温疏鈳� 鉦嫩�鉦﹤�鉦𨫼窒",
        dir_showing: "鉦戈�鉦啤窒鉦詮眷鉦擒�鈳�略鈳温略鉦賴畢鈳�",
        dir_of: "鉦响�鈳温�鈳�",
        dir_schemes: "鉦能�鉦厢疏鈳��鉦喪眷鈳温眷鉦�",
        filter_category: "鉦菽窒鉦冢移鉦�",
        filter_ministry: "鉦詮�鉦賴眶鉦擒眷鉦�",
        filter_state: "鉦啤移鉦厢�鉦�",
        filter_level: "鉦桌�鈳温�",
        filter_gender: "鉦耜窒鉦��",
        filter_income: "鉦�畢鉦擒盔 鉦鉮�鉦�痕鈳�",
        filter_search_ph: "鉦詮盒鈳温�鉦擒盒鉦� 鉦能�鉦厢疏鈳��鉦喪疏鈳温疏鈳� 鉦嫩�鉦﹤�鉦𨫼窒...",
        btn_search: "鉦嫩�鉦﹤�鉦𨫼窒",
        btn_view_details: "鉦菽窒鉦菽盒鉦鉮眾鉦兒�鉦兒� 鉦兒�鉦﹤窒",
        btn_save_fav: "鉦眇�鉦𨫼��䓃皎鉦擒盒鈳温�鈳� 鉦桌移鉦﹤窒",
        btn_remove_fav: "鉦凼眾鉦賴硫鉦耜移鉦鉮窒鉦舟� (鉦戈�鉦鉮�鉦舟�鉦嫩移鉦𨫼眷鈳� 鉦𨫼�鉦耜窒鉦𨫼� 鉦桌移鉦﹤窒)",
        btn_retry: "鉦桌略鈳温略鈳� 鉦芹�鉦啤盔鉦戈�鉦兒窒鉦詮窒",

        // About Us
        about_tag: "鈳舟釩. 鉦兒皎鈳温皎 鉦眇�鈳温�鈳�",
        about_header: "鉦兒移鉦菽� 鉦能移鉦啤�",
        about_title_1: "鉦兒移鉦鉮盒鉦賴�鉦啤� 鉦桌略鈳温略鈳�",
        about_title_2: "鉦詮盒鈳温�鉦擒盒鉦菽疏鈳温疏鈳� 鉦詮�鉦芹盒鈳温�鉦賴硫鈳�眶鈳�畢鈳�.",
        about_desc: "鉦兒移鉦鉮盒鉦賴�鉦啤� 鉦桌略鈳温略鈳� 鉦詮盒鈳温�鉦擒盒鉦� 鉦能�鉦厢疏鈳��鉦� 鉦兒瓷鈳�眶鉦賴疏 鉦��鉦戈盒鉦菽疏鈳温疏鈳� 鉦𨫼瓷鉦賴皎鈳� 鉦桌移鉦﹤眷鈳� 鉦兒移鉦菽� 鉦眇畢鈳温異鉦啤移鉦鉮窒鉦舟�鉦舟�鉦菽�. 鉦芹�鉦啤略鉦賴盔鈳𢺋痊鈳温痊 鉦兒移鉦鉮盒鉦賴�鉦兒窒鉦鉮� 鉦戈皎鉦鉮� 鉦詮窒鉦鉮痊鈳��鉦擒畢 鉦詮�鉦耜痍鈳温盔鉦鉮眾鉦兒�鉦兒� 鉦戈眷鈳�痕鉦賴硫鈳�眶鈳�畢鈳� 鉦兒皎鈳温皎 鉦鉮�鉦啤窒.",
        about_mission_title: "鉦兒皎鈳温皎 鉦抉�鉦能�鉦�",
        about_mission_desc: "鉦詮盒鈳温�鉦擒盒鉦� 鉦能�鉦厢疏鈳��鉦� 鉦詮皎鉦鉮�鉦� 鉦桌移鉦嫩窒鉦戈窒鉦能疏鈳温疏鈳� 鉦响畢鉦鉮窒鉦詮�鉦� 鉦桌�鉦耜� 鉦兒移鉦鉮盒鉦賴�鉦啤疏鈳温疏鈳� 鉦詮痊鉦耜�鉦𨫼盒鉦␡�鈳𢺋眾鉦賴硫鈳�眶鈳�畢鈳�.",
        about_serve_title: "鉦兒移鉦菽� 鉦能移鉦啤窒鉦鉮� 鉦詮�鉦菽� 鉦詮眷鈳温眷鉦賴硫鈳�略鈳温略鈳�眶鈳�",
        about_serve_desc: "鉦詮盒鈳温�鉦擒盒鉦� 鉦𨫼移鉦啤�鉦能�鈳温盒鉦桌�鉦喪窒鉦�畢 鉦芹�鉦啤盔鈳肀�鉦� 鉦芹瓷鈳�盔鉦耜� 鉦眇盔鉦詮�鉦� 鉦脚眷鈳温眷鉦� 鉦兒移鉦鉮盒鉦賴�鉦啤窒鉦鉮�.",
        about_commit_title: "鉦兒皎鈳温皎 鉦眇畢鈳温異鉦戈�",
        about_commit_desc: "鉦耜痍鈳温盔鉦菽窒鉦啤�鉦� 鉦脚眷鈳温眷鉦� 鉦能�鉦厢疏鈳��鉦� 鉦眇�鈳温�鈳� 鉦兒窒鉦遤盒鉦菽移鉦� 鉦桌略鈳温略鈳� 鉦兒眶鈳�鉦𨫼盒鉦賴硫鉦賴畢 鉦桌移鉦嫩窒鉦戈窒鉦能疏鈳温疏鈳� 鉦响畢鉦鉮窒鉦詮�鉦菽�鉦舟�.",
        about_btn: "鉦嫩�鉦𠼭�鉦𠼭� 鉦戈窒鉦喪窒鉦能窒鉦啤窒 ��",

        // FAQ
        faq_tag: "鈳舟閉. 鉦芹�鉦啤眸鈳温疏鈳肀略鈳温略鉦�",
        faq_header: "鉦芹畢鈳� 鉦芹畢鈳� 鉦𨫼�鉦喪眷鉦擒�鈳�眶 鉦芹�鉦啤眸鈳温疏鈳��鉦喪�",
        faq_title_1: "鉦詮移鉦桌移鉦兒�鉦�",
        faq_title_2: "鉦芹�鉦啤眸鈳温疏鈳��鉦喪�.",
        faq_desc: "鉦厢疏鉦舟盒鈳温痕鉦� 鉦桌�鉦耜� 鉦詮盒鈳温�鉦擒盒鉦� 鉦能�鉦厢疏鈳��鉦喪窒鉦鉮� 鉦�盒鈳温�鉦� 鉦詮眷鈳温眷鉦賴硫鈳�眶 鉦眇�鈳温�鈳� 鉦兒�鉦菽� 鉦戈窒鉦喪窒鉦舟�鉦𨫼�鉦喪�鉦喪痊鈳��鉦擒畢 鉦脚眷鈳温眷鉦菽�.",
        faq_1_q: "鉦兒移鉦兒� 鉦能�鉦厢疏鈳��鈳� 鉦嫩�鉦鉮� 鉦�盒鈳温�鉦� 鉦詮眷鈳温眷鉦賴硫鉦眇硃鈳�畢鈳�?",
        faq_1_a: "鉦兒皎鈳温皎 '鉦能�鉦厢疏鈳��鉦喪疏鈳温疏鈳� 鉦嫩�鉦﹤�鉦𨫼窒' 鉦菽窒鉦冢移鉦鉮�鈳温�鈳� 鉦冢�鉦颴窒 鉦兒�鉦﹤窒, 鉦詮�鉦𨫼�鉦� 鉦能�鉦厢疏鈳�盔鉦兒�鉦兒� 鉦�盔鈳温�鈳� 鉦桌移鉦﹤窒 鉦�盒鈳温�鉦� 鉦詮眷鈳温眷鉦賴硫鉦眇硃鈳�畢鈳�.",
        faq_2_q: "鉦�盒鈳温�鉦賴�鈳� 鉦能移鉦� 鉦舟移鉦遤眷鈳��鉦喪� 鉦��鉦戈�鉦能眶鉦賴畢鈳�?",
        faq_2_a: "鉦�異鉦擒盒鈳� 鉦𨫼移鉦啤�鉦﹤�, 鉦菽窒鉦喪移鉦� 鉦芹�鉦啤移鉦菽�, 鉦�畢鉦擒盔 鉦芹�鉦啤皎鉦擒產鉦芹略鈳温盒 鉦桌略鈳温略鈳� 鉦菽盒鈳温� 鉦芹�鉦啤皎鉦擒產鉦芹略鈳温盒鉦鉮眾鈳� 鉦��鉦戈�鉦能眶鉦賴畢鈳�.",
        faq_3_q: "鉦𨫼�鉦�畢鈳温盒 鉦能�鉦厢疏鈳��鉦喪窒鉦鉮� 鉦能移鉦啤� 鉦�盒鈳温硃鉦啤�?",
        faq_3_a: "鉦菽盔鉦詮�鉦詮�, 鉦�畢鉦擒盔, 鉦凼畢鈳温盔鈳肀� 鉦桌略鈳温略鈳� 鉦詮�鉦丞眾鉦� 鉦�異鉦擒盒鉦� 鉦桌�鉦耜� 鉦�盒鈳温硃鉦戈�鉦能疏鈳温疏鈳� 鉦兒窒鉦啤�鉦抉盒鉦賴硫鉦耜移鉦鉮�鉦戈�鉦戈畢鈳�.",
        faq_4_q: "鉦�盒鈳温�鉦� 鉦芹�鉦啤�鈳温盒鉦賴盔鈳��鈳� 鉦脚眺鈳温�鈳� 鉦詮皎鉦� 鉦嫩窒鉦﹤窒鉦能�鉦戈�鉦戈畢鈳�?",
        faq_4_a: "鉦能�鉦厢疏鈳��鈳� 鉦�疏鈳��鈳�產鉦菽移鉦鉮窒 鉦詮皎鉦� 鉦眇畢鉦耜移鉦鉮�鉦戈�鉦戈畢鈳�. 鉦𨫼�鉦耜眶鈳� 鉦戈�鈳温眺鉦� 鉦�疏鈳�皎鈳肀畢鉦兒�鉦能移鉦鉮�鉦戈�鉦戈眶鈳�.",
        faq_5_q: "鉦兒移鉦兒� 鉦响�鉦舟� 鉦眇移鉦啤窒鉦鉮� 鉦�疏鈳�� 鉦能�鉦厢疏鈳��鉦喪窒鉦鉮� 鉦�盒鈳温�鉦� 鉦詮眷鈳温眷鉦賴硫鉦眇硃鈳�畢鈳�?",
        faq_5_a: "鉦嫩�鉦舟�, 鉦兒�鉦菽� 鉦�盒鈳温硃鉦戈� 鉦嫩�鉦�畢鉦賴盒鈳�眶 鉦脚眷鈳温眷鉦� 鉦能�鉦厢疏鈳��鉦喪窒鉦鉮� 鉦�盒鈳温�鉦� 鉦詮眷鈳温眷鉦賴硫鉦眇硃鈳�畢鈳�.",
        faq_6_q: "鉦兒疏鈳温疏 鉦�盒鈳温�鉦� 鉦戈窒鉦啤硫鈳温�鈳�略鉦鉮�鉦�瓷鉦啤� 鉦兒移鉦兒� 鉦𥐰疏鈳� 鉦桌移鉦﹤痊鈳��鈳�?",
        faq_6_a: "鉦戈窒鉦啤硫鈳温�鉦啤產鈳�盔 鉦𨫼移鉦啤產鉦菽疏鈳温疏鈳� 鉦芹盒鉦賴眸鈳�鉦耜窒鉦詮窒, 鉦詮盒鉦賴盔鉦擒畢 鉦舟移鉦遤眷鈳��鉦喪�鉦�畢鉦賴�鈳� 鉦桌略鈳温略鈳� 鉦�盒鈳温�鉦� 鉦詮眷鈳温眷鉦賴硫鉦眇硃鈳�畢鈳�.",

        // Details
        det_eligibility: "鉦�盒鈳温硃鉦戈移 鉦桌移鉦兒畢鉦�瓷鉦鉮眾鈳�",
        det_benefits: "鉦能�鉦厢疏鈳�盔 鉦芹�鉦啤盔鈳肀�鉦兒�鉦喪�",
        det_docs: "鉦��鉦戈�鉦能眶鉦賴盒鈳�眶 鉦舟移鉦遤眷鈳��鉦喪�",
        det_faqs: "鉦芹畢鈳� 鉦芹畢鈳� 鉦𨫼�鉦喪眷鉦擒�鈳�眶 鉦芹�鉦啤眸鈳温疏鈳��鉦喪�",

        // Profile
        prof_title: "鉦兒疏鈳温疏 鉦兒移鉦鉮盒鉦賴� 鉦芹�鉦啤�鉦徇�鉦耜�",
        prof_completion: "鉦芹�鉦啤�鉦徇�鉦耜� 鉦芹�鉦啤�鉦␡�鈳𢺋眾鉦賴硫鈳�眶鉦賴�鈳�",
        prof_personal: "鉦菽�鉦能�鈳温略鉦賴� 鉦桌移鉦嫩窒鉦戈窒",
        prof_demographics: "鉦厢疏鉦詮�鉦遤�鉦能移 鉦桌移鉦嫩窒鉦戈窒",
        prof_financial: "鉦�畢鉦擒盔 鉦桌略鈳温略鈳� 鉦凼畢鈳温盔鈳肀�",
        prof_saved: "鉦凼眾鉦賴硫鉦賴畢 鉦能�鉦厢疏鈳��鉦喪�",
        prof_no_saved: "鉦�疏鈳温疏鈳� 鉦能移鉦菽�鉦舟� 鉦能�鉦厢疏鈳��鉦喪疏鈳温疏鈳� 鉦凼眾鉦賴硫鉦賴眷鈳温眷."
    },
    ta: {
        // Nav & Header
        nav_home: "鉈桌�鉈𨫼悚鉒温悚鉒�",
        nav_schemes: "鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�",
        nav_about: "鉈脚�鉒温�鉈喪�鉈芹� 鉈芹拳鉒温拳鉈�",
        nav_profile: "鉈脚悟鉒� 鉈𠼭�鉈能挾鉈賴挾鉈啤悅鉒�",
        nav_login: "鉈耜挽鉈𨫼挪鉈拈�",
        nav_signup: "鉈芹恕鉈賴挾鉒� 鉈𠼭�鉈能�鉈�",
        nav_logout: "鉈耜挽鉈𨫼� 鉈�挾鉒��鉒�",
        select_language: "鉈桌�鉈毯挪鉈能�鉈戈� 鉈戈�鉈啤�鉈兒�鉈戈�鉈颴�鉈𨫼�鉈𨫼挾鉒�悅鉒�",

        // Hero
        hero_tag: "鉈�恕鉈賴�鉈擒扇鉈芹�鉈芹�鉈啤�鉈� 鉈戈拿鉈桌�",
        hero_title_1: "鉈�扇鉈𠼭� 鉈兒挈鉈戈�鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�鉈𨫼�",
        hero_title_2: "鉈𨫼恐鉒温�鉈晤挪鉈能�鉈跃�鉈𨫼拿鉒�",
        hero_subtitle: "4,290鉈𨫼�鉈𨫼�鉈桌� 鉈桌�鉈晤�鉈芹�鉒温� 鉈桌恕鉒温恕鉈賴悖 鉈桌拳鉒温拳鉒�悅鉒� 鉈桌挽鉈兒挪鉈� 鉈�扇鉈𠼭� 鉈兒挈鉈戈�鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�鉈𨫼�鉈𨫼挽鉈� 鉈凼�鉒温�鉈喪� 鉈戈�鉒�恕鉈賴悖鉒� 鉈凼�鉈拈� 鉈𠼭扇鉈賴悚鉈擒扇鉒��鉒温�鉈喪�.",
        hero_search_placeholder: "鉈菽悖鉈戈�, 鉈桌挽鉈兒挪鉈耜悅鉒� 鉈�挈鉒温挈鉈戈� 鉈戈�鉈毯挪鉈耜� 鉈凼拿鉒温拿鉈賴�鉈菽�鉈桌�...",
        hero_search_btn: "鉈戈挪鉈颴�鉈颴悅鉒� 鉈戈�鉈颴�鉈�",

        // Stats
        stats_tag: "02. 鉈菽挪鉈毯挪鉈芹�鉈芹�鉈␡扇鉒温挾鉒� 鉈��鉒�挾鉒�拿鉈�",
        stats_header: "4,290+ 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪挪鉈拈� 鉈戈�鉈菽挈鉒� 鉈�恐鉒�悚鉒温悚鉒�",
        stats_problem_title: "鉈兒挽鉈颴� 鉈桌�鉈毯�鉈菽恕鉒�悅鉒� 4,290+ 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪� 鉈凼拿鉒温拿鉈�. 鉈桌�鉒温�鉈喪�鉈𨫼�鉈𨫼� 20鉈𨫼�鉈𨫼�鉈桌� 鉈𨫼�鉈晤�鉈菽挽鉈𨫼挾鉒� 鉈戈�鉈啤挪鉈能�鉈桌�.",
        stats_problem_desc: "鉈桌恕鉒温恕鉈賴悖 鉈桌拳鉒温拳鉒�悅鉒� 鉈桌挽鉈兒挪鉈� 鉈�扇鉈𠼭�鉈𨫼拿鉒� 4,290鉈𨫼�鉈𨫼�鉈桌� 鉈桌�鉈晤�鉈芹�鉒温� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪� 鉈兒�鉈戈�鉈戈�鉈𨫼挪鉈拈�鉈晤悟. 鉈厢悟鉒温恕鉈啤�鉈芹悟鉒� AI 鉈�悟鉒�恕鉒温恕鉒�悖鉒�悅鉒� 鉈响扇鉒� 鉈戈拿鉈戈�鉈戈挪鉈耜� 鉈�恐鉒��鉒温�鉈賴拳鉈戈�.",
        stats_solution_title: "鉈厢悟鉒温恕鉈啤�鉈芹悟鉒� 鉈戈�鉈啤�鉈菽�",
        stats_solution_desc: "鉈桌�鉒温�鉈喪挪鉈拈� 鉈𠼭�鉈能挾鉈賴挾鉈啤恕鉒温恕鉈賴拳鉒温�鉒� 鉈𥐰拳鉒温悚 鉈桌恕鉒温恕鉈賴悖 鉈桌拳鉒温拳鉒�悅鉒� 鉈桌挽鉈兒挪鉈� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪� 鉈凼�鉈拈�鉈𨫼�鉈𨫼�鉈颴悟鉒� 鉈芹扇鉈賴悄鉒温恕鉒�扇鉒��鉒温�鉈賴拳鉈戈�.",
        stats_card_1_title: "鉈𠼭�鉈能挈鉒温悚鉈擒�鉒温�鉈賴挈鉒�拿鉒温拿 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�",
        stats_card_1_val: "4,290+",
        stats_card_2_title: "鉈桌�鉒温�鉈喪挪鉈拈� 鉈𠼭扇鉈擒�鉈啤挪 鉈菽挪鉈毯挪鉈芹�鉈芹�鉈␡扇鉒温挾鉒�",
        stats_card_2_val: "< 20",
        stats_card_3_title: "鉈�挈鉈菽� AI 鉈戈�鉒�恕鉈� 鉈𠼭扇鉈賴悚鉈擒扇鉒温悚鉒温悚鉒�",
        stats_card_3_val: "100%",

        // Categories
        cat_tag: "03. 鉈芹挪鉈啤挪鉈菽�鉈𨫼拿鉒�",
        cat_header: "鉈戈�鉈晤� 鉈菽挽鉈啤挪鉈能挽鉈� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪� (鉈桌�鉈戈�鉈戈悅鉒� 4,290+ 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�)",
        cat_edu: "鉈𨫼挈鉒温挾鉈�",
        cat_health: "鉈𠼭�鉈𨫼挽鉈戈挽鉈啤悅鉒�",
        cat_women: "鉈桌�鉈喪挪鉈啤� 鉈桌�鉈桌�鉈芹挽鉈颴�",
        cat_employ: "鉈菽�鉈耜�鉈菽挽鉈能�鉈芹�鉈芹�",
        cat_housing: "鉈菽�鉈颴�鉈颴� 鉈菽�鉈戈挪",
        cat_agri: "鉈菽�鉈喪挽鉈␡�鉈桌�",
        cat_skill: "鉈戈挪鉈晤悟鉒� 鉈桌�鉈桌�鉈芹挽鉈颴�",
        cat_bank: "鉈菽�鉒温�鉈� & 鉈兒挪鉈戈挪",
        cat_energy: "鉈戈�鉈能�鉈桌� 鉈�拳鉒温拳鉈耜�",
        cat_digital: "鉈颴挪鉈厢挪鉈颴�鉈颴挈鉒� 鉈�悄鉒温恕鉈賴悖鉈�",
        cat_welfare: "鉈𠼭悅鉒�� 鉈兒挈鉈拈�",
        cat_transport: "鉈芹�鉈𨫼�鉈𨫼�鉈菽扇鉈戈�鉈戈�",

        // Search & Directory
        dir_title: "鉈凼�鉒温�鉈喪�鉈𨫼�鉈𨫼挽鉈� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�鉈𨫼� 鉈𨫼恐鉒温�鉈晤挪鉈能挾鉒�悅鉒�",
        dir_showing: "鉈𨫼挽鉈颴�鉈颴悚鉒温悚鉈颴�鉈𨫼挪鉈晤恕鉒�",
        dir_of: "鉈桌�鉈戈�鉈戈悅鉒�",
        dir_schemes: "鉈戈挪鉈颴�鉈颴�鉒温�鉈喪挪鉈耜�",
        filter_category: "鉈芹挪鉈啤挪鉈菽�",
        filter_ministry: "鉈�悅鉒��鉒温�鉈𨫼悅鉒�",
        filter_state: "鉈桌挽鉈兒挪鉈耜悅鉒�",
        filter_level: "鉈兒挪鉈耜�",
        filter_gender: "鉈芹挽鉈耜挪鉈拈悅鉒�",
        filter_income: "鉈菽扇鉒�悅鉈擒悟鉈𨫼� 鉈𨫼�鉈毯�",
        filter_search_ph: "鉈�扇鉈𠼭� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�鉈戈� 鉈戈�鉈颴挾鉒�悅鉒�...",
        btn_search: "鉈戈�鉈颴�鉈�",
        btn_view_details: "鉈菽挪鉈菽扇鉈跃�鉈𨫼拿鉒�悚鉒� 鉈芹挽鉈啤�鉈𨫼�鉈�",
        btn_save_fav: "鉈𠼭�鉈桌挪鉈𨫼�鉈𨫼挾鉒�悅鉒�",
        btn_remove_fav: "鉈𠼭�鉈桌挪鉈𨫼�鉈𨫼悚鉒温悚鉈颴�鉈颴恕鉒�",
        btn_retry: "鉈桌�鉈␡�鉈颴�鉈桌� 鉈桌�鉈能拳鉒温�鉈賴�鉒温�鉈菽�鉈桌�",

        // About Us
        about_tag: "05. 鉈脚�鉒温�鉈喪�鉈芹� 鉈芹拳鉒温拳鉈�",
        about_header: "鉈兒挽鉈跃�鉈𨫼拿鉒� 鉈能挽鉈啤�",
        about_title_1: "鉈桌�鉒温�鉈喪�鉈能�鉈桌� 鉈�扇鉈𠼭�鉈能�鉈桌�",
        about_title_2: "鉈�恐鉒��鉒温�鉈賴拳鉈戈�.",
        about_desc: "鉈桌�鉒温�鉈喪�鉈𨫼�鉈𨫼�鉈桌� 鉈�扇鉈𠼭� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�鉈𨫼�鉈𨫼�鉈桌� 鉈��鉒�悖鉒� 鉈凼拿鉒温拿 鉈��鉒�挾鉒�拿鉈賴悖鉒��鉒� 鉈𨫼�鉈晤�鉈芹�鉈芹恕鉒� 鉈脚�鉒温�鉈喪� 鉈耜�鉒温�鉈賴悖鉈桌�. 鉈戈�鉒�恕鉈賴悖鉒�拿鉒温拿 鉈�悟鉒�恕鉒温恕鉒� 鉈兒悟鉒温悅鉒��鉈喪�鉈桌� 鉈桌�鉒温�鉈喪�鉈𨫼�鉈𨫼�鉈𠼭� 鉈𠼭�鉈拈�鉈晤�鉒�挾鉈戈� 鉈凼拳鉒�恕鉈� 鉈𠼭�鉈能�鉈𨫼挪鉈晤�鉈桌�.",
        about_mission_title: "鉈脚�鉒温�鉈喪� 鉈兒�鉈𨫼�鉈𨫼悅鉒�",
        about_mission_desc: "鉈�扇鉈𠼭� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪� 鉈芹拳鉒温拳鉈賴悖 鉈桌�鉈毯�鉈桌�鉈能挽鉈� 鉈戈�鉈菽挈鉒温�鉈喪� 鉈菽捎鉈跃�鉈𨫼挪 鉈桌�鉒温�鉈喪� 鉈菽挈鉒�悚鉒温悚鉈颴�鉈戈�鉈戈�鉈戈挈鉒�.",
        about_serve_title: "鉈能挽鉈啤�鉈𨫼�鉈𨫼� 鉈𠼭�鉈菽� 鉈𠼭�鉈能�鉈𨫼挪鉈晤�鉈桌�",
        about_serve_desc: "鉈�扇鉈𠼭� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪挽鉈耜� 鉈芹悖鉈拈�鉒�悖 鉈菽挪鉈啤�鉈桌�鉈芹�鉈桌� 鉈�悟鉒�恕鉒温恕鉒� 鉈𨫼�鉈颴挪鉈桌�鉒温�鉈喪�鉈𨫼�鉈𨫼�鉈桌�.",
        about_commit_title: "鉈脚�鉒温�鉈喪� 鉈凼拳鉒�恕鉈賴悅鉒𢺋捎鉈�",
        about_commit_desc: "鉈戈�鉈耜�鉈耜挪鉈能悅鉈擒悟 鉈桌拳鉒温拳鉒�悅鉒� 鉈芹�鉈戈�鉈芹�鉈芹挪鉈𨫼�鉈𨫼悚鉒温悚鉈颴�鉈� 鉈戈�鉈菽挈鉒温�鉈喪� 鉈菽捎鉈跃�鉈𨫼�鉈戈挈鉒�.",
        about_btn: "鉈桌�鉈耜�鉈桌� 鉈�拳鉈賴悖 ��",

        // FAQ
        faq_tag: "06. 鉈𨫼�鉈喪�鉈菽挪鉈𨫼拿鉒�",
        faq_header: "鉈��鉈賴�鉒温�鉈颴挪 鉈𨫼�鉈颴�鉈𨫼悚鉒温悚鉈颴�鉈桌� 鉈𨫼�鉈喪�鉈菽挪鉈𨫼拿鉒�",
        faq_title_1: "鉈芹�鉈戈�鉈菽挽鉈�",
        faq_title_2: "鉈𨫼�鉈喪�鉈菽挪鉈𨫼拿鉒�.",
        faq_desc: "鉈厢悟鉒温恕鉈啤�鉈芹悟鉒� 鉈桌�鉈耜悅鉒� 鉈�扇鉈𠼭� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�鉈𨫼�鉈𨫼� 鉈菽挪鉈␡�鉈␡悚鉒温悚鉈賴悚鉒温悚鉈戈� 鉈芹拳鉒温拳鉈� 鉈兒�鉈跃�鉈𨫼拿鉒� 鉈�拳鉈賴悖 鉈菽�鉈␡�鉈颴挪鉈能挾鉒�.",
        faq_1_q: "鉈兒挽鉈拈� 鉈响扇鉒� 鉈戈挪鉈颴�鉈颴恕鉒温恕鉈賴拳鉒温�鉒� 鉈脚悚鉒温悚鉈颴挪 鉈菽挪鉈␡�鉈␡悚鉒温悚鉈賴悚鉒温悚鉈戈�?",
        faq_1_a: "'鉈戈挪鉈颴�鉈颴�鉒温�鉈喪� 鉈�扇鉈擒悖鉒温�' 鉈芹�鉒�恕鉈賴�鉒温�鉒��鉒� 鉈𠼭�鉈拈�鉈晤� 鉈戈�鉒�恕鉈賴悖鉈擒悟 鉈戈挪鉈颴�鉈颴恕鉒温恕鉒�恕鉒� 鉈戈�鉈啤�鉈兒�鉈戈�鉈颴�鉈戈�鉈戈� 鉈菽挪鉈␡�鉈␡悚鉒温悚鉈賴�鉒温�鉈耜挽鉈桌�.",
        faq_2_q: "鉈菽挪鉈␡�鉈␡悚鉒温悚鉈賴�鉒温� 鉈脚悟鉒温悟鉒�悟鉒温悟 鉈�挾鉈␡�鉒温�鉈喪� 鉈戈�鉈菽�?",
        faq_2_a: "鉈�恕鉈擒扇鉒� 鉈��鉒温�鉒�, 鉈桌�鉈𨫼挾鉈啤挪鉈𠼭� 鉈𠼭挽鉈拈�鉈晤�, 鉈菽扇鉒�悅鉈擒悟鉈𠼭� 鉈𠼭挽鉈拈�鉈晤� 鉈桌拳鉒温拳鉒�悅鉒� 鉈𠼭挽鉈戈挪鉈𠼭� 鉈𠼭挽鉈拈�鉈晤挪鉈戈捎鉒温�鉈喪� 鉈戈�鉈菽�鉈芹�鉈芹�鉒�悅鉒�.",
        faq_3_q: "鉈桌恕鉒温恕鉈賴悖 鉈�扇鉈𠼭� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�鉈𨫼�鉈𨫼� 鉈能挽鉈啤� 鉈戈�鉒�恕鉈賴悖鉈擒悟鉈菽扇鉒�?",
        faq_3_a: "鉈菽悖鉈戈�, 鉈菽扇鉒�悅鉈擒悟鉈桌�, 鉈戈�鉈毯挪鉈耜� 鉈桌拳鉒温拳鉒�悅鉒� 鉈�扇鉒�悚鉒温悚鉈賴�鉈戈�鉈戈挪鉈拈� 鉈��鉈賴悚鉒温悚鉈颴�鉈能挪鉈耜� 鉈戈�鉒�恕鉈� 鉈兒挪鉈啤�鉈␡悖鉈賴�鉒温�鉈芹�鉈芹�鉒��鉈賴拳鉈戈�.",
        faq_4_q: "鉈菽挪鉈␡�鉈␡悚鉒温悚 鉈𠼭�鉈能挈鉒温悅鉒�拳鉒� 鉈脚挾鉒温挾鉈喪挾鉒� 鉈𨫼挽鉈耜悅鉒� 鉈脚�鉒��鉒温�鉒�悅鉒�?",
        faq_4_a: "鉈戈挪鉈颴�鉈颴恕鉒温恕鉒�悚鉒� 鉈芹�鉈晤�鉈戈�鉈戈� 鉈𨫼挽鉈耜悅鉒� 鉈桌挽鉈晤�鉈芹�鉒�悅鉒�. 鉈𠼭挪鉈� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�鉈𨫼�鉈𨫼� 鉈凼�鉈拈�鉈� 鉈响悚鉒温悚鉒�恕鉈耜� 鉈𨫼挪鉈颴�鉈𨫼�鉈𨫼�鉈桌�.",
        faq_5_q: "鉈兒挽鉈拈� 鉈响扇鉒� 鉈兒�鉈啤恕鉒温恕鉈賴挈鉒� 鉈芹挈 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�鉈𨫼�鉈𨫼� 鉈菽挪鉈␡�鉈␡悚鉒温悚鉈賴�鉒温�鉈耜挽鉈桌挽?",
        faq_5_a: "鉈�悅鉒�, 鉈兒�鉈跃�鉈𨫼拿鉒� 鉈戈�鉒�恕鉈賴悖鉒��鉒�悖 鉈�悟鉒�恕鉒温恕鉒� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�鉈𨫼�鉈𨫼�鉈桌� 鉈菽挪鉈␡�鉈␡悚鉒温悚鉈賴�鉒温�鉈耜挽鉈桌�.",
        faq_6_q: "鉈脚悟鉒� 鉈菽挪鉈␡�鉈␡悚鉒温悚鉈桌� 鉈兒挪鉈啤挽鉈𨫼扇鉈賴�鉒温�鉈芹�鉈芹�鉒温�鉈擒挈鉒� 鉈脚悟鉒温悟 鉈𠼭�鉈能�鉈菽恕鉒�?",
        faq_6_a: "鉈兒挪鉈啤挽鉈𨫼扇鉈賴悚鉒温悚鉒��鉒温�鉈擒悟 鉈𨫼挽鉈啤恐鉈戈�鉈戈� 鉈�拳鉈賴悄鉒温恕鉒�, 鉈𠼭扇鉈賴悖鉈擒悟 鉈�挾鉈␡�鉒温�鉈喪�鉈颴悟鉒� 鉈桌�鉈␡�鉈颴�鉈桌� 鉈菽挪鉈␡�鉈␡悚鉒温悚鉈賴�鉒温�鉈耜挽鉈桌�.",

        // Details
        det_eligibility: "鉈戈�鉒�恕鉈� 鉈菽扇鉈桌�鉈芹�鉈𨫼拿鉒�",
        det_benefits: "鉈戈挪鉈颴�鉈� 鉈兒悟鉒温悅鉒��鉈喪�",
        det_docs: "鉈戈�鉈菽�鉈能挽鉈� 鉈�挾鉈␡�鉒温�鉈喪�",
        det_faqs: "鉈��鉈賴�鉒温�鉈颴挪 鉈𨫼�鉈颴�鉈𨫼悚鉒温悚鉈颴�鉈桌� 鉈𨫼�鉈喪�鉈菽挪鉈𨫼拿鉒�",

        // Profile
        prof_title: "鉈脚悟鉒� 鉈𠼭�鉈能挾鉈賴挾鉈啤悅鉒�",
        prof_completion: "鉈𠼭�鉈能挾鉈賴挾鉈� 鉈兒挪鉈晤�鉈菽�",
        prof_personal: "鉈戈悟鉈賴悚鉒温悚鉈颴�鉈� 鉈菽挪鉈菽扇鉈跃�鉈𨫼拿鉒�",
        prof_demographics: "鉈�扇鉒�悚鉒温悚鉈賴�鉈桌� 鉈桌拳鉒温拳鉒�悅鉒� 鉈芹挽鉈耜挪鉈拈悅鉒�",
        prof_financial: "鉈菽扇鉒�悅鉈擒悟鉈桌� & 鉈戈�鉈毯挪鉈耜�",
        prof_saved: "鉈𠼭�鉈桌挪鉈𨫼�鉈𨫼悚鉒温悚鉈颴�鉈� 鉈戈挪鉈颴�鉈颴�鉒温�鉈喪�",
        prof_no_saved: "鉈�悟鉒温悟鉒�悅鉒� 鉈脚悄鉒温恕 鉈戈挪鉈颴�鉈颴悅鉒�悅鉒� 鉈𠼭�鉈桌挪鉈𨫼�鉈𨫼悚鉒温悚鉈颴挾鉈賴挈鉒温挈鉒�."
    },
    te: {
        // Nav & Header
        nav_home: "鈰嫩�鈰桌�",
        nav_schemes: "鈰芹陞鈰𨫼偏鈰耜�",
        nav_about: "鈰桌偏 鈰鉮�鈰啤倏鈰��鈰�",
        nav_profile: "鈰兒偏 鈰芹�鈰啤�鈰徇�鈰耜�",
        nav_login: "鈰耜偏鈰鉮倏鈰兒�",
        nav_signup: "鈰詮�鈰兒� 鈰�高鈺�",
        nav_logout: "鈰耜偏鈰鉮� 鈰�做鈺��鈺�",
        select_language: "鈰冢偏鈰獅馬鈺� 鈰脚�鈰𠼭�鈰𨫼�鈰�陛鈰�",

        // Hero
        hero_tag: "鈰�飢鈰賴�鈰擒偽鈰賴� 鈰芹�鈰啤�鈰颴假鈺�",
        hero_title_1: "鈰芹�鈰啤鬼鈺�陘鈺温做 鈰芹陞鈰𨫼偏鈰耜馬鈺�",
        hero_title_2: "鈰𨫼馬鈺��鈺𢺋馬鈰�陛鈰�",
        hero_subtitle: "4,290 鈰𨫼�鈰颴� 鈰脚�鈺温�鈺�做 鈰𨫼�鈰�隻鈺温偽 鈰桌偽鈰賴偺鈺� 鈰啤偏鈰獅�鈰颴�鈰� 鈰芹�鈰啤鬼鈺�陘鈺温做 鈰芹陞鈰𨫼偏鈰耜�鈺� 鈰桌� 鈰�偽鈺温偎鈰戈馬鈺� 鈰菽�鈰��鈰兒� 鈰戈馬鈰賴�鈺� 鈰𠼭�鈰能�鈰﹤倏.",
        hero_search_placeholder: "鈰菽偺鈰詮�鈰詮�, 鈰啤偏鈰獅�鈰颴�鈰啤� 鈰耜�鈰舟偏 鈰菽�鈰戈�鈰戈倏鈰兒倏 鈰兒乾鈺肀隻鈺� 鈰𠼭�鈰能�鈰﹤倏...",
        hero_search_btn: "鈰芹陞鈰𨫼� 鈰菽�鈰戈�鈰�陛鈰�",

        // Stats
        stats_tag: "02. 鈰�做鈰鉮偏鈰嫩馬 鈰耜�鈰芹�",
        stats_header: "4,290+ 鈰芹陞鈰𨫼偏鈰� 鈰詮乾鈰擒�鈰擒偽 鈰�馬鈺�偶鈰�飢鈰擒馬鈰�",
        stats_problem_title: "鈰舟�鈰嗣做鈺温偺鈰擒高鈺温陘鈰��鈰� 4,290+ 鈰芹陞鈰𨫼偏鈰耜� 鈰凼馬鈺温馬鈰擒偺鈰�. 鈰芹�鈰啤�鈰耜�鈺� 20 鈰𨫼�鈰颴� 鈰戈�鈺温�鈺�做 鈰桌偏鈰戈�鈰啤乾鈺� 鈰戈�鈰耜�鈰詮�.",
        stats_problem_desc: "鈰𨫼�鈰�隻鈺温偽 鈰桌偽鈰賴偺鈺� 鈰啤偏鈰獅�鈰颴�鈰� 鈰芹�鈰啤鬼鈺�陘鈺温做鈰擒假鈺� 4,290 鈰芹�鈰鉮偏 鈰芹陞鈰𨫼偏鈰耜馬鈺� 鈰兒陛鈺�高鈺�陘鈺�馬鈺温馬鈰擒偺鈰�. 鈰厢馬鈰舟偽鈺温高鈰␡� AI 鈰�馬鈺温馬鈰賴�鈰颴倏鈰兒� 鈰响�鈺� 鈰菽�鈰舟倏鈰𨫼高鈺��鈰� 鈰戈�鈰詮�鈰戈�鈰�隻鈰�.",
        stats_solution_title: "鈰厢馬鈰舟偽鈺温高鈰␡� 鈰芹偽鈰賴健鈺温�鈰擒偽鈰�",
        stats_solution_desc: "鈰芹�鈰啤�鈰� 鈰芹�鈰啤�鈰徇�鈰耜��䓃�鈺� 鈰戈�鈰賴馬 鈰𨫼�鈰�隻鈺温偽 鈰桌偽鈰賴偺鈺� 鈰啤偏鈰獅�鈰颴�鈰� 鈰芹陞鈰𨫼偏鈰耜馬鈺� 鈰啤倏鈰能假鈺� 鈰颴�鈰桌��䓃假鈺� 鈰詮倏鈰徇偏鈰啤�鈰詮� 鈰𠼭�鈰詮�鈰戈�鈰�隻鈰�.",
        stats_card_1_title: "鈰��鈰舟�鈰眇偏鈰颴�鈰耜� 鈰凼馬鈺温馬 鈰芹陞鈰𨫼偏鈰耜�",
        stats_card_1_val: "4,290+",
        stats_card_2_title: "鈰芹�鈰啤�鈰� 鈰詮�鈰颴� 鈰�做鈰鉮偏鈰嫩馬",
        stats_card_2_val: "< 20",
        stats_card_3_title: "鈰凼�鈰賴陘 AI 鈰�偽鈺温偎鈰� 鈰戈馬鈰賴�鈺�",
        stats_card_3_val: "100%",

        // Categories
        cat_tag: "03. 鈰菽偽鈺温�鈰擒假鈺�",
        cat_header: "鈰啤�鈰鉮偏鈰耜� 鈰菽偏鈰啤�鈰鉮偏 鈰芹陞鈰𨫼偏鈰耜� (鈰桌�鈰戈�鈰戈� 4,290+ 鈰芹陞鈰𨫼偏鈰耜�)",
        cat_edu: "鈰菽倏鈰舟�鈰�",
        cat_health: "鈰菽�鈰舟�鈰� 鈰�偽鈺肀�鈺温偺鈰�",
        cat_women: "鈰桌偎鈰賴偃鈰� 鈰詮偏鈰抉倏鈰𨫼偏鈰啤陘",
        cat_employ: "鈰凼高鈰擒飢鈰�",
        cat_housing: "鈰鉮�鈰� 鈰兒倏鈰啤�鈰桌偏鈰␡�",
        cat_agri: "鈰菽�鈰能做鈰詮偏鈰能�",
        cat_skill: "鈰兒�鈰芹�鈰␡�鈰能偏鈰冢倏鈰菽�鈰舟�鈰抉倏",
        cat_bank: "鈰眇�鈰能偏鈰��鈰賴�鈰鉮� & 鈰徇�鈰兒偏鈰兒�鈰詮�",
        cat_energy: "鈰詮�鈰� 鈰菽倏鈰舟�鈰能�鈰戈�",
        cat_digital: "鈰﹤倏鈰厢倏鈰颴假鈺� 鈰��鈰﹤倏鈰能偏",
        cat_welfare: "鈰詮偏鈰桌偏鈰厢倏鈰� 鈰詮�鈰𨫼�鈰獅�鈰桌�",
        cat_transport: "鈰啤做鈰擒除鈰�",

        // Search & Directory
        dir_title: "鈰桌� 鈰𨫼�鈰詮� 鈰芹陞鈰𨫼偏鈰耜馬鈺� 鈰𨫼馬鈺��鈺𢺋馬鈰�陛鈰�",
        dir_showing: "鈰𠼭�鈰芹倏鈰詮�鈰戈�鈰�隻鈰�",
        dir_of: "鈰桌�鈰戈�鈰戈�",
        dir_schemes: "鈰芹陞鈰𨫼偏鈰耜假鈺�",
        filter_category: "鈰菽偽鈺温�鈰�",
        filter_ministry: "鈰桌�鈰戈�鈰啤倏鈰戈�鈰� 鈰嗣偏鈰�",
        filter_state: "鈰啤偏鈰獅�鈰颴�鈰啤�",
        filter_level: "鈰詮�鈰丞偏鈰能倏",
        filter_gender: "鈰耜倏鈰��鈰�",
        filter_income: "鈰�隻鈰擒偺 鈰菽偽鈺温�鈰�",
        filter_search_ph: "鈰芹�鈰啤鬼鈺�陘鈺温做 鈰芹陞鈰𨫼偏鈰耜馬鈺� 鈰菽�鈰戈�鈰�陛鈰�...",
        btn_search: "鈰菽�鈰戈�鈰�陛鈰�",
        btn_view_details: "鈰菽倏鈰菽偽鈰擒假鈺� 鈰𠼭�鈰﹤�鈰﹤倏",
        btn_save_fav: "鈰詮�鈰菽� 鈰𠼭�鈰能�鈰﹤倏",
        btn_remove_fav: "鈰詮�鈰菽� 鈰𠼭�鈰能鬲鈰﹤倏鈰�隻鈰�",
        btn_retry: "鈰桌偃鈺温偃鈺� 鈰芹�鈰啤偺鈰戈�鈰兒倏鈰��鈰�陛鈰�",

        // About Us
        about_tag: "05. 鈰桌偏 鈰鉮�鈰啤倏鈰��鈰�",
        about_header: "鈰桌�鈰桌� 鈰脚做鈰啤�",
        about_title_1: "鈰芹�鈰啤�鈰耜� 鈰桌偽鈰賴偺鈺�",
        about_title_2: "鈰芹�鈰啤鬼鈺�陘鈺温做鈰擒馬鈺温馬鈰� 鈰�馬鈺�偶鈰�飢鈰擒馬鈰賴�鈰𠼭陛鈰�.",
        about_desc: "鈰芹�鈰啤�鈰耜� 鈰桌偽鈰賴偺鈺� 鈰芹�鈰啤鬼鈺�陘鈺温做 鈰芹陞鈰𨫼偏鈰� 鈰桌飢鈺温偺 鈰菽�鈰能陘鈺温偺鈰擒偶鈰擒馬鈺温馬鈰� 鈰戈�鈺温�鈰賴�鈰𠼭陛鈰擒馬鈰賴�鈰� 鈰桌�鈰桌� 鈰𨫼�鈺温�鈺�鬲鈰﹤倏 鈰凼馬鈺温馬鈰擒乾鈺�. 鈰�偽鈺温偎鈰� 鈰𨫼假鈰賴�鈰賴馬 鈰芹�鈰啤陘鈰� 鈰芹�鈰啤�鈰兒倏鈰𨫼倏 鈰芹�鈰啤鬼鈺�陘鈺温做 鈰詮�鈰𨫼�鈰獅�鈰� 鈰徇假鈰擒假鈺� 鈰��鈰舟�鈺�偺鈰﹤乾鈺� 鈰桌偏 鈰耜�鈺温健鈺温偺鈰�.",
        about_mission_title: "鈰桌偏 鈰�偉鈰能�",
        about_mission_desc: "鈰芹�鈰啤鬼鈺�陘鈺温做 鈰芹陞鈰𨫼偏鈰� 鈰詮乾鈰鉮�鈰� 鈰詮乾鈰擒�鈰擒偽鈰擒馬鈺温馬鈰� 鈰��鈰舟倏鈰��鈰﹤� 鈰舟�鈰菽偏鈰啤偏 鈰芹�鈰啤�鈰耜馬鈺� 鈰詮偏鈰抉倏鈰𨫼偏鈰啤陘 鈰芹偽鈰賴�鈰﹤�.",
        about_serve_title: "鈰桌�鈰桌� 鈰脚做鈰啤倏鈰𨫼倏 鈰詮�鈰� 鈰𠼭�鈰詮�鈰戈偏鈰桌�",
        about_serve_desc: "鈰芹�鈰啤鬼鈺�陘鈺温做 鈰詮�鈰𨫼�鈰獅�鈰� 鈰芹陞鈰𨫼偏鈰� 鈰兒�鈰�陛鈰� 鈰芹�鈰啤偺鈺肀�鈰兒� 鈰芹�鈰�隻鈰擒假鈰兒�鈰𨫼�鈰兒� 鈰芹�鈰啤�鈰耜�鈰舟偽鈰賴�鈺�.",
        about_commit_title: "鈰桌偏 鈰𨫼�鈺温�鈺�鬲鈰擒�鈺�",
        about_commit_desc: "鈰遤�鈺温�鈰賴陘鈰桌�鈰� 鈰桌偽鈰賴偺鈺� 鈰兒做鈺�鈰𨫼偽鈰賴�鈰𠼭鬲鈰﹤倏鈰� 鈰詮乾鈰擒�鈰擒偽鈰擒馬鈺温馬鈰� 鈰��鈰舟倏鈰��鈰﹤�.",
        about_btn: "鈰桌偽鈰賴�鈰� 鈰戈�鈰耜�鈰詮�鈰𨫼�鈰�陛鈰� ��",

        // FAQ
        faq_tag: "06. 鈰芹�鈰啤偉鈺温馬鈰耜�",
        faq_header: "鈰戈偽鈰𠼭�鈰鉮偏 鈰�陛鈰賴�鈺� 鈰芹�鈰啤偉鈺温馬鈰耜�",
        faq_title_1: "鈰詮偏鈰抉偏鈰啤除",
        faq_title_2: "鈰芹�鈰啤偉鈺温馬鈰耜�.",
        faq_desc: "鈰厢馬鈰舟偽鈺温高鈰␡� 鈰舟�鈰菽偏鈰啤偏 鈰芹�鈰啤鬼鈺�陘鈺温做 鈰芹陞鈰𨫼偏鈰耜�鈺� 鈰舟偽鈰遤偏鈰詮�鈰戈� 鈰𠼭�鈰詮�鈰𨫼�鈰菽陛鈰� 鈰鉮�鈰啤倏鈰��鈰� 鈰桌�鈰啤� 鈰戈�鈰耜�鈰詮�鈰𨫼�鈰菽假鈰詮倏鈰� 鈰菽倏鈰獅偺鈰擒假鈺�.",
        faq_1_q: "鈰兒�鈰兒� 鈰响� 鈰芹陞鈰𨫼偏鈰兒倏鈰𨫼倏 鈰脚假鈰� 鈰舟偽鈰遤偏鈰詮�鈰戈� 鈰𠼭�鈰詮�鈰𨫼�鈰菽偏鈰耜倏?",
        faq_1_a: "'鈰芹陞鈰𨫼偏鈰耜馬鈺� 鈰�馬鈺温做鈺�健鈰賴�鈰𠼭�鈰﹤倏' 鈰菽倏鈰冢偏鈰鉮偏鈰兒倏鈰𨫼倏 鈰菽�鈰喪�鈰耜倏 鈰戈�鈰賴馬 鈰芹陞鈰𨫼偏鈰兒�鈰兒倏 鈰脚�鈰𠼭�鈰𨫼�鈰兒倏 鈰舟偽鈰遤偏鈰詮�鈰戈� 鈰𠼭�鈰詮�鈰𨫼�鈰菽�鈺温�鈺�.",
        faq_2_q: "鈰舟偽鈰遤偏鈰詮�鈰戈�鈰𨫼� 鈰� 鈰芹陘鈺温偽鈰擒假鈺� 鈰�做鈰詮偽鈰�?",
        faq_2_a: "鈰�飢鈰擒偽鈺� 鈰𨫼偏鈰啤�鈰﹤�, 鈰𠼭倏鈰啤�鈰兒偏鈰桌偏 鈰啤�鈰厢�鈰菽�, 鈰�隻鈰擒偺 鈰抉�鈰菽�鈰𨫼偽鈰� 鈰芹陘鈺温偽鈰� 鈰桌偽鈰賴偺鈺� 鈰𨫼�鈰� 鈰抉�鈰菽�鈰𨫼偽鈰� 鈰芹陘鈺温偽鈰擒假鈺� 鈰�做鈰詮偽鈰�.",
        faq_3_q: "鈰𨫼�鈰�隻鈺温偽 鈰芹陞鈰𨫼偏鈰耜�鈺� 鈰脚做鈰啤� 鈰�偽鈺温偎鈺�假鈺�?",
        faq_3_a: "鈰菽偺鈰詮�鈰詮�, 鈰�隻鈰擒偺鈰�, 鈰菽�鈰戈�鈰戈倏 鈰桌偽鈰賴偺鈺� 鈰芹�鈰啤偏鈰�陘鈰� 鈰�飢鈰擒偽鈰��鈰� 鈰�偽鈺温偎鈰� 鈰兒倏鈰啤�鈰␡偺鈰賴�鈰𠼭鬲鈰﹤�鈰戈�鈰�隻鈰�.",
        faq_4_q: "鈰舟偽鈰遤偏鈰詮�鈰戈� 鈰芹�鈰啤�鈺温偽鈰賴偺鈰𨫼� 鈰脚�鈰� 鈰詮乾鈰能� 鈰芹陛鈺�陘鈺��鈰舟倏?",
        faq_4_a: "鈰芹陞鈰𨫼偏鈰兒�鈰兒倏 鈰眇�鈺温�鈰� 鈰詮乾鈰能� 鈰桌偏鈰啤�鈰戈�鈰�隻鈰�. 鈰𨫼�鈰兒�鈰兒倏鈰��鈰賴�鈰� 鈰戈�鈺温健鈰� 鈰�乾鈺肀隻鈰� 鈰耜鬼鈰賴偶鈺温陘鈺��鈰舟倏.",
        faq_5_q: "鈰兒�鈰兒� 鈰响�鈺�偶鈰擒偽鈰� 鈰�馬鈺�� 鈰芹陞鈰𨫼偏鈰耜�鈺� 鈰舟偽鈰遤偏鈰詮�鈰戈� 鈰𠼭�鈰能做鈰𠼭�鈰𠼭偏?",
        faq_5_a: "鈰�做鈺�馬鈺�, 鈰桌�鈰啤� 鈰�偽鈺温偎鈰� 鈰𨫼假鈰賴�鈰賴馬 鈰�馬鈺温馬鈰� 鈰芹陞鈰𨫼偏鈰耜�鈺� 鈰舟偽鈰遤偏鈰詮�鈰戈� 鈰𠼭�鈰詮�鈰𨫼�鈰菽�鈺温�鈺�.",
        faq_6_q: "鈰兒偏 鈰舟偽鈰遤偏鈰詮�鈰戈� 鈰戈倏鈰啤偶鈺温�鈰啤倏鈰��鈰眇陛鈰賴陘鈺� 鈰兒�鈰兒� 鈰𥐰乾鈰� 鈰𠼭�鈰能偏鈰耜倏?",
        faq_6_a: "鈰戈倏鈰啤偶鈺温�鈰啤除鈰𨫼� 鈰鉮假 鈰𨫼偏鈰啤除鈰擒馬鈺温馬鈰� 鈰詮乾鈺�鈰𨫼�鈰獅倏鈰��鈰�, 鈰詮偽鈰賴偺鈺�馬 鈰芹陘鈺温偽鈰擒假鈰戈� 鈰桌偃鈺温假鈺� 鈰舟偽鈰遤偏鈰詮�鈰戈� 鈰𠼭�鈰詮�鈰𨫼�鈰菽�鈺温�鈺�.",

        // Details
        det_eligibility: "鈰�偽鈺温偎鈰� 鈰兒倏鈰眇�鈰抉馬鈰耜�",
        det_benefits: "鈰芹陞鈰𨫼� 鈰芹�鈰啤偺鈺肀�鈰兒偏鈰耜�",
        det_docs: "鈰𨫼偏鈰菽假鈰詮倏鈰� 鈰芹陘鈺温偽鈰擒假鈺�",
        det_faqs: "鈰戈偽鈰𠼭�鈰鉮偏 鈰�陛鈰賴�鈺� 鈰芹�鈰啤偉鈺温馬鈰耜�",

        // Profile
        prof_title: "鈰兒偏 鈰芹�鈰啤�鈰徇�鈰耜�",
        prof_completion: "鈰芹�鈰啤�鈰徇�鈰耜� 鈰芹�鈰啤�鈰戈倏 鈰嗣偏鈰戈�",
        prof_personal: "鈰菽�鈰能�鈺温陘鈰賴�鈰� 鈰菽倏鈰菽偽鈰擒假鈺�",
        prof_demographics: "鈰芹�鈰啤偏鈰�陘鈰� 鈰桌偽鈰賴偺鈺� 鈰耜倏鈰��鈰�",
        prof_financial: "鈰�隻鈰擒偺鈰� & 鈰菽�鈰戈�鈰戈倏",
        prof_saved: "鈰詮�鈰菽� 鈰𠼭�鈰詮倏鈰� 鈰芹陞鈰𨫼偏鈰耜�",
        prof_no_saved: "鈰��鈰𨫼偏 鈰� 鈰芹陞鈰𨫼偏鈰耜� 鈰詮�鈰菽� 鈰𠼭�鈰能鬲鈰﹤假鈺�隻鈺�."
    },
    ml: {
        // Nav & Header
        nav_home: "鉥嫩�鉥�",
        nav_schemes: "鉥芹揭鉞温揮鉥戈曾鉥𨫼翔",
        nav_about: "鉥𠒎�鉞温�鉥喪�鉥𨫼�鉥𨫼�鉥晤曾鉥𠼭�鉥𠼭�",
        nav_profile: "鉥脚捶鉞温敢鉞� 鉥芹�鉥啤�鉥徇�鉞�",
        nav_login: "鉥耜�鉥鉮曾鉞�",
        nav_signup: "鉥詮�鉞� 鉥�揪鉞温揪鉞�",
        nav_logout: "鉥耜�鉥鉮� 鉥𠰍�鉞温�鉞�",
        select_language: "鉥冢晷鉥� 鉥戈曾鉥啤�鉞温�鉞��鉞��鉞温�鉞��",

        // Hero
        hero_tag: "鉥𠰍揭鉞温敞鉞肀�鉥賴� 鉥芹�鉞潼�鉞温�鉞�",
        hero_title_1: "鉥詮絳鉥𨫼�鉥𨫼晷鉞� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔",
        hero_title_2: "鉥𨫼提鉞温�鉞�握鉞温握鉞��",
        hero_subtitle: "2,000-鉥耜揮鉥賴�鉥� 鉥𨫼�鉥兒�鉥舟�鉥�-鉥詮�鉥詮�鉥丞晷鉥� 鉥詮絳鉥𨫼�鉥𨫼晷鉞� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔鉥𨫼�鉥𨫼�鉥喪�鉥� 鉥兒曾鉥跃�鉥跃斑鉞��鉞� 鉥能�鉥鉮�鉥能握 鉥凼�鉞� 鉥芹敦鉥賴普鉞肀揮鉥賴�鉞温�鉞��.",
        hero_search_placeholder: "鉥菽敞鉥詮�鉥詮�, 鉥詮�鉥詮�鉥丞晷鉥兒� 鉥�散鉞温散鉞��鉞温�鉥賴善 鉥戈�鉥毯曾鉞� 鉥兒善鉥𨫼�鉥�...",
        hero_search_btn: "鉥芹揭鉞温揮鉥戈曾 鉥戈曾鉥啤敞鉞��",

        // Stats
        stats_tag: "02. 鉥�斯鉥眇�鉥抉�鉞温�鉞�敢鉥菽�",
        stats_header: "4,000+ 鉥芹揭鉞温揮鉥戈曾鉥𨫼斑鉞��鉞� 鉥菽曾鉥菽敦 鉥眇捶鉞温揮鉥�",
        stats_problem_title: "鉥啤晷鉥厢�鉥能握鉞温握鉞��鉥兒�鉥喪� 4,000-鉥戈�鉥戈曾鉥耜揮鉥賴�鉥� 鉥芹揭鉞温揮鉥戈曾鉥𨫼斑鉞�提鉞温�鉞�. 鉥芹�鉥啤捶鉞温揹鉥擒絳鉥𨫼�鉥𨫼� 20-鉞� 鉥戈晷鉥毯� 鉥桌晷鉥戈�鉥啤揹鉞� 鉥�敢鉥賴敞鉞�.",
        stats_problem_desc: "鉥𨫼�鉥兒�鉥舟�鉥�-鉥詮�鉥詮�鉥丞晷鉥� 鉥詮絳鉥𨫼�鉥𨫼晷鉥啤�鉥𨫼翔 4,000-鉥戈�鉥戈曾鉥耜揮鉥賴�鉥� 鉥詮�鉞�鉥� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔 鉥兒�鉥戈�鉥戈�鉥兒�鉥兒�. 鉥厢捶鉞温揭鉞潼揪鉞� AI 鉥�斯鉥能�鉥耜�鉥耜晷鉥� 鉥响敢鉞温敢 鉥芹�鉥耜晷鉥晤�鉥晤��䓃換鉞肀揹鉥賴善 鉥脚握鉞温握鉥賴�鉞温�鉞�捶鉞温捶鉞�.",
        stats_solution_title: "鉥厢捶鉞温揭鉞潼揪鉞� 鉥芹敦鉥賴晶鉥擒敦鉥�",
        stats_solution_desc: "鉥芹�鉥啤捶鉞温揹鉥擒敦鉞��鉞� 鉥芹�鉥啤�鉥徇�鉥耜曾鉥兒� 鉥�捶鉞�敞鉞肀�鉞温敞鉥桌晷鉥� 鉥𨫼�鉥兒�鉥舟�鉥�-鉥詮�鉥詮�鉥丞晷鉥� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔 鉥戈握鉞温晴鉥桌敞鉥� 鉥兒曾鉞潼揭鉞温揭鉞�普鉥賴�鉞温�鉞�捶鉞温捶鉞�.",
        stats_card_1_title: "鉥耜揚鉞温敞鉥桌晷鉥� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔",
        stats_card_1_val: "4,000+",
        stats_card_2_title: "鉥芹�鉥啤捶鉞温揹鉥擒敦鉞��鉞� 鉥嗣敦鉥擒普鉥啤曾 鉥�敢鉥賴斯鉞�",
        stats_card_2_val: "< 20",
        cat_skill: "鉥兒�鉥芹�鉥␡�鉥� 鉥菽曾鉥𨫼晴鉥兒�",
        cat_bank: "鉥眇晷鉥跃�鉥𨫼曾鉥��鉞� & 鉥抉捶鉥𨫼晷鉥啤�鉥能�",
        cat_energy: "鉥詮�鉥啤�鉞潼�鉞温�鉥�",
        cat_digital: "鉥﹤曾鉥厢曾鉥晤�鉥晤善 鉥�捶鉞温握鉞温敞",
        cat_welfare: "鉥詮晷鉥桌�鉥嫩曾鉥� 鉥𨫼�鉥獅�鉥桌�",
        cat_transport: "鉥鉮握鉥擒�鉥戈�",

        // Search & Directory
        dir_title: "鉥兒曾鉥跃�鉥跃翔鉥𨫼�鉥𨫼�鉥喪�鉥� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔 鉥𨫼提鉞温�鉞�握鉞温握鉞��",
        dir_showing: "鉥𨫼晷鉥␡曾鉥𨫼�鉥𨫼�鉥兒�鉥兒握鉞�",
        dir_of: "鉥��鉞�",
        dir_schemes: "鉥芹揭鉞温揮鉥戈曾鉥𨫼斑鉥賴善",
        filter_category: "鉥菽曾鉥冢晷鉥鉮�",
        filter_ministry: "鉥桌捶鉞温握鉞温敦鉥擒散鉥能�",
        filter_state: "鉥詮�鉥詮�鉥丞晷鉥兒�",
        filter_level: "鉥戈散鉥戈�鉥戈曾鉞�",
        filter_gender: "鉥耜曾鉥��鉥冢�鉥舟�",
        filter_income: "鉥菽敦鉞�揹鉥擒捶 鉥菽曾鉥冢晷鉥鉮�",
        filter_search_ph: "鉥詮絳鉥𨫼�鉥𨫼晷鉞� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔 鉥戈曾鉥啤敞鉞��...",
        btn_search: "鉥戈曾鉥啤敞鉞��",
        btn_view_details: "鉥菽曾鉥嗣揭鉥擒�鉥嗣�鉞温�鉞� 鉥𨫼晷鉥␡�鉥�",
        btn_save_fav: "鉥詮�鉥菽� 鉥𠼭�鉥能�鉥能�鉥�",
        btn_remove_fav: "鉥詮�鉥菽� 鉥𠼭�鉥能�鉥戈�",
        btn_retry: "鉥菽�鉥␡�鉥颴�鉥� 鉥嗣�鉥啤揹鉥賴�鉞温�鉞��",

        // About Us
        about_tag: "05. 鉥𠒎�鉞温�鉥喪�鉥𨫼�鉥𨫼�鉥晤曾鉥𠼭�鉥𠼭�",
        about_header: "鉥𠒎�鉞温�鉞� 鉥�敦鉞�",
        about_title_1: "鉥芹�鉥啤捶鉞温揹鉥擒敦鉞�敞鉞��",
        about_title_2: "鉥詮絳鉥𨫼�鉥𨫼晷鉥啤曾鉥兒�鉥能�鉥� 鉥眇捶鉞温揮鉥賴揪鉞温揪鉥賴�鉞温�鉞�捶鉞温捶鉞�.",
        about_desc: "鉥芹�鉥啤捶鉞温揹鉥擒敦鉞�� 鉥詮絳鉥𨫼�鉥𨫼晷鉞� 鉥芹揭鉞温揮鉥戈曾鉥𨫼斑鉞�� 鉥戈揹鉞温揹鉥賴散鉞�斑鉞温斑 鉥��鉥耜� 鉥𨫼�鉥晤敞鉞温�鉞温�鉞�� 鉥脚捶鉞温捶鉥戈晷鉥␡� 鉥𠒎�鉞温�鉥喪�鉥颴� 鉥耜�鉞温晰鉞温敞鉥�. 鉥�絳鉥嫩敦鉥擒敞 鉥脚散鉞温散鉥� 鉥芹�鉥啤捶鉞温揹鉥擒絳鉥𨫼�鉥𨫼�鉥� 鉥�捶鉞��鉞�散鉞温敞鉥跃�鉥跃翔 鉥凼敢鉥芹�鉥芹晷鉥𨫼�鉥𨫼�鉥兒�鉥兒�.",
        about_mission_title: "鉥𠒎�鉞温�鉥喪�鉥颴� 鉥耜�鉞温晰鉞温敞鉥�",
        about_mission_desc: "鉥詮絳鉥𨫼�鉥𨫼晷鉞� 鉥芹揭鉞温揮鉥戈曾鉥𨫼斑鉞��鉞温�鉞�敢鉥賴�鉞温�鉞�斑鉞温斑 鉥詮揹鉥鉮�鉥啤揹鉥擒敞 鉥菽曾鉥菽敦鉥跃�鉥跃翔 鉥兒善鉥𨫼曾 鉥芹�鉥啤捶鉞温揹鉥擒敦鉞� 鉥嗣晷鉥𨫼�鉥戈�鉥𨫼敦鉥賴�鉞温�鉞��.",
        about_serve_title: "鉥�絳鉥𨫼�鉥𨫼晷鉥␡� 鉥詮�鉥菽捶鉥�",
        about_serve_desc: "鉥詮絳鉥𨫼�鉥𨫼晷鉞� 鉥芹揭鉞温揮鉥戈曾鉥𨫼斑鉞��鉞� 鉥�捶鉞��鉞�散鉞温敞鉥� 鉥兒�鉥颴晷鉞� 鉥��鉞温敦鉥嫩曾鉥𨫼�鉥𨫼�鉥兒�鉥� 鉥脚散鉞温散鉥� 鉥芹�鉥啤捶鉞温揹鉥擒絳鉥𨫼�鉥𨫼�鉥�.",
        about_commit_title: "鉥𠒎�鉞温�鉥喪�鉥颴� 鉥凼敢鉥芹�鉥芹�",
        about_commit_desc: "鉥𨫼�鉥戈�鉥能斯鉞�� 鉥𨫼晷鉥耜曾鉥𨫼斯鉞�揹鉥擒敞 鉥菽曾鉥菽敦鉥跃�鉥跃翔 鉥兒善鉥𨫼�鉥�.",
        about_btn: "鉥𨫼�鉥颴�鉥戈善 鉥�敢鉥賴敞鉞�� ��",

        // FAQ
        faq_tag: "06. 鉥𠼭�鉥舟�鉥能�鉞温�鉞�",
        faq_header: "鉥芹握鉥賴斯鉥擒敞鉥� 鉥𠼭�鉥舟曾鉥𨫼�鉥𨫼�鉥兒�鉥� 鉥𠼭�鉥舟�鉥能�鉞温�鉞�",
        faq_title_1: "鉥芹�鉥戈�鉥菽晷鉥�",
        faq_title_2: "鉥𠼭�鉥舟�鉥能�鉞温�鉞�.",
        faq_desc: "鉥厢捶鉞温揭鉞潼揪鉞� 鉥菽斐鉥� 鉥詮絳鉥𨫼�鉥𨫼晷鉞� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔鉥𨫼�鉥𨫼� 鉥�揪鉞��鉞温晰鉥賴�鉞温�鉞�捶鉞温捶鉥戈曾鉥兒�鉥𨫼�鉥𨫼�鉥晤曾鉥𠼭�鉥𠼭� 鉥兒曾鉥跃�鉥跃翔 鉥�敢鉥賴敞鉞�提鉞温�鉥戈�鉥耜�鉥耜晷鉥�.",
        faq_1_q: "鉥脚捶鉥賴�鉞温�鉞� 鉥脚�鉞温�鉥兒� 鉥响敦鉞� 鉥芹揭鉞温揮鉥戈曾鉥𨫼�鉥𨫼� 鉥�揪鉞��鉞温晰鉥賴�鉞温�鉥擒�?",
        faq_1_a: "'鉥芹揭鉞温揮鉥戈曾鉥𨫼翔 鉥𨫼提鉞温�鉞�握鉞温握鉞��' 鉥菽曾鉥冢晷鉥鉮握鉞温握鉥賴善 鉥芹�鉥能曾 鉥�捶鉞�敞鉞肀�鉞温敞鉥桌晷鉥� 鉥芹揭鉞温揮鉥戈曾 鉥戈曾鉥啤�鉞温�鉞��鉞�握鉞温握鉞� 鉥�揪鉞��鉞温晰鉥賴�鉞温�鉥擒�.",
        faq_2_q: "鉥�揪鉞��鉞温晰鉥賴�鉞温�鉥擒絰 鉥𥐰握鉞𢺋�鉞温�鉞� 鉥啤�鉥遤�鉞� 鉥菽�鉥␡�?",
        faq_2_a: "鉥�揮鉥擒絳 鉥𨫼晷鉞潼插鉞�, 鉥菽曾鉥耜晷鉥� 鉥啤�鉥�, 鉥菽敦鉞�揹鉥擒捶 鉥詮絳鉥颴�鉥颴曾鉥徇曾鉥𨫼�鉥𨫼敢鉞温敢鉞�, 鉥厢晷鉥戈曾 鉥詮絳鉥颴�鉥颴曾鉥徇曾鉥𨫼�鉥𨫼敢鉞温敢鉞� 鉥脚捶鉞温捶鉥賴斯 鉥菽�鉥␡�.",
        faq_3_q: "鉥𨫼�鉥兒�鉥舟�鉥� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔鉥𨫼�鉥𨫼� 鉥�絳鉥𨫼�鉥𨫼晷鉥␡� 鉥能�鉥鉮�鉥能握?",
        faq_3_a: "鉥菽敞鉥詮�鉥詮�, 鉥菽敦鉞�揹鉥擒捶鉥�, 鉥戈�鉥毯曾鉞�, 鉥芹�鉥啤揭鉞�普鉥� 鉥脚捶鉞温捶鉥賴斯鉥能�鉥颴� 鉥��鉥賴晴鉞温揖鉥擒捶鉥戈�鉥戈曾鉥耜晷鉥␡� 鉥能�鉥鉮�鉥能握 鉥兒曾鉞潼提鉞温提鉥能曾鉥𨫼�鉥𨫼�鉥兒�鉥兒握鉞�.",
        faq_4_q: "鉥�揪鉞��鉞温晰鉥� 鉥兒�鉥芹�鉥賴�鉞擒�鉞温�鉞� 鉥脚握鉞温敦 鉥詮揹鉥能揹鉞��鉞��鉞温�鉞��?",
        faq_4_a: "鉥芹揭鉞温揮鉥戈曾鉥𨫼斑鉞� 鉥�普鉞温敦鉥能曾鉥𠼭�鉥𠼭� 鉥詮揹鉥能� 鉥菽�鉥能握鉞温敞鉥擒晴鉥芹�鉥芹�鉥颴�鉥兒�鉥兒�. 鉥𠼭曾鉥耜握鉥賴捶鉞� 鉥凼�鉞� 鉥��鉥鉮�鉥𨫼晷鉥啤� 鉥耜揚鉥賴�鉞温�鉞��.",
        faq_5_q: "鉥脚捶鉥賴�鉞温�鉞� 鉥响敦鉞�晴鉥桌敞鉥� 鉥响捶鉞温捶鉥賴散鉥抉曾鉥𨫼� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔鉥𨫼�鉥𨫼� 鉥�揪鉞��鉞温晰鉥賴�鉞温�鉥擒揹鉞�?",
        faq_5_a: "鉥�握鉞�, 鉥能�鉥鉮�鉥能握鉥能�鉥喪�鉥� 鉥脚散鉞温散鉥� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔鉥𨫼�鉥𨫼�鉥� 鉥�揪鉞��鉞温晰鉥賴�鉞温�鉥擒�.",
        faq_6_q: "鉥脚捶鉞温敢鉞� 鉥�揪鉞��鉞温晰 鉥兒曾鉥啤晴鉥賴�鉞温�鉥芹�鉥芹�鉥颴�鉥颴晷鉞� 鉥脚捶鉞温握鉞� 鉥𠼭�鉥能�鉥能提鉥�?",
        faq_6_a: "鉥兒曾鉥啤晴鉥賴�鉞温�鉥擒捶鉞�斑鉞温斑 鉥𨫼晷鉥啤提鉥� 鉥芹敦鉥賴普鉞肀揮鉥賴�鉞温�鉞� 鉥嗣敦鉥賴敞鉥擒敞 鉥啤�鉥遤�鉥喪�鉥颴� 鉥菽�鉥␡�鉥颴�鉥� 鉥�揪鉞��鉞温晰鉥賴�鉞温�鉥擒�.",

        // Details
        det_eligibility: "鉥能�鉥鉮�鉥能握鉥� 鉥桌晷鉥兒揭鉥␡�鉥﹤�鉞温�鉞�",
        det_benefits: "鉥芹揭鉞温揮鉥戈曾 鉥�捶鉞��鉞�散鉞温敞鉥跃�鉥跃翔",
        det_docs: "鉥�斯鉥嗣�鉥能揹鉥擒敞 鉥啤�鉥遤�鉞�",
        det_faqs: "鉥芹握鉥賴斯鉥擒敞鉥� 鉥𠼭�鉥舟曾鉥𨫼�鉥𨫼�鉥兒�鉥� 鉥𠼭�鉥舟�鉥能�鉞温�鉞�",

        // Profile
        prof_title: "鉥脚捶鉞温敢鉞� 鉥芹�鉥啤�鉥徇�鉞�",
        prof_completion: "鉥芹�鉥啤�鉥徇�鉞� 鉥芹�鉞潼握鉞温握鉞�鉥𨫼敦鉥␡�",
        prof_personal: "鉥菽�鉥能�鉞温握鉥賴�鉥� 鉥菽曾鉥菽敦鉥跃�鉥跃翔",
        prof_demographics: "鉥芹�鉥啤揭鉞�普鉥�, 鉥耜曾鉥��鉥冢�鉥舟�",
        prof_financial: "鉥菽敦鉞�揹鉥擒捶鉥� & 鉥戈�鉥毯曾鉞�",
        prof_saved: "鉥詮�鉥菽� 鉥𠼭�鉥能�鉥� 鉥芹揭鉞温揮鉥戈曾鉥𨫼翔",
        prof_no_saved: "鉥芹揭鉞温揮鉥戈曾鉥𨫼斑鉞𢺋捶鉞温捶鉞�� 鉥詮�鉥菽� 鉥𠼭�鉥能�鉥戈曾鉥颴�鉥颴曾鉥耜�鉥�."
    }
};

// Dynamic Pattern Translation Engine for Real-Time Scheme Content
const PATTERNS = {
    kn: [
        { regex: /Pradhan Mantri/gi, replacement: "鉦芹�鉦啤異鉦擒疏 鉦桌�鉦戈�鉦啤窒" },
        { regex: /Mukhyamantri/gi, replacement: "鉦桌�鉦遤�鉦能皎鉦�略鈳温盒鉦�" },
        { regex: /Scheme/gi, replacement: "鉦能�鉦厢疏鈳�" },
        { regex: /Yojana/gi, replacement: "鉦能�鉦厢疏鈳�" },
        { regex: /Kisan/gi, replacement: "鉦啤�鉦戈盒" },
        { regex: /Surya Ghar/gi, replacement: "鉦詮�鉦� 鉦桌疏鈳�" },
        { regex: /Official State Government welfare initiative by/gi, replacement: "鉦�異鉦賴�鈳�略 鉦啤移鉦厢�鉦� 鉦詮盒鈳温�鉦擒盒鉦� 鉦𨫼眷鈳温盔鉦擒產 鉦能�鉦厢疏鈳� -" },
        { regex: /providing direct financial assistance, subsidies, and benefit transfers/gi, replacement: "鉦兒�鉦� 鉦嫩產鉦𨫼移鉦詮窒鉦� 鉦兒�鉦啤眶鈳�, 鉦詮痊鈳温硫鉦賴瓷鉦� 鉦桌略鈳温略鈳� 鉦詮�鉦耜痍鈳温盔 鉦菽盒鈳温�鉦擒眶鉦␡� 鉦响畢鉦鉮窒鉦詮�鉦戈�鉦戈畢鈳�" },
        { regex: /Direct Benefit Transfer \(DBT\) state grant up to/gi, replacement: "鉦兒�鉦� 鉦兒�鉦舟� 鉦菽盒鈳温�鉦擒眶鉦␡� (DBT) 鉦啤移鉦厢�鉦� 鉦詮盒鈳温�鉦擒盒鉦� 鉦兒�鉦啤眶鈳� 鉦鉮盒鉦賴眺鈳温�" },
        { regex: /per year\./gi, replacement: "鉦芹�鉦啤略鉦� 鉦菽盒鈳温眺鉦𨫼�鉦𨫼�." },
        { regex: /Eligibility:/gi, replacement: "鉦�盒鈳温硃鉦戈�:" },
        { regex: /Permanent residents and domicile holders of/gi, replacement: "鉦菽移鉦詮硫鈳温畦鉦� 鉦嫩�鉦�畢鉦賴盒鈳�眶 鉦遤移鉦能� 鉦兒窒鉦菽移鉦詮窒鉦鉮眾鈳�" },
        { regex: /belonging to low & middle-income households\./gi, replacement: "鉦𨫼瓷鉦賴皎鈳� 鉦桌略鈳温略鈳� 鉦桌異鈳温盔鉦� 鉦�畢鉦擒盔鉦� 鉦𨫼�鉦颴�鉦�痊鉦鉮眾鉦賴�鈳� 鉦詮�鉦啤窒鉦舟眶鉦啤�." },
        { regex: /Aadhaar Card, Domicile Certificate, Bank Account Details, Income Proof\./gi, replacement: "鉦�異鉦擒盒鈳� 鉦𨫼移鉦啤�鉦﹤�, 鉦菽移鉦詮硫鈳温畦鉦� 鉦芹�鉦啤皎鉦擒產鉦芹略鈳温盒, 鉦眇�鉦能移鉦��鈳� 鉦遤移鉦戈� 鉦菽窒鉦菽盒鉦鉮眾鈳�, 鉦�畢鉦擒盔 鉦芹�鉦啤皎鉦擒產鉦芹略鈳温盒." },
        { regex: /Submit application online via official/gi, replacement: "鉦�異鉦賴�鈳�略 鉦詮盒鈳温�鉦擒盒鉦� 鉦芹�鉦啤�鉦颴眷鈳� 鉦桌�鉦耜� 鉦�疏鈳𨧀�䓃眷鈳�疏鈳𨧀�䓃疏鉦耜�鉦耜窒 鉦�盒鈳温�鉦� 鉦詮眷鈳温眷鉦賴硫鉦�" },
        { regex: /state service portal or visit local Seva Kendra\./gi, replacement: "鉦�畦鉦菽移 鉦嫩略鈳温略鉦賴盒鉦� 鉦詮�鉦菽移 鉦𨫼�鉦�畢鈳温盒鉦𨫼�鉦𨫼� 鉦冢�鉦颴窒 鉦兒�鉦﹤窒." }
    ],
    ta: [
        { regex: /Pradhan Mantri/gi, replacement: "鉈芹挪鉈啤恕鉈桌扇鉒�" },
        { regex: /Mukhyamantri/gi, replacement: "鉈桌�鉈戈挈鉈桌�鉈𠼭�鉈𠼭扇鉒�" },
        { regex: /Scheme/gi, replacement: "鉈戈挪鉈颴�鉈颴悅鉒�" },
        { regex: /Yojana/gi, replacement: "鉈戈挪鉈颴�鉈颴悅鉒�" },
        { regex: /Kisan/gi, replacement: "鉈菽挪鉈菽�鉈擒悖鉈�" },
        { regex: /Surya Ghar/gi, replacement: "鉈𠼭�鉈啤挪鉈� 鉈菽�鉈颴�" },
        { regex: /Official State Government welfare initiative by/gi, replacement: "鉈�恕鉈賴�鉈擒扇鉈芹�鉈芹�鉈啤�鉈� 鉈桌挽鉈兒挪鉈� 鉈�扇鉈𠼭� 鉈兒挈鉈戈�鉈戈挪鉈颴�鉈颴悅鉒� -" },
        { regex: /providing direct financial assistance, subsidies, and benefit transfers/gi, replacement: "鉈兒�鉈啤�鉈� 鉈兒挪鉈戈挪 鉈凼恕鉈菽挪 鉈桌拳鉒温拳鉒�悅鉒� 鉈桌挽鉈拈挪鉈能�鉒温�鉈喪� 鉈菽捎鉈跃�鉈𨫼�鉈𨫼挪鉈晤恕鉒�" },
        { regex: /Direct Benefit Transfer \(DBT\) state grant up to/gi, replacement: "鉈兒�鉈啤�鉈� 鉈芹恐鉈芹�鉈芹扇鉈賴悅鉈擒拳鉒温拳鉈桌� (DBT) 鉈桌挽鉈兒挪鉈� 鉈凼恕鉈菽挪鉈戈� 鉈戈�鉈𨫼�" },
        { regex: /per year\./gi, replacement: "鉈�恐鉒温�鉒��鉒温�鉒�." },
        { regex: /Eligibility:/gi, replacement: "鉈戈�鉒�恕鉈�:" },
        { regex: /Aadhaar Card, Domicile Certificate, Bank Account Details, Income Proof\./gi, replacement: "鉈�恕鉈擒扇鉒� 鉈��鉒温�鉒�, 鉈�扇鉒�悚鉒温悚鉈賴�鉈𠼭� 鉈𠼭挽鉈拈�鉈晤�, 鉈菽�鉒温�鉈� 鉈𨫼恐鉈𨫼�鉈𨫼� 鉈菽挪鉈菽扇鉈跃�鉈𨫼拿鉒�, 鉈菽扇鉒�悅鉈擒悟鉈𠼭� 鉈𠼭挽鉈拈�鉈晤�." }
    ],
    te: [
        { regex: /Pradhan Mantri/gi, replacement: "鈰芹�鈰啤飢鈰擒馬 鈰桌�鈰戈�鈰啤倏" },
        { regex: /Mukhyamantri/gi, replacement: "鈰桌�鈰遤�鈰能乾鈰�陘鈺温偽鈰�" },
        { regex: /Scheme/gi, replacement: "鈰芹陞鈰𨫼�" },
        { regex: /Yojana/gi, replacement: "鈰芹陞鈰𨫼�" },
        { regex: /Kisan/gi, replacement: "鈰啤�鈰戈�" },
        { regex: /Surya Ghar/gi, replacement: "鈰詮�鈰� 鈰�假鈺温假鈺�" },
        { regex: /Official State Government welfare initiative by/gi, replacement: "鈰�飢鈰賴�鈰擒偽鈰賴� 鈰啤偏鈰獅�鈰颴�鈰� 鈰芹�鈰啤鬼鈺�陘鈺温做 鈰詮�鈰𨫼�鈰獅�鈰� 鈰芹陞鈰𨫼� -" },
        { regex: /providing direct financial assistance, subsidies, and benefit transfers/gi, replacement: "鈰兒�鈰啤�鈰鉮偏 鈰�偽鈺温陞鈰賴� 鈰詮偎鈰擒偺鈰� 鈰桌偽鈰賴偺鈺� 鈰詮鬲鈺温偶鈰賴陛鈺�鈰耜馬鈺� 鈰��鈰舟倏鈰詮�鈰戈�鈰�隻鈰�" },
        { regex: /Direct Benefit Transfer \(DBT\) state grant up to/gi, replacement: "鈰兒�鈰啤�鈰鉮偏 鈰兒�鈰舟� 鈰眇隻鈰賴假鈺� (DBT) 鈰啤偏鈰獅�鈰颴�鈰� 鈰詮偎鈰擒偺鈰�" },
        { regex: /per year\./gi, replacement: "鈰詮�鈰菽陘鈺温偶鈰啤偏鈰兒倏鈰𨫼倏." },
        { regex: /Eligibility:/gi, replacement: "鈰�偽鈺温偎鈰�:" },
        { regex: /Aadhaar Card, Domicile Certificate, Bank Account Details, Income Proof\./gi, replacement: "鈰�飢鈰擒偽鈺� 鈰𨫼偏鈰啤�鈰﹤�, 鈰兒倏鈰菽偏鈰� 鈰抉�鈰菽�鈰𨫼偽鈰� 鈰芹陘鈺温偽鈰�, 鈰眇�鈰能偏鈰��鈺� 鈰遤偏鈰戈偏 鈰菽倏鈰菽偽鈰擒假鈺�, 鈰�隻鈰擒偺 鈰抉�鈰菽�鈰𨫼偽鈰� 鈰芹陘鈺温偽鈰�." }
    ],
    ml: [
        { regex: /Pradhan Mantri/gi, replacement: "鉥芹�鉥啤揮鉥擒捶鉥桌捶鉞温握鉞温敦鉥�" },
        { regex: /Mukhyamantri/gi, replacement: "鉥桌�鉥遤�鉥能揹鉥兒�鉥戈�鉥啤曾" },
        { regex: /Scheme/gi, replacement: "鉥芹揭鉞温揮鉥戈曾" },
        { regex: /Yojana/gi, replacement: "鉥芹揭鉞温揮鉥戈曾" },
        { regex: /Kisan/gi, replacement: "鉥𨫼絳鉥獅�" },
        { regex: /Surya Ghar/gi, replacement: "鉥詮�鉥啤�鉞潼�鉞温� 鉥菽�鉥颴�" },
        { regex: /Official State Government welfare initiative by/gi, replacement: "鉥𠰍揭鉞温敞鉞肀�鉥賴� 鉥詮�鉥詮�鉥丞晷鉥� 鉥詮絳鉥𨫼�鉥𨫼晷鉞� 鉥𨫼�鉥獅�鉥� 鉥芹揭鉞温揮鉥戈曾 -" },
        { regex: /providing direct financial assistance, subsidies, and benefit transfers/gi, replacement: "鉥兒�鉥啤曾鉥颴�鉥颴�鉥喪�鉥� 鉥抉捶鉥詮晶鉥擒敞鉥菽�鉥� 鉥詮摒鉞𨧀�䓃晴鉥賴插鉥賴敞鉞�� 鉥兒善鉥𨫼�鉥兒�鉥兒�" },
        { regex: /Direct Benefit Transfer \(DBT\) state grant up to/gi, replacement: "鉥兒�鉥啤曾鉥颴�鉥颴�鉥喪�鉥� 鉥芹提 鉥𨫼�鉥桌晷鉥晤�鉥晤� (DBT) 鉥詮�鉥詮�鉥丞晷鉥� 鉥鉮�鉥啤晷鉥兒�鉥晤�" },
        { regex: /per year\./gi, replacement: "鉥芹�鉥啤握鉥賴斯鉞潼晰鉥�." },
        { regex: /Eligibility:/gi, replacement: "鉥能�鉥鉮�鉥能握:" },
        { regex: /Aadhaar Card, Domicile Certificate, Bank Account Details, Income Proof\./gi, replacement: "鉥�揮鉥擒絳 鉥𨫼晷鉞潼插鉞�, 鉥菽曾鉥耜晷鉥� 鉥詮晷鉥𨫼�鉥獅�鉥能揪鉥戈�鉥啤�, 鉥眇晷鉥跃�鉥𨫼� 鉥��鉞温�鉞鉮提鉞温�鉞� 鉥菽曾鉥菽敦鉥跃�鉥跃翔, 鉥菽敦鉞�揹鉥擒捶 鉥詮絳鉥颴�鉥颴曾鉥徇曾鉥𨫼�鉥𨫼敢鉞温敢鉞�." }
    ]
};

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        return localStorage.getItem('app_language') || 'en';
    });

    const changeLanguage = (langCode) => {
        if (translations[langCode]) {
            setCurrentLanguage(langCode);
            localStorage.setItem('app_language', langCode);
        }
    };

    const t = (key) => {
        const langDict = translations[currentLanguage] || translations.en;
        return langDict[key] || translations.en[key] || key;
    };

    const translateText = (text) => {
        if (!text || typeof text !== 'string' || currentLanguage === 'en') return text;
        const replacements = PATTERNS[currentLanguage];
        if (!replacements) return text;

        let translated = text;
        replacements.forEach(({ regex, replacement }) => {
            translated = translated.replace(regex, replacement);
        });
        return translated;
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t, translateText, LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
