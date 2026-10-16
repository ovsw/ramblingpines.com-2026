/* eslint-disable @next/next/no-img-element -- ImageResponse renders embedded image data. */
import { fitOgTitle } from "@/lib/og-image";
import brand from "@/public/brand/brand.json";

export function OgImage({
  title,
  photoUrl,
  logo,
  mark,
}: {
  title: string;
  photoUrl?: string;
  logo: string;
  mark: string;
}) {
  const fittedTitle = fitOgTitle(title);
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: brand.color,
        color: "white",
        overflow: "hidden",
      }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />
      ) : (
        <img
          src={mark}
          alt=""
          width={340}
          height={340}
          style={{ position: "absolute", right: 70, top: 145, opacity: 0.25 }}
        />
      )}
      {photoUrl ? (
        <div
          style={{
            display: "flex",
            position: "absolute",
            // The card renderer ignores `inset`, so the overlay needs a size.
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            // Darken only the corners that hold text: the top for the logo,
            // the bottom left for the heading. The photo stays clear elsewhere.
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 32%), linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0) 62%)",
          }}
        />
      ) : null}
      <img
        src={logo}
        alt=""
        width={190}
        height={147}
        style={{ position: "absolute", top: 44, left: 64, objectFit: "contain" }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 80,
          bottom: 64,
          width: 760,
          fontFamily: "Brand",
          fontSize: fittedTitle.fontSize,
          fontWeight: 600,
          lineHeight: 1.1,
          textShadow: "0 2px 16px rgba(0,0,0,0.55)",
        }}
      >
        {fittedTitle.text}
      </div>
    </div>
  );
}
