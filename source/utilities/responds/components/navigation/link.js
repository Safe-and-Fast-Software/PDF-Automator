export default function linkComponent(innerHTML, linkLocation, classes="default") {
  return (/*HTML*/`
    <a href="${linkLocation}" class="${classes}" hx-push-url="true" hx-trigger="click" hx-target="#main" hx-get="${linkLocation}">
      ${innerHTML}
    </a>`
  );
}
