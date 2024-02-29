import ReactDOM from "react-dom";
import { StarLoader } from "@src/pages/content/ui/components/StarLoader";
type AsyncElement = Promise<HTMLButtonElement>;

export const addOverlay = () => {
  const overlay = document.createElement("div");
  overlay.id = "git-glider-overlay";
  document.body.appendChild(overlay);
  ReactDOM.render(<StarLoader />, overlay);
};

export const removeOverlay = () => {
  const overlay = document.getElementById("git-glider-overlay");
  if (overlay) {
    overlay.remove();
    requestAnimationFrame(() => {
      document.body.click();
    });
  }
};

export const waitFor = (findElement, timeLimit = 5000): AsyncElement => {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutations, observer) => {
      const element = findElement();
      if (element && !element.querySelector('[class*="LoadingSkeleton"]')) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document, { childList: true, subtree: true });

    const timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element not found within ${timeLimit} ms`));
    }, timeLimit);

    const element = findElement();
    if (element && !element.querySelector('[class*="LoadingSkeleton"]')) {
      clearTimeout(timeoutId);
      observer.disconnect();
      resolve(element);
    }
  });
};

export const getByTestId = (testId, element = document) => {
  return element.querySelector(`[data-testid^="${testId}"]`);
};

export const asyncGet = async (testId: string): Promise<Element> => {
  try {
    return await waitFor(() => getByTestId(testId));
  } catch (error) {
    console.error(error);
  }
};
