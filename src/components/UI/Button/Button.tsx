import { Button } from "@mantine/core";

interface ButtonCompProps {
  content: string;
  onMethodChange?: () => void; // Define the type correctly
}

function ButtonComp({ content, onMethodChange }: ButtonCompProps) {
  return (
    <Button
      className="buttoncomp-ctn"
      styles={(theme) => ({
        root: {
          backgroundColor: theme.colors.munsellBlue[0],
          ...theme.fn.hover({
            backgroundColor: theme.fn.darken(theme.colors.munsellBlue[0], 0.1),
          }),
        },
      })}
      type="submit"
      onClick={onMethodChange}
    >
      {content}
    </Button>
  );
}

export default ButtonComp;
