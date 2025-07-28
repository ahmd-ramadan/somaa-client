'use client'

import { useRef, useEffect, useState } from "react";

export default function AutoTriangleBorderImage({ src="/emara-logo.png", alt = "", triangleSize = 16, imgClass = "" }) {
    // هنا بالضبط: <HTMLImageElement>
    const imgRef = useRef<HTMLImageElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
    useEffect(() => {
      function updateDimensions() {
        if (imgRef.current) {
          setDimensions({
            width: imgRef.current.offsetWidth,
            height: imgRef.current.offsetHeight,
          });
        }
      }
      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }, []);

  // عدد المثلثات داخل الطول والعرض
  const horizontalCount = Math.floor(dimensions.width / triangleSize);
  const verticalCount = Math.floor(dimensions.height / triangleSize);

  // مولد صفوف و أعمدة المثلثات
  const makeTriangles = (count: any, rotate: any, color: any) =>
    Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-2 h-2"
        style={{
          background: color,
          clipPath: "polygon(50% 0, 100% 100%, 0% 100%)",
          transform: `rotate(${rotate}deg)`,
          flex: "none"
        }}
      />
    ));

  const greenA = "#27ae60", greenB = "#16a085";

  return (
    <div className="relative w-fit h-fit inline-block">
      {/* الصورة */}
      <img
        ref={imgRef}
        height={20}

        src={src}
        alt={alt}
        className={"block rounded " + imgClass}
        style={{ display: "block" }}
        onLoad={() => {
          if (imgRef.current) {
            setDimensions({
              width: imgRef.current?.offsetWidth,
              height: imgRef.current?.offsetHeight,
            });
          }
        }}
      />
      {/* مثلثات أعلى */}
      <div
        className="absolute left-0 top-0 flex"
        style={{
          width: "100%",
          height: triangleSize,
        }}
      >
        {}
        {/* {makeTriangles(horizontalCount, 0, greenA)} */}
      </div>
      {/* مثلثات أسفل */}
      <div
        className="absolute left-0 bottom-0 flex"
        style={{
          width: "100%",
          height: triangleSize,
        }}
      >
        {}
        {/* {makeTriangles(horizontalCount, 180, greenB)} */}
      </div>
      {/* مثلثات يسار */}
      <div
        className="absolute left-0 top-0 flex flex-col"
        style={{
          height: "100%",
          width: triangleSize,
        }}
      >{}
        {/* {makeTriangles(verticalCount, -90, greenB)} */}
      </div>
      {/* مثلثات يمين */}
      <div
        className="absolute right-0 top-0 flex flex-col"
        style={{
          height: "100%",
          width: triangleSize,
        }}
      >{}
        {/* {makeTriangles(verticalCount, 90, greenA)} */}
      </div>
    </div>
  );
}