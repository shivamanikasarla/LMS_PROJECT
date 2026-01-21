import { useEffect, useState } from "react";

const Typewriter = ({
  texts = [],
  typingSpeed = 100,
  deletingSpeed = 60,
  delayBetween = 1500,
  loop = true,
  cursor = true,
  cursorChar = "|",
  cursorBlinkSpeed = 500,
}) => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blinking
  useEffect(() => {
    if (!cursor) return;
    const blink = setInterval(
      () => setShowCursor(prev => !prev),
      cursorBlinkSpeed
    );
    return () => clearInterval(blink);
  }, [cursor, cursorBlinkSpeed]);

  // Typing logic
  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;

    if (!currentText) return;

    if (!isDeleting && displayed.length < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentText.slice(0, displayed.length + 1));
      }, typingSpeed);
    }
    else if (!isDeleting && displayed.length === currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), delayBetween);
    }
    else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentText.slice(0, displayed.length - 1));
      }, deletingSpeed);
    }
    else if (isDeleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setTextIndex(prev =>
          loop ? (prev + 1) % texts.length : prev
        );
      }, 0);
    }

    return () => clearTimeout(timeout);
  }, [
    displayed,
    isDeleting,
    textIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    delayBetween,
    loop
  ]);

  return (
    <span className="d-inline-block">
      {displayed}
      {cursor && (
        <span
          className={`fw-bold ms-1 ${showCursor ? "opacity-100" : "opacity-0"}`}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default Typewriter;
