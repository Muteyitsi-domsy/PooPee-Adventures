import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF5EE",
        }}
      >
        <svg width="320" height="320" viewBox="0 0 100 100" fill="none">
          <path
            d="M50 6 C50 6 88 54 88 78 A38 38 0 1 1 12 78 C12 54 50 6 50 6 Z"
            fill="#6B93A6"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
