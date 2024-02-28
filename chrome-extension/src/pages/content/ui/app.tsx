import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("content view loaded");

    // content.js

    // Fetch all elements that have data-testid starting with 'group-header-'
    const elements = document.querySelectorAll(
      '[data-testid^="group-header-"]'
    );

    console.log(">>>>", elements);
    // For each element...
    elements.forEach((element) => {
      // Create a new button
      const button = document.createElement("button");
      button.innerText = "My Button";
      button.style.display = "none"; // Hide the button by default

      // When the mouse enters the element, show the button
      element.addEventListener("mouseenter", () => {
        button.style.display = "inline"; // Show the button
      });

      // When the mouse leaves the element, hide the button
      element.addEventListener("mouseleave", () => {
        button.style.display = "none"; // Hide the button
      });

      // Append the button to the element
      element.appendChild(button);
    });
  }, []);

  return <div className="">content view</div>;
}
