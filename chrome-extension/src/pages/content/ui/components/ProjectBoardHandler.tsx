import { useEffect } from "react";
import ReactDOM from "react-dom";

import {
  asyncGet,
  addOverlay,
  removeOverlay,
  waitFor,
} from "@src/shared/utils";
import { MagicButton } from "./MagicButton";

const targetCycle = "Current";
// const targetCycle = "Mar 12";

const delay = (ms) =>
  new Promise((resolve) =>
    setTimeout(() => {
      return resolve;
    }, ms)
  );

const createHeaderButtons = (header) => {
  const dropdownButtons = header.querySelectorAll(
    'button[aria-haspopup="true"]'
  );

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
  addOverlay();

  const cardsWrapper = header.nextElementSibling;

  if (cardsWrapper) {
    // Select all cards
    const allCards = Array.from(
      cardsWrapper.querySelectorAll('[data-testid="board-view-column-card"]')
    );

    // Filter out cards that are inside a data-board-column="Done" element
    const cards = allCards.filter(
      (card) => !card.closest('[data-board-column="Done"]')
    );

    for (const card of cards) {
      await openSidePanel(card);
    }
  }

  removeOverlay();
};

const handleProjectsSection = async (sidePanel, projectsSection) => {
  // Find the <p> that contains the text 'Cycle'
  const cycleParagraph = Array.from(projectsSection.querySelectorAll("p")).find(
    (p: HTMLElement) => p.textContent === "Cycle"
  ) as HTMLElement;

  if (cycleParagraph) {
    // Get the next sibling of the <p> tag
    const cycleButton = cycleParagraph.nextElementSibling as HTMLButtonElement;

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

  const currentCycleLabel = items.find((element: HTMLElement) =>
    element.textContent.includes(targetCycle)
  ) as HTMLElement;

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

export function ProjectBoardHandler() {
  if (!window.location.hostname.includes("github")) return null;

  useEffect(() => {
    const groupHeaders = document.querySelectorAll(
      '[data-testid^="group-header-"]'
    );

    groupHeaders.forEach((header) => {
      createHeaderButtons(header);
    });
  }, []);

  return null;
}
