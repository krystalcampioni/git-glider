import { useState } from "react";
import { ProjectBoardHandler } from "./components/ProjectBoardHandler";
import { TaskListHandler } from "./components/TaskListHandler";
import { NotificationsHandler } from "./components/NotificationsHandler";
import { useEffect } from "react";
import { faker } from "@faker-js/faker";

function generateValueByPattern(pattern) {
  // Email pattern
  if (pattern === "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$") {
    return faker.internet.email();
  }

  // Number pattern
  if (pattern === "[0-9]") {
    return faker.number.int({ min: 1, max: 10 }).toString();
  }

  // Phone number pattern
  if (pattern === "\\d{3}[\\-]\\d{3}[\\-]\\d{4}") {
    return faker.phone.number();
  }

  // Password pattern
  if (pattern === "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}") {
    return faker.internet.password(
      8,
      true,
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    );
  }

  // Postal code pattern
  if (pattern === "[A-Z]{2}\\d{5}") {
    return faker.location.zipCode("??#####");
  }

  // Username pattern
  if (pattern === "[a-zA-Z0-9_]{1,}") {
    return faker.internet.userName();
  }
  return null;
}

function dispatchInputEvent(input, value) {
  if (value !== undefined) {
    let event = new Event("input", { bubbles: true });
    input.value = value;
    input.dispatchEvent(event);
  }
}

function fillFormWithFakerData(element) {
  console.log(">>>>>>", { element });
  let formElement =
    element.tagName === "FORM" ? element : element.closest("form");
  if (element.shadowRoot) {
    const shadowFormElement = element.shadowRoot.querySelector("form");
    if (shadowFormElement) {
      formElement = shadowFormElement;
    }
  }
  if (!formElement) {
    console.error("No form found");
    return;
  }
  const inputs = formElement.querySelectorAll("input, textarea, select");

  inputs.forEach((input) => {
    let value;
    let type = input.hasAttribute("inputmode")
      ? input.getAttribute("inputmode")
      : input.type;

    if (input.hasAttribute("pattern")) {
      const pattern = input.getAttribute("pattern");
      value = generateValueByPattern(pattern);

      return dispatchInputEvent(input, value);
    }

    switch (type) {
      case "text":
      case "textarea":
      case "search":
      case "url":
        value = faker.lorem.word();
        break;
      case "email":
        value = faker.internet.email({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          provider: `${faker.word.adjective()}.com`,
        });
        break;
      case "tel":
        value = faker.phone.number();
        break;
      case "numeric":
      case "decimal":
        value = faker.number.int({ min: 10, max: 100 }).toString();
        break;
      case "date":
        value = faker.date.past().toISOString().split("T")[0];
        break;
      case "select-one":
        const options = input.querySelectorAll("option");
        if (options.length) {
          const randomIndex = faker.number.int({
            min: 0,
            max: options.length - 1,
          });
          input.selectedIndex = randomIndex;
        }
        break;
      // Add more cases as needed
      default:
        break;
    }

    dispatchInputEvent(input, value);
  });
}

export default function App() {
  const [lastElementClicked, setLastElementClicked] = useState(null);

  useEffect(() => {
    document.addEventListener("contextmenu", function (event) {
      setLastElementClicked(event.target);
    });

    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        if (request.action === "fillWithFaker") {
          requestAnimationFrame(() => {
            fillFormWithFakerData(lastElementClicked || document.activeElement);
          });
        }
      }
    );
  }, []);
  if (!window.location.hostname.includes("github")) return null;

  return (
    <>
      <ProjectBoardHandler />
      <TaskListHandler />
      <NotificationsHandler />
    </>
  );
}
