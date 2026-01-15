import React from "react";

interface LintTestProps {
  message: string;
}

const LintTest = ({ message }: LintTestProps) => {
  const title = "Test Component";

  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
};

export default LintTest;
