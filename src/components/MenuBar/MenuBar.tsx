import { Group, Container, Menu, ActionIcon } from "@mantine/core";
import { IconChevronsDown } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function convertToLink(text: string): string {
  return text.replace(/ /g, "-");
}

function MenuBar({ links }: CategoryList) {
  const items = links.slice(0, 5).map((link) => {
    return (
      <Link
        key={link.id}
        // to={`/${convertToLink(link.name)}`}
        to={`category/${link.id}`}
        className="link"
        // onClick={(event) => event.preventDefault()}
      >
        {link.name}
      </Link>
    );
  });

  const menuItems = links.slice(5).map((link) => (
    <Menu.Item key={link.id}>
      <Link
        key={link.id}
        // to={`/${convertToLink(link.name)}`}
        to={`category/${link.id}`}
        className="link"
        // onClick={(event) => event.preventDefault()}
      >
        {link.name}
      </Link>
    </Menu.Item>
  ));

  return (
    <Container size={1090} className="menubar">
      <div className="inner">
        <Group className="inner-group">
          {menuItems.length && (
            <Menu position="bottom-start" shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon className="downIcon">
                  <IconChevronsDown size="1.125rem" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>{menuItems}</Menu.Dropdown>
            </Menu>
          )}
          {items}
          <Link to="/nearest_branch" className="link">
            Hệ thống nhà thuốc
          </Link>
        </Group>
      </div>
    </Container>
  );
}

export default MenuBar;
