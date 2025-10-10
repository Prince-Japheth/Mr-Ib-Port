import React from 'react';

// You don't need Metadata here since the root layout provides it

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}