import React, { useRef, useEffect, useState } from "react";
import Draggable from "./Draggable";

const PAGE_SIZE = {
    A4: {
        landscape: { w: 1000, h: 707 },
        portrait: { w: 707, h: 1000 }
    }
};

const CertificateRenderer = ({
    template,
    data,
    isDesigning = false,
    scale: fixedScale,
    onUpdateTemplate,
    onSelectElement,
    selectedId
}) => {
    if (!template) return null;

    const { page, theme, elements } = template;
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    const { w, h } = PAGE_SIZE[page.type][page.orientation];

    // Scale calculation
    useEffect(() => {
        if (fixedScale) {
            setScale(fixedScale);
            return;
        }
        const resize = () => {
            if (containerRef.current) {
                setScale(containerRef.current.clientWidth / w);
            }
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, [fixedScale, w]);

    const updateElement = (id, patch) => {
        if (!onUpdateTemplate) return;
        onUpdateTemplate({
            ...template,
            elements: elements.map(el =>
                el.id === id ? { ...el, ...patch } : el
            )
        });
    };

    // Custom HTML / Code Mode
    if (template.customHtml) {
        const finalSrcDoc = React.useMemo(() => {
            let code = template.customHtml;
            const sigSrc = data.signatureImage || "";
            const sigText = data.signatureText || "Authorized Signature";
            const sigBlockHtml = data.signatureImage
                ? `<img src="${data.signatureImage}" alt="Signature" style="max-height: 50px; vertical-align: bottom;" />`
                : `<span style="font-family: cursive; font-size: 1.2em;">${sigText}</span>`;

            const replacements = {
                '{{recipientName}}': data.recipientName || "Student Name",
                '{{courseName}}': data.courseName || "Course Name",
                '{{date}}': data.date ? new Date(data.date).toLocaleDateString() : new Date().toLocaleDateString(),
                '{{instructorName}}': data.instructorName || "Instructor Name",
                '{{certificateId}}': data.certificateId || "CERT-SAMPLE-ID",
                '{{signature}}': sigBlockHtml,
                '{{signatureImage}}': sigSrc,
                '{{signatureText}}': sigText
            };

            Object.keys(replacements).forEach(key => {
                code = code.split(key).join(replacements[key]);
            });
            return code;
        }, [template.customHtml, data]);

        return (
            <div ref={containerRef} style={{ width: "100%", paddingTop: "70%", position: "relative" }}>
                <iframe
                    srcDoc={finalSrcDoc}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", overflow: "hidden" }}
                    sandbox="allow-scripts allow-same-origin"
                    title="Certificate"
                />
            </div>
        );
    }

    // Standard JSON Elements Mode
    return (
        <div ref={containerRef} style={{ width: "100%" }}>
            <div
                style={{
                    width: w,
                    height: h,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    position: "relative",
                    background: theme.backgroundImage
                        ? `url(${theme.backgroundImage})`
                        : "#fff",
                    backgroundSize: "cover",
                    fontFamily: theme.fontFamily,
                    color: theme.textColor,
                    boxShadow: "0 4px 6px rgba(0,0,0,.1)"
                }}
            >
                {elements.map(el => (
                    <Draggable
                        key={el.id}
                        initialPos={{ x: el.x, y: el.y }}
                        initialSize={{ w: el.w, h: el.h }}
                        isEnabled={isDesigning}
                        resizable={isDesigning}
                        isSelected={selectedId === el.id}
                        onSelect={() => onSelectElement && onSelectElement(el.id)}
                        onDragEnd={pos => updateElement(el.id, pos)}
                        onResizeEnd={size => updateElement(el.id, size)}
                    >
                        {el.type === "text" && (
                            <div style={el.style}>
                                {(el.content || "").replace(
                                    /{{(.*?)}}/g,
                                    (_, k) => data[k] || ""
                                )}
                            </div>
                        )}

                        {el.type === "image" && (
                            <img
                                src={el.src}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    opacity: el.style?.opacity !== undefined ? el.style.opacity : 1
                                }}
                            />
                        )}
                    </Draggable>
                ))}
            </div>
        </div>
    );
};

export default CertificateRenderer;
