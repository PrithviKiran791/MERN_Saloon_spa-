import { useEffect, useState, type ReactNode } from "react";
import "./typewriter-effect.css";

type TypewriterWord = {
  text: string;
  className?: string;
};

type TypewriterEffectProps = {
  words: TypewriterWord[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  cursor?: ReactNode;
  className?: string;
};

export function TypewriterEffect({
  words,
  typingSpeed = 70,
  deletingSpeed = 38,
  pauseDuration = 1800,
  cursor = "|",
  className = "",
}: Readonly<TypewriterEffectProps>) {
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleLength, setVisibleLength] = useState(1);
  const [deleting, setDeleting] = useState(false);

  const currentWord = words[wordIndex] ?? { text: "" };
  const visibleText = currentWord.text.slice(0, visibleLength);

  useEffect(() => {
    if (!words.length) return;

    const isComplete = visibleLength === currentWord.text.length;
    let delay = typingSpeed;
    if (isComplete && !deleting) {
      delay = pauseDuration;
    } else if (deleting) {
      delay = deletingSpeed;
    }
    const timer = window.setTimeout(() => {
      if (!deleting && !isComplete) {
        setVisibleLength((length) => length + 1);
      } else if (!deleting && isComplete) {
        setDeleting(true);
      } else if (deleting && visibleLength > 0) {
        setVisibleLength((length) => length - 1);
      } else {
        setDeleting(false);
        setWordIndex((index) => (index + 1) % words.length);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [currentWord.text, deleting, deletingSpeed, pauseDuration, typingSpeed, visibleLength, words.length]);

  return (
    <span className={`typewriter-effect ${className}`} aria-live="polite">
      <span className={currentWord.className}>{visibleText}</span>
      <span className="typewriter-effect__cursor" aria-hidden="true">{cursor}</span>
    </span>
  );
}

export default TypewriterEffect;
