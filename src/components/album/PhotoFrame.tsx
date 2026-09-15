import { useState } from "react";
import { CameraIcon } from "../icons/CameraIcon";

interface PhotoFrameProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export function PhotoFrame({ src, alt, className, imgClassName }: PhotoFrameProps) {
  const [failed, setFailed] = useState(false);
  const filename = src.split("/").pop();

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-light/20 to-accent/20 text-center ${className ?? ""}`}
      >
        <CameraIcon className="h-8 w-8 text-primary/60" />
        <span className="px-3 text-xs font-medium text-[var(--fg-muted)]">
          Add photo:{" "}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10">
            {filename}
          </code>
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className ?? ""} ${imgClassName ?? ""}`}
    />
  );
}
