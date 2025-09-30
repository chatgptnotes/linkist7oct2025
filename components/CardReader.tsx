"use client";
import { useEffect } from "react";
import "./CardReader.css";

export default function CardReader() {
  return (
    <div className="card-reader-animation">
      <div className="reader">
        <div className="reader__bar"></div>
        <div className="reader__placeholder"></div>
        <div className="reader__cc-shadow"></div>
      </div>
      <div className="cc">
        <div className="cc__chip"></div>
      </div>
    </div>
  );
}