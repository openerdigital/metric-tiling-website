/* eslint-disable no-alert */
import { Button } from "@primitives";
import React from "react";

const Row = (props: any) => {
  const { children } = props;
  return <div className="grid grid-cols-4 items-center gap-3">{children}</div>;
};

const wrapperStyles =
  "main-column align-start mt-5 grid justify-start gap-3 bg-(--Global-surfacePrimary) p-5";
const BoxEg = () => {
  return (
    <div className={wrapperStyles}>
      <p className="text-white">active buttons</p>
      <Row>
        <Button href="/">Button</Button>
        <Button variant="secondary" href="/">
          Button
        </Button>
        <Button variant="tertiary" href="/">
          Button
        </Button>
        <Button variant="textLink" href="/">
          Button
        </Button>
      </Row>

      <p className="text-white">disabled buttons</p>

      <Row>
        {/* eslint-disable-next-line no-alert */}
        <Button onClick={() => alert("hi")} disabled>
          Button
        </Button>
        <Button variant="secondary" onClick={() => alert("hi")} disabled>
          Button
        </Button>
        <Button variant="tertiary" onClick={() => alert("hi")} disabled>
          Button
        </Button>
        <Button variant="textLink" onClick={() => alert("hi")} disabled>
          Button
        </Button>
      </Row>
    </div>
  );
};

export default BoxEg;
