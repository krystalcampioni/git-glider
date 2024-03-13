import { appendTo, prependTo } from "@root/src/shared/utils";
import { useEffect, useState } from "react";

export function NotificationsHandler() {
  const getGroups = () => {
    return document.querySelectorAll(".js-notifications-group");
  };
  const handleCheckedCount = () => {
    const groups = document.querySelectorAll(".js-notifications-group");

    groups.forEach((group) => {
      const checkboxes = group.querySelectorAll(
        'input[type="checkbox"]:not([data-git-glider-checkbox])'
      );
      const checkedCheckboxes = group.querySelectorAll(
        'input[type="checkbox"]:checked:not([data-git-glider-checkbox])'
      );

      const insertedCheckbox = group.querySelector(
        "[data-git-glider-checkbox]"
      );

      if (checkboxes.length === checkedCheckboxes.length) {
        insertedCheckbox.checked = true;
      } else {
        insertedCheckbox.checked = false;
      }
    });

    const totalCheckedCheckboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked:not([data-git-glider-checkbox])'
    )?.length;
    const countSelectedText = document.querySelector(".js-count-selected-text");

    if (totalCheckedCheckboxes > 0) {
      countSelectedText.textContent = `${totalCheckedCheckboxes} selected`;
    } else {
      countSelectedText.textContent = "Select all";
    }
  };

  const [hasSelectedAllClosed, setHasSelectedAllClosed] = useState(false);

  const [hasSelectedAllFromDependabot, setHasSelectedAllFromDependabot] =
    useState(false);

  const selectAllFromDependabot = () => {
    const groups = getGroups();

    groups.forEach((group) => {
      const liElements = group.querySelectorAll("li");
      liElements.forEach((li) => {
        const isFromDependabot =
          li.querySelector('a[href="/apps/dependabot"]') ||
          li.textContent.includes("chore(deps");
        if (isFromDependabot) {
          const checkbox = li.querySelector(
            'input[type="checkbox"]:not([data-git-glider-checkbox])'
          );
          if (checkbox) {
            checkbox.click();
          }
        }
      });
    });

    setHasSelectedAllFromDependabot((prev) => {
      const button = document.querySelector(
        "[data-git-glider-select-all-from-dependabot]"
      );
      button.textContent = `✨ ${!prev ? "Unselect" : "Select"} all from Dependabot`;
      return !prev;
    });
  };

  const selectAllClosed = () => {
    const groups = getGroups();

    groups.forEach((group) => {
      const liElements = group.querySelectorAll("li");
      liElements.forEach((li) => {
        const hasGitMergeIcon = li.querySelector(".octicon-git-merge");
        const hasIssueClosedIcon = li.querySelector(".octicon-issue-closed");
        if (hasGitMergeIcon || hasIssueClosedIcon) {
          const checkbox = li.querySelector(
            'input[type="checkbox"]:not([data-git-glider-checkbox])'
          );
          if (checkbox) {
            checkbox.click();
          }
        }
      });
    });

    setHasSelectedAllClosed((prev) => {
      const button = document.querySelector(
        "[data-git-glider-select-all-closed]"
      );
      button.textContent = `✨ ${!prev ? "Unselect" : "Select"} all closed`;
      return !prev;
    });
  };

  const makeCheckboxesMenuSticky = () => {
    const countSelectedText = document.querySelector(".js-count-selected-text");

    const selectedCheckboxesMenu =
      countSelectedText.parentElement.parentElement.parentElement;

    selectedCheckboxesMenu.style.position = "sticky";
    selectedCheckboxesMenu.style["z-index"] = "999";
    selectedCheckboxesMenu.style["top"] = "0";

    appendTo(
      countSelectedText.parentElement.parentElement,
      <button
        data-git-glider-select-all-from-dependabot
        className="btn btn-sm"
        onClick={selectAllFromDependabot}
      >
        ✨ {hasSelectedAllFromDependabot ? "Unselect" : "Select"} all from
        Dependabot
      </button>
    );

    appendTo(
      countSelectedText.parentElement.parentElement,
      <button
        data-git-glider-select-all-closed
        className="btn btn-sm"
        onClick={selectAllClosed}
      >
        ✨ {hasSelectedAllClosed ? "Unselect" : "Select"} all closed
      </button>
    );
  };

  console.log({ hasSelectedAllClosed });

  useEffect(() => {
    makeCheckboxesMenuSticky();

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const originalHandlers = new Map();

    checkboxes.forEach((checkbox) => {
      originalHandlers.set(checkbox, checkbox.onclick);

      checkbox.onclick = (event) => {
        if (originalHandlers.get(checkbox)) {
          originalHandlers.get(checkbox)(event);
        }

        handleCheckedCount();
      };
    });

    return () => {
      checkboxes.forEach((checkbox) => {
        checkbox.onclick = originalHandlers.get(checkbox);
      });
    };
  }, []);

  useEffect(() => {
    const repos = document.querySelectorAll(".js-notifications-group");

    repos.forEach((repo, index) => {
      const title = repo.querySelector("h6");
      title.classList.add("GitGlider-NotificationGroupTitle");

      prependTo(
        title,
        <input
          data-git-glider-checkbox
          onChange={(e) => {
            console.log("Checkbox changed");
            const isChecked = e.target.checked;
            const group = repos[index] as HTMLElement;
            const checkboxes = group.querySelectorAll('input[type="checkbox"]');

            checkboxes.forEach((checkbox) => {
              checkbox.checked = isChecked;
            });
            handleCheckedCount();
          }}
          type="checkbox"
          className="float-left js-notification-bulk-action-check-item"
        />,
        "GitGlider-CheckboxContainer"
      );
    });
    console.log("NotificationsHandler");
  }, []);

  return null;
}
