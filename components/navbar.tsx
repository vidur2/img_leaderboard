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
    <Menu mode="horizontal" theme="light" style={{ marginLeft: "-7%", marginRight: "-7%", paddingLeft: "2%", paddingRight: "5%" }}>
      <Menu.Item><a href="/">Supervise Image</a></Menu.Item>
      <Menu.SubMenu key="SubMenu" title="Image Labelling" style={{ marginLeft: 'auto' }}>
        <Menu.Item><a href="/label">Label</a></Menu.Item>
        <Menu.Item><a href="/admin_check">Verify</a></Menu.Item>
      </Menu.SubMenu>
      <Menu.Item><a href="/leaderboard">Leaderboard</a></Menu.Item>
      <Menu.Item><a href="/login">Login</a></Menu.Item>
      <Menu.Item><a href="/sign_up">Sign Up</a></Menu.Item>
    </Menu>
  );
}

export default NavbarComponent;