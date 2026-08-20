import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const DisplayMarkdown = ({ content }) => {
    const { translateText } = useLanguage();

    if (!content) return null;

    // Replace HTML entities
    const decodeHtmlEntities = (text) => {
        return text
            .replace(/&lt;br&gt;/g, '')
            .replace(/&gt;/g, '>')
            .replace(/&amp;amp;/g, '&')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&#39;/g, "'")
            .replace(/<br>/g, '\n');
    };

    // Handle inline formatting
    const formatLine = (text) => {
        const translatedLine = translateText(text);
        const parts = translatedLine.split(/\*\*(.*?)\*\*/g);
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return (
                    <strong key={index} className="font-black uppercase text-xs tracking-wider">
                        {part}
                    </strong>
                );
            }
            return part;
        });
    };

    // Convert the content to paragraphs and handle formatting
    const formatContent = (text) => {
        const lines = text.split('\n');
        const result = [];
        let inList = false;
        let listItems = [];
        let inNumberedList = false;
        let numberedItems = [];

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            // Handle blockquotes
            if (trimmedLine.startsWith('>')) {
                if (inList) {
                    result.push(
                        <ul key={`list-${index}`} className="list-disc ml-6 mb-4 space-y-1">
                            {listItems}
                        </ul>
                    );
                    inList = false;
                    listItems = [];
                }
                if (inNumberedList) {
                    result.push(
                        <ol key={`numbered-list-${index}`} className="list-decimal ml-6 mb-4 space-y-1">
                            {numberedItems}
                        </ol>
                    );
                    inNumberedList = false;
                    numberedItems = [];
                }
                result.push(
                    <blockquote key={index} className="border-l-4 border-swiss-accent pl-4 py-2 my-4 font-medium text-sm">
                        {formatLine(trimmedLine.substring(1).trim())}
                    </blockquote>
                );
                return;
            }

            // Handle bullet points
            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('●')) {
                if (inNumberedList) {
                    result.push(
                        <ol key={`numbered-list-${index}`} className="list-decimal ml-6 mb-4 space-y-1">
                            {numberedItems}
                        </ol>
                    );
                    inNumberedList = false;
                    numberedItems = [];
                }
                inList = true;
                listItems.push(
                    <li key={`item-${index}`} className="mb-2 font-medium text-sm">
                        {formatLine(trimmedLine.substring(1).trim())}
                    </li>
                );
                return;
            }

            // Handle numbered lists
            const numberedListMatch = trimmedLine.match(/^(\d+)\.\s(.+)/);
            if (numberedListMatch) {
                if (inList) {
                    result.push(
                        <ul key={`list-${index}`} className="list-disc ml-6 mb-4 space-y-1">
                            {listItems}
                        </ul>
                    );
                    inList = false;
                    listItems = [];
                }
                inNumberedList = true;
                numberedItems.push(
                    <li key={`numbered-item-${index}`} className="mb-2 font-medium text-sm">
                        {formatLine(numberedListMatch[2])}
                    </li>
                );
                return;
            }

            // Handle regular paragraphs
            if (inList) {
                result.push(
                    <ul key={`list-${index}`} className="list-disc ml-6 mb-4 space-y-1">
                        {listItems}
                    </ul>
                );
                inList = false;
                listItems = [];
            }
            if (inNumberedList) {
                result.push(
                    <ol key={`numbered-list-${index}`} className="list-decimal ml-6 mb-4 space-y-1">
                        {numberedItems}
                    </ol>
                );
                inNumberedList = false;
                numberedItems = [];
            }

            result.push(
                <p key={index} className="mb-4 font-medium text-sm leading-relaxed">
                    {formatLine(trimmedLine)}
                </p>
            );
        });

        if (inList && listItems.length > 0) {
            result.push(
                <ul key="final-list" className="list-disc ml-6 mb-4 space-y-1">
                    {listItems}
                </ul>
            );
        }
        if (inNumberedList && numberedItems.length > 0) {
            result.push(
                <ol key="final-numbered-list" className="list-decimal ml-6 mb-4 space-y-1">
                    {numberedItems}
                </ol>
            );
        }

        return result;
    };

    const decodedContent = decodeHtmlEntities(content);
    const formattedContent = formatContent(decodedContent);

    return (
        <div className="font-inter">
            {formattedContent}
        </div>
    );
};

export default DisplayMarkdown;
