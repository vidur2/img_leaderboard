import { Menu, MenuProps } from "antd";

const items: MenuProps["items"] = [
  {
    label: (
      <a href="/">
        Image Labelling
      </a>
    ),
    key: "home"
  },
   {
    label: (
      <a href="/leaderboard">Leaderboard</a>
    ),
    key: "leaderboard"
   },
   {
    label: (
      <a href="/login">Login</a>
    ),
    key: "login"
   },
   {
    label: (
      <a href="/sign_up">Sign Up</a>
    ),
    key: "signUp"
   }
]


function NavbarComponent() {
  return (
    <Menu items={items} mode="horizontal"></Menu>
  );
}

export default NavbarComponent;