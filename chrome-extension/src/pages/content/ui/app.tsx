import { useEffect } from "react";
import ReactDOM from "react-dom";

const targetCycle = "Current";
// const targetCycle = "Mar 12";

const delay = (ms) =>
  new Promise((resolve) =>
    setTimeout(() => {
      return resolve;
    }, ms)
  );

const MagicButton = ({ onClick }) => {
  return (
    <button
      className="MagicButton"
      onClick={() => {
        console.log("clicked");
        onClick();
      }}
    >
      ✨ Move all to current cycle
    </button>
  );
};

const waitFor = (findElement, timeLimit = 5000) => {
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

const getByTestId = (testId, element = document) => {
  return element.querySelector(`[data-testid^="${testId}"]`);
};

const asyncGet = async (testId) => {
  try {
    return await waitFor(() => getByTestId(testId));
  } catch (error) {
    console.error(error);
  }
};

const createHeaderButtons = (header) => {
  const dropdownButtons = header.querySelectorAll(
    'button[aria-haspopup="true"]'
  );

  console.log(">>>>>", { header, dropdownButtons });

  dropdownButtons.forEach((dropdownButton) => {
    dropdownButton.addEventListener("click", async () => {
      try {
        const dropdownMenu = await waitFor(() =>
          document.querySelector('[aria-label="Items"]')
        );

        if (dropdownMenu) {
          const container = document.createElement("div");
          container.className = "MagicButtonContainer";
          dropdownMenu.appendChild(container);

          ReactDOM.render(
            <MagicButton onClick={() => handleClick(header)} />,
            container
          );
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
};

const openSidePanel = async (card) => {
  try {
    const links = card.getElementsByTagName("a");

    if (links.length > 0) {
      const lastLink = links[links.length - 1];
      lastLink.click();

      const sidePanelTarget = await asyncGet("side-panel-focus-target");

      if (sidePanelTarget) {
        const sidePanel = sidePanelTarget.nextElementSibling;

        if (sidePanel) {
          const projectsSection = await asyncGet("sidebar-projects-section");

          if (projectsSection) {
            await handleProjectsSection(sidePanel, projectsSection);
          }
          const closeButton = await waitFor(() =>
            sidePanel.querySelector('[aria-label="Close panel"]')
          );
          if (closeButton) {
            closeButton.click();
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const handleClick = async (header) => {
  const cardsWrapper = header.nextElementSibling;

  if (cardsWrapper) {
    const cards = cardsWrapper.querySelectorAll(
      '[data-testid="board-view-column-card"]'
    );

    for (const card of cards) {
      await openSidePanel(card);
    }
  }
};

const handleProjectsSection = async (sidePanel, projectsSection) => {
  // Find the <p> that contains the text 'Cycle'
  const cycleParagraph = Array.from(projectsSection.querySelectorAll("p")).find(
    (p) => p.textContent === "Cycle"
  );

  if (cycleParagraph) {
    // Get the next sibling of the <p> tag
    const cycleButton = cycleParagraph.nextElementSibling;

    if (cycleButton) {
      cycleButton.click();

      const itemPickerRoot = await asyncGet("item-picker-root");
      handleItemPicker(itemPickerRoot);
    }
  }
};

const handleItemPicker = async (itemPickerRoot) => {
  if (!itemPickerRoot) return;

  const items = Array.from(itemPickerRoot.querySelectorAll("span"));

  const currentCycleLabel = items.find((element) =>
    element.textContent.includes(targetCycle)
  );

  if (currentCycleLabel) {
    let parent = currentCycleLabel.parentElement;

    // Traverse upwards until you find an element with role="option"
    while (parent && parent.getAttribute("role") !== "option") {
      parent = parent.parentElement;
    }

    // If a parent with role="option" is found, click on it
    if (parent) {
      parent.click();

      await delay(10000);
    }
  }
};

export default function App() {
  useEffect(() => {
    const groupHeaders = document.querySelectorAll(
      '[data-testid^="group-header-"]'
    );

    groupHeaders.forEach((header) => {
      createHeaderButtons(header);
    });
  }, []);

  return <div className=""></div>;
}
