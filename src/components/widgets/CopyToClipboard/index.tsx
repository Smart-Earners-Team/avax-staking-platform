import React, { useRef, useState } from "react";
import Button from "components/Button/Button";

interface CopyToClipboardProps {
  title?: string;
  content: string;
}
export default function CopyToClipboard({
  title,
  content,
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);
  const codeElement = useRef<HTMLElement>(null);

  const copyAddress = () => {
    const text = codeElement.current?.textContent;
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1500);
        })
        .catch(() => {
          setCopied(false);
        });
    }
  };

  return (
    <div>
      <div className="relative p-5 mb-4 md:mb-8 rounded-lg bg-gray-100 max-w-lg flex mx-auto">
        <pre className="overflow-x-scroll p-1 pl-4 flex-1 text-lg md:text-xl text-gray-700">
          {title && `${title}:`}{" "}
          <code ref={codeElement} onClick={copyAddress}>
            {content}
          </code>
        </pre>
        {copied && (
          <span
            className="absolute p-1 bg-gray-50 ring-1 ring-gray-500 right-2
          top-2 text-xs font-medium text-gray-600"
          >
            Copied!
          </span>
        )}
      </div>
      <Button variant="secondary" onClick={copyAddress} className="px-12">
        COPY LINK
      </Button>
    </div>
  );
}
