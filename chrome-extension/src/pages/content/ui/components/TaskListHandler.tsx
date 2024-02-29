import { useEffect } from "react";
import ReactDOM from "react-dom";

import { appendTo, delay, waitFor } from "@src/shared/utils";
import { MagicButton } from "./MagicButton";

const getAllTasklistsTitles = () => {
  return document.querySelectorAll("tasklist-block-title");
};

const getAllTasklists = () => {
  const titles = getAllTasklistsTitles();
  return Array.from(titles).map(
    (title) => title.parentElement.nextElementSibling
  );
};

const getRows = (tasklist) => {
  return Array.from(tasklist.children).filter(
    (child, index) =>
      child.tagName.toLowerCase() === "li" && !child.hasAttribute("hidden")
  );
};

async function processRow(rows, taskListIndex, itemIndex = 0) {
  console.log("Processing row", itemIndex, "of", rows.length);
  if (itemIndex >= rows.length) {
    return; // All rows have been processed
  }

  const row = rows[itemIndex];
  const button = Array.from(row.querySelectorAll("button")).find((button) =>
    button.textContent.includes("Convert to issue")
  );

  if (button) {
    button.click();

    await new Promise((resolve) => {
      const observer = new MutationObserver(async () => {
        const newTitles = getAllTasklists();
        const newRows = getRows(newTitles[taskListIndex]);

        const hasBecomeIssue = await waitFor(() => {
          return newRows[itemIndex].querySelector(".issue-state-icon");
        });

        if (hasBecomeIssue) {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(document, { childList: true, subtree: true });
    });
  }

  // Process the next row
  await processRow(rows, taskListIndex, itemIndex + 1);
}

export function TaskListHandler(menuTrigger) {
  const handleMagicClick = async (tasklist, taskListIndex) => {
    const taskListRows = getRows(tasklist);
    await processRow(taskListRows, taskListIndex);
  };

  const handleMenuClick = (
    menuTrigger: HTMLButtonElement,
    tasklistTitle: HTMLElement,
    index: number
  ) => {
    // Assuming foundElement is the element you've found
    let sibling = menuTrigger.nextElementSibling;
    let ul;
    // Traverse through the siblings until you find the one that contains a <ul>
    while (sibling) {
      ul = sibling.querySelector("ul");
      if (ul) {
        break;
      }
      sibling = sibling.nextElementSibling;
    }

    appendTo(
      ul,
      <MagicButton
        onClick={() =>
          handleMagicClick(
            tasklistTitle.parentElement.nextElementSibling,
            index
          )
        }
      >
        Convert all to issues
      </MagicButton>
    );
  };

  useEffect(() => {
    const taskListBlocksTitles = getAllTasklistsTitles();

    if (!taskListBlocksTitles) return;

    taskListBlocksTitles.forEach((title, index) => {
      const taskListBlock = title.nextElementSibling;
      const menuTrigger = taskListBlock
        .querySelector(".tracking-block-list-item-dropdown-menu")
        .querySelector("button");

      menuTrigger.addEventListener("click", () =>
        handleMenuClick(menuTrigger, title, index)
      );
    });
  }, []);
  return <div className="taskListHandler"></div>;
}
