import React from "react";
import { useLanguage } from "../../../../context/LanguageContext";

const TextWrapper = ({ children, bold, underline, italic }) => {
    const { translateText } = useLanguage();
    const style = {};
    if (bold) style.fontWeight = '900';
    if (underline) style.textDecoration = 'underline';
    if (italic) style.fontStyle = 'italic';

    return <span style={style}>{translateText(children)}</span>;
};

const renderChildren = (children) => {
    if (!children) return null;
    return children.map((child, index) => {
        const text = child.text || '';

        if (child.type === "link") {
            return (
                <a
                    href={child.link}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-swiss-accent font-black underline uppercase text-xs tracking-wider hover:text-swiss-black transition-colors duration-150"
                >
                    {renderChildren(child.children)}
                </a>
            );
        }

        return (
            <TextWrapper key={index} bold={child.bold} underline={child.underline} italic={child.italic}>
                {text}
            </TextWrapper>
        );
    });
};

const TableComponent = ({ children }) => (
    <div className="overflow-x-auto my-6 border-4 border-swiss-black">
        <table className="min-w-full border-collapse">
            <tbody>
                {children.map((row, index) => (
                    <tr key={index} className="border-b-2 border-swiss-black last:border-b-0 font-medium text-sm">
                        {row.children.map((cell, cellIndex) => (
                            <td key={cellIndex} className="p-3 border-r-2 border-swiss-black last:border-r-0 text-swiss-black">
                                {renderChildren(cell.children)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const processListItems = (items) => {
    return items.map((item, index) => {
        if (item.type === "ol_list") {
            return (
                <ol key={index} className="list-decimal pl-6 mt-2 space-y-1">
                    {processListItems(item.children)}
                </ol>
            );
        }
        if (item.type === "list_item") {
            return (
                <li key={index} className="mb-2 text-swiss-black font-medium text-sm">
                    {renderChildren(item.children.filter(child => child.type !== "ol_list"))}
                    {item.children.filter(child => child.type === "ol_list").map((sublist, subIndex) => (
                        <ol key={subIndex} className="list-decimal pl-6 mt-2 space-y-1">
                            {processListItems(sublist.children)}
                        </ol>
                    ))}
                </li>
            );
        }
        return null;
    });
};

const RenderList = ({ list }) => {
    if (!list?.children) return null;

    return (
        <ol className="list-decimal pl-6 my-4 space-y-2 text-swiss-black">
            {processListItems(list.children)}
        </ol>
    );
};

const AlignJustify = ({ content }) => {
    return content.map((item, index) => {
        switch (item.type) {
            case "ol_list":
                return (
                    <RenderList key={index} list={item} />
                );
            case "paragraph":
                return (
                    <p key={index} className="my-2 text-swiss-black font-medium text-sm leading-relaxed">
                        {renderChildren(item.children)}
                    </p>
                );
            default:
                return null;
        }
    });
};

const RenderContent = ({ content }) => {
    if (!content) return null;

    return content.map((item, index) => {
        switch (item.type) {
            case "align_justify":
                return (
                    <div key={index} className="space-y-4">
                        <AlignJustify content={item.children} />
                    </div>
                );
            case "paragraph":
                return (
                    <p key={index} className="my-2 text-swiss-black font-medium text-sm leading-relaxed">
                        {renderChildren(item.children)}
                    </p>
                );

            case "block_quote":
                return (
                    <blockquote key={index} className="border-l-4 border-swiss-accent pl-4 my-4 bg-swiss-muted p-3 text-swiss-black font-medium text-sm">
                        {renderChildren(item.children)}
                    </blockquote>
                );

            case "ol_list":
                return (
                    <RenderList key={index} list={item} />
                );

            case "ul_list":
                return (
                    <RenderList key={index} list={item} />
                );

            case "table":
                return <TableComponent key={index} children={item.children} />;

            default:
                return (
                    <div key={index} className="my-2 text-swiss-black font-medium text-sm">
                        {renderChildren(item.children)}
                    </div>
                );
        }
    });
};

const DisplayFormatted = ({ benefitsData }) => {
    if (!benefitsData || benefitsData.length === 0) {
        return <div className="text-swiss-black font-black text-xs uppercase tracking-widest p-4">No data available</div>;
    }

    return (
        <div className="font-inter">
            {benefitsData.map((item, index) => (
                <RenderContent key={index} content={[item]} />
            ))}
        </div>
    );
};

export default DisplayFormatted;