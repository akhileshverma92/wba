import React, { useEffect, useState } from 'react';
import { account } from "../services/Appwriteconfig";

const Verify = () => {
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('secret');
    const userId = urlParams.get('userId');

    if (secret && userId) {
      account.createSession(userId, secret)
        .then(() => {
          setStatus("Login successful! Redirecting...");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        })
        .catch(() => setStatus("Login failed. The link may be invalid or expired."));
    } else {
      setStatus("Invalid verification link.");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-lg">{status}</p>
    </div>
  );
};

export default Verify;
    