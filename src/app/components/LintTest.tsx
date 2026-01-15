import React from "react"; // Violation: Prettier (single quote)

// Violation: TypeScript (noUnusedLocals) - 'data' is declared but never used
const data = "some data";

// Violation: TypeScript (noImplicitAny) - 'props' implicitly has an 'any' type
const LintTest = (props) => {
  // Violation: ESLint (no-console) - Console logs are warnings/errors in production
  console.log("Rendering test component");

  // Violation: Prettier - Missing semicolon below
  const title = "Test Component";

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default LintTest;
