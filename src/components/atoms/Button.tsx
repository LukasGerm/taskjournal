import { ParentComponent, JSX } from "solid-js";

interface ButtonProps {
  type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

export const Button: ParentComponent<ButtonProps> = (props) => {
  return (
    <button
      class="bg-primary hover:bg-primaryHover text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type={props.type || "button"}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
