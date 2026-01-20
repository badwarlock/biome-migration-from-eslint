import React, { useEffect, useState } from "react";

interface Props {
  name: string;
  age?: number;
  onSubmit: (data: FormData) => void;
}

interface FormData {
  email: string;
  message: string;
}

export const ExampleComponent = ({ name, age, onSubmit }: Props) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Biome проверит зависимости useEffect
  useEffect(() => {
    console.log(`User ${name} loaded`);
  }, [name]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ email, message });
  };

  return (
    <div className="container">
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={message}
          rows={5}
          required
          onChange={e => setMessage(e.target.value)}
        />

        <button type="submit" disabled={!email || !message}>
          Submit
        </button>
      </form>
    </div>
  );
};
