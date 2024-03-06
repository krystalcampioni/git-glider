import React, { useState } from "react";
import { Input, Select, Form, Button } from "../../FormElements";

export function RepoForm({ onSubmit }) {
  const [owner, setOwner] = useState("shopify");
  const [repo, setRepo] = useState("forms");
  const [author, setAuthor] = useState("krystalcampioni");
  const [fileExtension, setFileExtension] = useState("tsx");
  const [since, setSince] = useState("2023-02-01");
  const [state, setState] = useState("merged");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ owner, repo, author, fileExtension, since, state });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input label="Owner" value={owner} onChange={setOwner} width="100px" />
      <Input label="Repo" value={repo} onChange={setRepo} width="100px" />
      <Input label="Author" value={author} onChange={setAuthor} width="140px" />
      <Input
        label="File Extension"
        value={fileExtension}
        onChange={setFileExtension}
        width="120px"
      />
      <Input
        type="date"
        label="Since"
        value={since}
        onChange={setSince}
        width="150px"
      />
      <Select
        label="State"
        value={state}
        onChange={setState}
        options={["all", "open", "closed", "merged"]}
        width="100px"
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}

export default RepoForm;
