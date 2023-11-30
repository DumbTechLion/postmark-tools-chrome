
const src = chrome.runtime.getURL("scripts/postal-mime/postal-mime.js");
import(src).then(PostalMimeModule => {
    async function downloadAttachments() {
      const code = document.querySelector(
        "div.email-preview_snippet > pre > code"
      ).innerText;
      const parser = new PostalMimeModule.default();
      const email = await parser.parse(code);
      email.attachments.forEach((attachment) => {
        const blob = new Blob([attachment.content], { type: attachment.mimeType });
        const url = URL.createObjectURL(blob);
        chrome.runtime.sendMessage({ url: url, filename: attachment.filename });
      });
    }
    
    const downloadButtonSection = document.querySelector(
      "body > div.page > div.page-wrap.page-wrap--full-padding > div.email-preview > ul > li.msg"
    );
    const downloadButton = downloadButtonSection.querySelector("a");
    const downloadButtonClone = downloadButton.cloneNode(true);
    downloadButton.tagName = "button";
    downloadButton.removeAttribute("href");
    downloadButton.textContent = "Download attached files";
    downloadButton.onclick = downloadAttachments;
    downloadButtonSection.appendChild(downloadButtonClone);
})

