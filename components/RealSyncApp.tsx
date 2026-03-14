import { useEffect, useRef } from "react";
import Head from "next/head";

const RealSyncApp = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/legacy.html")
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const body = doc.body;
        if (containerRef.current) {
          containerRef.current.innerHTML = body.innerHTML;
          // Execute scripts
          const scripts = containerRef.current.querySelectorAll("script");
          scripts.forEach((oldScript) => {
            const newScript = document.createElement("script");
            if (oldScript.src) {
              newScript.src = oldScript.src;
            } else {
              newScript.textContent = oldScript.textContent;
            }
            oldScript.parentNode?.replaceChild(newScript, oldScript);
          });
          // Inject styles
          const styles = doc.querySelectorAll("style");
          styles.forEach((style) => {
            document.head.appendChild(style.cloneNode(true));
          });
        }
      });
  }, []);

  return (
    <>
      <Head>
        <title>REALSYNC+ — Synchronisierung &amp; Automation</title>
        <meta name="description" content="RealSync Dynamics baut kryptografische Verifikations-Tools" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div ref={containerRef} />
    </>
  );
};

export default RealSyncApp;
