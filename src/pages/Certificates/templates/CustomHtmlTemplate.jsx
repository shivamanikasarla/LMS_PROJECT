import React, { useMemo } from 'react';

const CustomHtmlTemplate = ({ data, design }) => {
  // Default template if none provided
  const userCode = design.customHtml || `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Times New Roman', serif; text-align: center; padding: 40px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 100vh; box-sizing: border-box; }
    h1 { color: #d4af37; font-size: 40px; margin-bottom: 10px; }
    .name { font-size: 50px; font-weight: bold; margin: 20px 0; border-bottom: 2px solid #333; display: inline-block; padding: 0 40px; }
    .course { color: #555; font-size: 24px; margin-top: 10px; }
    .footer { margin-top: 50px; font-size: 14px; color: #888; }
  </style>
</head>
<body>
  <h1>Certificate of Achievement</h1>
  <p>This certifies that</p>
  <div class="name">{{recipientName}}</div>
  <p>has successfully completed the course</p>
  <div class="course">{{courseName}}</div>
  
  <div class="footer">
    Issued on: {{date}} <br/>
    ID: {{certificateId}}
  </div>
  
  <script>
    console.log("Certificate Loaded for", "{{recipientName}}");
  </script>
</body>
</html>
    `;

  // Generate Final HTML with replacements
  const finalSrcDoc = useMemo(() => {
    let code = userCode;

    // Raw Data Values
    const sigSrc = data.signatureImage || "";
    const sigText = data.signatureText || "Authorized Signature";

    // Pre-formatted Signature HTML Block
    const sigBlockHtml = data.signatureImage
      ? `<img src="${data.signatureImage}" alt="Signature" style="max-height: 50px; vertical-align: bottom;" />`
      : `<span style="font-family: cursive; font-size: 1.2em;">${sigText}</span>`;

    const replacements = {
      '{{recipientName}}': data.recipientName || "Student Name",
      '{{courseName}}': data.courseName || "Course Name",
      '{{date}}': data.date ? new Date(data.date).toLocaleDateString() : new Date().toLocaleDateString(),
      '{{instructorName}}': data.instructorName || "Instructor Name",
      '{{certificateId}}': data.certificateId || "CERT-SAMPLE-ID",
      '{{signature}}': sigBlockHtml, // Formatted block
      '{{signatureImage}}': sigSrc,  // Raw URL
      '{{signatureText}}': sigText   // Raw Text
    };

    // Replace placeholders safely
    Object.keys(replacements).forEach(key => {
      // using split/join is a safe equivalent to replaceAll without regex escaping issues
      code = code.split(key).join(replacements[key]);
    });

    return code;
  }, [userCode, data]);

  return (
    <iframe
      title="Custom Design Render"
      srcDoc={finalSrcDoc}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        overflow: 'hidden',
        backgroundColor: 'transparent'
      }}
      // Enable scripts to allow JS execution as requested ("any type of code")
      sandbox="allow-scripts allow-same-origin"
    />
  );
};

export default CustomHtmlTemplate;
