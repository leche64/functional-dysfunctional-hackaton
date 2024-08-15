"use client"
import { useEffect } from "react";

const CursorEffect = () => {
  useEffect(() => {
    const cursorTrail: HTMLElement[] = [];

    const createCursor = (x: number, y: number) => {
      const cursor = document.createElement("span");
      cursor.textContent = "💩";
      cursor.style.position = "absolute";
      cursor.style.pointerEvents = "none";
      cursor.style.transition = "opacity 0.5s";
      cursor.style.opacity = "1";
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      document.body.appendChild(cursor);
      cursorTrail.push(cursor);

      setTimeout(() => {
        cursor.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(cursor);
          cursorTrail.splice(cursorTrail.indexOf(cursor), 1);
        }, 500);
      }, 1000);
    };

    const moveCursor = (e: MouseEvent) => {
      createCursor(e.pageX, e.pageY);
    };

    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      cursorTrail.forEach(cursor => document.body.removeChild(cursor));
    };
  }, []);

  return null;
};

export default CursorEffect;