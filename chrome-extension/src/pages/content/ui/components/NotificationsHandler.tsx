import { appendTo, prependTo } from "@root/src/shared/utils";
import { useEffect } from "react";

export function NotificationsHandler() {
  const handleCheckedCount = () => {
    const groups = document.querySelectorAll(".js-notifications-group");

    console.log({ groups });

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

  const makeCheckboxesMenuSticky = () => {
    const countSelectedText = document.querySelector(".js-count-selected-text");

    const selectedCheckboxesMenu =
      countSelectedText.parentElement.parentElement.parentElement;

    selectedCheckboxesMenu.style.position = "sticky";
    selectedCheckboxesMenu.style["z-index"] = "999";
    selectedCheckboxesMenu.style["top"] = "0";
  };

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
